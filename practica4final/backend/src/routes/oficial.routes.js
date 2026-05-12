// Endpoints del Cómputo Oficial.
import { Router } from 'express';
import { oficialRepo } from '../repositories/oficialRepository.js';
import { oficialService } from '../services/oficial/oficialService.js';

export const oficialRouter = Router();

/**
 * Inserta un acta oficial (vía CSV, n8n, o formulario web simple).
 * Body: { codigo_mesa, votos_emitidos, ausentismo, p1..p4, votos_blancos, votos_nulos,
 *         fuente?, creado_por? }
 */
oficialRouter.post('/acta', async (req, res, next) => {
    try {
        const r = await oficialService.procesarActaSimple(req.body);
        const code = r.status === 'APROBADA' ? 200
                  : r.status === 'EN_CUARENTENA' ? 202
                  : 422;
        res.status(code).json(r);
    } catch (err) {
        next(err);
    }
});

/**
 * Crea una sesión de transcripción (vía manual o N8N).
 * Body: { codigo_mesa, via: 'MANUAL'|'N8N' }
 */
oficialRouter.post('/sesion', async (req, res) => {
    const codigoMesa = Number(req.body?.codigo_mesa);
    const via = req.body?.via || 'MANUAL';

    if (!codigoMesa) return res.status(400).json({ error: 'codigo_mesa requerido' });
    const mesa = await oficialRepo.existeMesa(codigoMesa);
    if (!mesa) return res.status(404).json({ error: 'mesa no existe' });

    const sessionId = await oficialRepo.crearSesion(codigoMesa, via);
    res.json({ session_id: sessionId, codigo_mesa: codigoMesa, via });
});

/**
 * Inserta una transcripción de un operador en la sesión.
 * Body: { session_id, codigo_mesa, operador_id, ...datos }
 */
oficialRouter.post('/transcripcion', async (req, res) => {
    const { session_id, codigo_mesa, operador_id, ...datos } = req.body || {};
    if (!session_id || !codigo_mesa || !operador_id) {
        return res.status(400).json({ error: 'session_id, codigo_mesa, operador_id requeridos' });
    }
    const r = await oficialService.insertarTranscripcion(session_id, Number(codigo_mesa), Number(operador_id), datos);
    res.json(r);
});

oficialRouter.get('/mesa/:codigo', async (req, res) => {
    const acta = await oficialRepo.actaPorMesa(parseInt(req.params.codigo, 10));
    if (!acta) return res.status(404).json({ error: 'sin acta para esta mesa' });
    res.json(acta);
});

/**
 * Info de la mesa según el padrón (para auto-rellenar el formulario).
 */
oficialRouter.get('/mesa-info/:codigo', async (req, res, next) => {
    try {
        const info = await oficialRepo.padronInfo(parseInt(req.params.codigo, 10));
        if (!info) return res.status(404).json({ error: 'mesa no existe en padrón' });
        res.json(info);
    } catch (err) { next(err); }
});

/**
 * Resumen oficial para el dashboard.
 */
oficialRouter.get('/resumen', async (_req, res) => {
    const [totales, participacion, estados, ingesta, errores] = await Promise.all([
        oficialRepo.totalesPorCandidato(),
        oficialRepo.participacionPorDepartamento(),
        oficialRepo.estadoActas(),
        oficialRepo.ingestaPorHora(),
        oficialRepo.topErrores(),
    ]);
    res.json({ totales, participacion, estados, ingesta, errores });
});

// ============================================================
// CRUD de Actas
// ============================================================

oficialRouter.get('/actas', async (req, res, next) => {
    try {
        const { limit, estado, mesa } = req.query;
        const actas = await oficialRepo.listarActas({
            limit: limit ? parseInt(limit, 10) : 50,
            estado: estado || undefined,
            mesa: mesa ? parseInt(mesa, 10) : undefined,
        });
        res.json(actas);
    } catch (err) { next(err); }
});

oficialRouter.delete('/acta/:id', async (req, res, next) => {
    try {
        const { motivo, modificado_por } = req.body || {};
        const r = await oficialRepo.anularActa(req.params.id, motivo, modificado_por);
        if (!r) return res.status(404).json({ error: 'acta no encontrada' });
        res.json({ status: 'ANULADA', ...r });
    } catch (err) { next(err); }
});

/**
 * Cambiar estado del acta (rechazar / poner en observación / aprobar).
 */
oficialRouter.patch('/acta/:id/estado', async (req, res, next) => {
    try {
        const { estado, motivo, modificado_por } = req.body || {};
        const validos = ['APROBADA', 'PENDIENTE', 'EN_CUARENTENA', 'RECHAZADA', 'ANULADA'];
        if (!validos.includes(estado)) {
            return res.status(400).json({ error: `estado debe ser uno de: ${validos.join(', ')}` });
        }
        const r = await oficialRepo.cambiarEstadoActa(req.params.id, estado, motivo, modificado_por);
        if (!r) return res.status(404).json({ error: 'acta no encontrada' });
        res.json({ status: 'OK', ...r });
    } catch (err) { next(err); }
});

/**
 * Auditoría: event log de acta_oficial.
 */
oficialRouter.get('/eventos', async (req, res, next) => {
    try {
        const { limit, tipo, mesa } = req.query;
        const evs = await oficialRepo.eventosRecientes({
            limit: limit ? parseInt(limit, 10) : 100,
            tipo: tipo || undefined,
            mesa: mesa ? parseInt(mesa, 10) : undefined,
        });
        res.json(evs);
    } catch (err) { next(err); }
});

oficialRouter.get('/logs-errores', async (req, res, next) => {
    try {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
        const logs = await oficialRepo.logsErrores(limit);
        res.json(logs);
    } catch (err) { next(err); }
});

/**
 * Ganador por territorio (departamento / provincia / municipio / recinto).
 */
oficialRouter.get('/ganador', async (req, res, next) => {
    try {
        const nivel = (req.query.nivel || 'departamento').toString();
        const data = await oficialRepo.ganadorPor(nivel);
        res.json({ nivel, data });
    } catch (err) { next(err); }
});

/**
 * Distribución de cierre de mesas por hora del día.
 */
oficialRouter.get('/top-horarios', async (_req, res, next) => {
    try {
        const data = await oficialRepo.topPorRangoHora();
        res.json(data);
    } catch (err) { next(err); }
});

oficialRouter.get('/ingesta-24h', async (_req, res, next) => {
    try {
        const data = await oficialRepo.ingestaPorHoraCompleta();
        res.json(data);
    } catch (err) { next(err); }
});

// ============================================================
// CRUD de Mesas
// ============================================================

oficialRouter.get('/mesas', async (req, res, next) => {
    try {
        const { limit, recinto, q } = req.query;
        const mesas = await oficialRepo.listarMesas({
            limit: limit ? parseInt(limit, 10) : 100,
            recinto: recinto ? parseInt(recinto, 10) : undefined,
            q: q || undefined,
        });
        res.json(mesas);
    } catch (err) { next(err); }
});

oficialRouter.post('/mesa', async (req, res, next) => {
    try {
        const { codigo_mesa, nro_mesa, cantidad_habilitada, id_recinto } = req.body || {};
        if (!codigo_mesa || !nro_mesa || !cantidad_habilitada || !id_recinto) {
            return res.status(400).json({ error: 'codigo_mesa, nro_mesa, cantidad_habilitada e id_recinto son requeridos' });
        }
        const recintoOk = await oficialRepo.existeRecinto(parseInt(id_recinto, 10));
        if (!recintoOk) return res.status(404).json({ error: 'recinto no existe' });

        const mesa = await oficialRepo.crearMesa({
            codigo_mesa: parseInt(codigo_mesa, 10),
            nro_mesa: parseInt(nro_mesa, 10),
            cantidad_habilitada: parseInt(cantidad_habilitada, 10),
            id_recinto: parseInt(id_recinto, 10),
        });
        res.status(201).json(mesa);
    } catch (err) {
        if (err.code === '23505') {
            return res.status(409).json({ error: 'mesa ya existe (codigo_mesa duplicado o recinto+nro_mesa duplicado)' });
        }
        next(err);
    }
});

oficialRouter.delete('/mesa/:codigo', async (req, res, next) => {
    try {
        const r = await oficialRepo.eliminarMesa(parseInt(req.params.codigo, 10));
        if (!r) return res.status(404).json({ error: 'mesa no encontrada' });
        res.json({ status: 'ELIMINADA', ...r });
    } catch (err) {
        if (err.code === 'MESA_CON_ACTAS') {
            return res.status(409).json({ error: err.message });
        }
        next(err);
    }
});

oficialRouter.get('/recintos', async (_req, res, next) => {
    try {
        const recintos = await oficialRepo.listarRecintos();
        res.json(recintos);
    } catch (err) { next(err); }
});
