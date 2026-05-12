// Endpoints de salud / estado del cluster.
// - Postgres: primary + standbys + lag de replicación + conteo de filas por nodo
// - MongoDB: rs.status() del replica set + conteo de docs por miembro
// Lectura limpia, no modifica nada. El frontend lo usa para mostrar el panel "Cluster Health".

import { Router } from 'express';
import pkg from 'pg';
import { MongoClient } from 'mongodb';
import { config } from '../config/env.js';
import { getMongo } from '../config/mongo.js';
import { pgWrite, pgRead } from '../config/postgres.js';

const { Pool } = pkg;

export const healthRouter = Router();

// Pools efímeros para chequear nodos individualmente (puertos 5432, 5442, 5443).
async function checkPgNode(host, port, role) {
    const t0 = Date.now();
    const pool = new Pool({
        host,
        port,
        user: config.postgres.user,
        password: config.postgres.password,
        database: config.postgres.database,
        connectionTimeoutMillis: 1500,
        max: 1,
    });
    try {
        const meta = await pool.query(`
            SELECT
                current_database() AS db,
                pg_is_in_recovery() AS in_recovery,
                pg_postmaster_start_time() AS started_at
        `);

        // Conteos por tabla — solo si existen (algunas tablas pueden no haberse creado)
        const conteos = {};
        const tablas = ['votos_oficiales', 'mesas_electorales', 'recintos_electorales',
                        'distribucion_territorial', 'eventos_acta_oficial', 'logs_oficial'];
        for (const t of tablas) {
            try {
                const r = await pool.query(`SELECT COUNT(*)::int AS n FROM ${t}`);
                conteos[t] = r.rows[0].n;
            } catch {
                conteos[t] = null; // Tabla inexistente
            }
        }

        const reps = await pool.query(`
            SELECT application_name, client_addr, state, sync_state,
                   pg_wal_lsn_diff(sent_lsn, replay_lsn) AS replay_lag_bytes
            FROM pg_stat_replication
        `).catch(() => ({ rows: [] }));

        return {
            role,
            host,
            port,
            status: 'UP',
            in_recovery: meta.rows[0].in_recovery,
            started_at: meta.rows[0].started_at,
            db: meta.rows[0].db,
            conteos,
            total_filas: Object.values(conteos).reduce((a, b) => a + (b || 0), 0),
            replicas_conectadas: reps.rows,
            response_ms: Date.now() - t0,
        };
    } catch (err) {
        return {
            role,
            host,
            port,
            status: 'DOWN',
            error: err.message,
            response_ms: Date.now() - t0,
        };
    } finally {
        await pool.end().catch(() => { });
    }
}

healthRouter.get('/postgres-cluster', async (_req, res) => {
    const host = config.postgres.host;
    const nodos = [
        { host, port: 5432, role: 'PRIMARY' },
        { host, port: 5442, role: 'STANDBY_1' },
        { host, port: 5443, role: 'STANDBY_2' },
    ];

    const resultados = await Promise.all(nodos.map((n) => checkPgNode(n.host, n.port, n.role)));
    const haproxy = await checkPgNode(host, config.postgres.portRead, 'HAPROXY_READ');

    // Detectar discrepancias entre nodos
    const filasPorNodo = resultados.filter((r) => r.status === 'UP').map((r) => r.total_filas);
    const sincronizados = filasPorNodo.length > 1 && filasPorNodo.every((n) => n === filasPorNodo[0]);

    const arriba = resultados.filter((r) => r.status === 'UP').length;
    res.json({
        cluster: 'postgres',
        nodos: resultados,
        haproxy,
        resumen: {
            total: resultados.length,
            arriba,
            abajo: resultados.length - arriba,
            sincronizados,
            ts: new Date().toISOString(),
        },
    });
});

// Verifica que un dato escrito en primary esté presente en ambos standbys.
healthRouter.get('/postgres-replicacion-test', async (_req, res) => {
    const tag = `t-${Date.now()}-${Math.floor(Math.random() * 9999)}`;
    try {
        await pgWrite.query(`
            CREATE TABLE IF NOT EXISTS _replication_check (
                tag TEXT PRIMARY KEY,
                creado_en TIMESTAMPTZ NOT NULL DEFAULT NOW()
            )
        `);
        await pgWrite.query(`INSERT INTO _replication_check (tag) VALUES ($1)`, [tag]);

        await new Promise((r) => setTimeout(r, 400));

        async function leerEn(host, port, role) {
            const p = new Pool({
                host, port,
                user: config.postgres.user,
                password: config.postgres.password,
                database: config.postgres.database,
                connectionTimeoutMillis: 1500,
                max: 1,
            });
            try {
                const r = await p.query(`SELECT tag FROM _replication_check WHERE tag = $1`, [tag]);
                return { role, host, port, replicado: r.rowCount > 0 };
            } catch (err) {
                return { role, host, port, replicado: false, error: err.message };
            } finally {
                await p.end().catch(() => { });
            }
        }

        const host = config.postgres.host;
        const checks = await Promise.all([
            leerEn(host, 5432, 'PRIMARY'),
            leerEn(host, 5442, 'STANDBY_1'),
            leerEn(host, 5443, 'STANDBY_2'),
        ]);

        await pgWrite.query(`DELETE FROM _replication_check WHERE tag = $1`, [tag]).catch(() => { });

        const todos = checks.every((c) => c.replicado);
        res.json({
            tag,
            todos_replicados: todos,
            nodos: checks,
            ts: new Date().toISOString(),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Conecta a un nodo Mongo individual y obtiene conteo de documentos clave.
async function checkMongoNode(host, replicaSet) {
    const t0 = Date.now();
    const uri = `mongodb://${host}/?directConnection=true&serverSelectionTimeoutMS=2000`;
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 2000 });
    try {
        await client.connect();
        const db = client.db(config.mongo.dbName);

        const colecciones = ['actas_rrv', 'logs_rrv', 'sms_numeros_autorizados', 'sms_mensajes_recibidos'];
        const conteos = {};
        for (const c of colecciones) {
            try {
                conteos[c] = await db.collection(c).countDocuments();
            } catch {
                conteos[c] = null;
            }
        }

        const hello = await db.admin().command({ hello: 1 }).catch(() => null);
        return {
            host,
            status: 'UP',
            es_primario: hello?.isWritablePrimary || false,
            secundario: hello?.secondary || false,
            conteos,
            total_docs: Object.values(conteos).reduce((a, b) => a + (b || 0), 0),
            response_ms: Date.now() - t0,
        };
    } catch (err) {
        return {
            host,
            status: 'DOWN',
            error: err.message,
            response_ms: Date.now() - t0,
        };
    } finally {
        await client.close().catch(() => { });
    }
}

healthRouter.get('/mongo-replica', async (_req, res) => {
    try {
        const db = getMongo();
        const admin = db.admin();
        const status = await admin.command({ replSetGetStatus: 1 }).catch(() => null);
        const hello = await admin.command({ hello: 1 }).catch(() => null);

        if (!status && !hello) {
            return res.json({
                cluster: 'mongo',
                modo: 'standalone-or-atlas-managed',
                nota: 'replSetGetStatus no disponible. Atlas managed o usuario sin privilegios.',
            });
        }

        // Si tenemos status del replica set, hacemos conteo por nodo
        const hostsMiembros = status?.members?.map((m) => m.name) || [];
        const conteoPorNodo = await Promise.all(
            hostsMiembros.map((h) => checkMongoNode(h, status?.set))
        );

        const miembros = (status?.members || []).map((m, i) => {
            const conteo = conteoPorNodo[i];
            return {
                id: m._id,
                nombre: m.name,
                estado: m.stateStr,
                salud: m.health,
                uptime_segundos: m.uptime,
                optime: m.optimeDate,
                ping_ms: m.pingMs,
                es_primario: m.stateStr === 'PRIMARY',
                conteos: conteo?.conteos || null,
                total_docs: conteo?.total_docs ?? null,
                directo_status: conteo?.status || 'UNKNOWN',
                directo_error: conteo?.error || null,
            };
        });

        // Detectar discrepancias entre nodos UP
        const totalDocsPorNodo = miembros
            .filter((m) => m.directo_status === 'UP')
            .map((m) => m.total_docs);
        const sincronizados = totalDocsPorNodo.length > 1 &&
                              totalDocsPorNodo.every((n) => n === totalDocsPorNodo[0]);

        res.json({
            cluster: 'mongo',
            replica_set: status?.set || hello?.setName,
            miembros,
            primary: hello?.primary,
            sincronizados,
            ok: !!status?.ok,
            ts: new Date().toISOString(),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

healthRouter.get('/mongo-replicacion-test', async (_req, res) => {
    try {
        const db = getMongo();
        const tag = `t-${Date.now()}`;
        const col = db.collection('_replication_check');
        await col.insertOne({ tag, creado_en: new Date() });

        await new Promise((r) => setTimeout(r, 400));

        const desdePrimary = await col.findOne({ tag }, { readPreference: 'primary' });
        const desdeSecondary = await col.findOne({ tag }, { readPreference: 'secondaryPreferred' });

        await col.deleteOne({ tag }).catch(() => { });

        res.json({
            tag,
            primary_ve: !!desdePrimary,
            secondary_ve: !!desdeSecondary,
            ts: new Date().toISOString(),
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

healthRouter.get('/all', async (_req, res) => {
    try {
        const [pgInfo, mongoInfo] = await Promise.all([
            (async () => {
                try {
                    const w = await pgWrite.query('SELECT pg_is_in_recovery() AS recovery');
                    const r = await pgRead.query('SELECT pg_is_in_recovery() AS recovery');
                    return { write_recovery: w.rows[0].recovery, read_recovery: r.rows[0].recovery, ok: true };
                } catch (err) { return { ok: false, error: err.message }; }
            })(),
            (async () => {
                try {
                    const db = getMongo();
                    await db.admin().ping();
                    return { ok: true };
                } catch (err) { return { ok: false, error: err.message }; }
            })(),
        ]);
        res.json({ postgres: pgInfo, mongo: mongoInfo, ts: new Date().toISOString() });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});
