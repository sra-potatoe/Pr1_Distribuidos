'use client';

import { useEffect, useState } from 'react';
import {
    Server, Database, RefreshCw, CheckCircle, XCircle, AlertTriangle,
    Crown, Copy, Clock, GitBranch, Send, Layers,
} from 'lucide-react';
import { api } from '@/lib/api';

/* ─── ESTILOS ─── */
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap');

  :root {
    --ink:       #0b0f1a;
    --ink-2:     #111827;
    --ink-3:     #1a2236;
    --ink-4:     #1e293b;
    --glass:     rgba(255,255,255,0.035);
    --glass-b:   rgba(255,255,255,0.07);
    --rim:       rgba(255,255,255,0.07);
    --rim-2:     rgba(255,255,255,0.11);
    --gold:      #c9a84c;
    --gold-soft: #e8c96b;
    --gold-dim:  rgba(201,168,76,0.12);
    --blue:      #4e9af1;
    --blue-dim:  rgba(78,154,241,0.12);
    --green:     #34d399;
    --green-dim: rgba(52,211,153,0.11);
    --red:       #e05c5c;
    --red-dim:   rgba(224,92,92,0.11);
    --amber:     #f59e0b;
    --amber-dim: rgba(245,158,11,0.11);
    --cyan:      #22d3ee;
    --cyan-dim:  rgba(34,211,238,0.11);
    --text:      #e8eaf0;
    --text-2:    #9ba3b4;
    --text-3:    #5c6479;
    --r:         10px;
    --r-lg:      16px;
    --shadow:    0 8px 40px rgba(0,0,0,0.55);
    --tr:        0.2s cubic-bezier(0.4,0,0.2,1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body { font-family: 'DM Sans', sans-serif; background: var(--ink); color: var(--text); }

  .page-root {
    padding: 32px;
    min-height: 100vh;
    background:
      radial-gradient(ellipse 70% 45% at 50% -5%, rgba(34,211,238,0.04) 0%, transparent 65%),
      radial-gradient(ellipse 50% 35% at 0% 100%, rgba(52,211,153,0.04) 0%, transparent 60%),
      var(--ink);
  }

  .page-root::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0; height: 2px;
    background: linear-gradient(90deg, transparent, var(--cyan), var(--green), var(--cyan), transparent);
    z-index: 100;
  }

  /* ── HEADER ── */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 36px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--rim);
    flex-wrap: wrap;
    gap: 16px;
  }

  .header-icon {
    width: 50px; height: 50px;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--cyan-dim), var(--green-dim));
    border: 1px solid rgba(34,211,238,0.2);
    display: flex; align-items: center; justify-content: center;
    color: var(--cyan);
    flex-shrink: 0;
  }

  .page-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.15em; text-transform: uppercase;
    color: var(--cyan); margin-bottom: 4px;
  }

  .page-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem; font-weight: 400;
    color: var(--text); letter-spacing: -0.02em; line-height: 1.1;
  }

  .page-lead { font-size: 13px; color: var(--text-3); margin-top: 3px; font-weight: 300; }

  /* ── HEADER ACTIONS ── */
  .header-actions { display: flex; align-items: center; gap: 10px; }

  .time-badge {
    display: flex; align-items: center; gap: 7px;
    padding: 8px 14px;
    background: var(--ink-3);
    border: 1px solid var(--rim);
    border-radius: 30px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; color: var(--text-3);
  }

  .btn-secondary {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px;
    background: var(--ink-3); border: 1px solid var(--rim);
    border-radius: 9px; color: var(--text-2);
    font-size: 13px; font-weight: 500; cursor: pointer;
    transition: var(--tr); font-family: 'DM Sans', sans-serif;
  }
  .btn-secondary:hover:not(:disabled) { border-color: var(--rim-2); color: var(--text); }
  .btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-primary {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px;
    background: linear-gradient(135deg, rgba(34,211,238,0.18), rgba(52,211,153,0.14));
    border: 1px solid rgba(34,211,238,0.28);
    border-radius: 9px; color: var(--cyan);
    font-size: 13px; font-weight: 600; cursor: pointer;
    transition: var(--tr); font-family: 'DM Sans', sans-serif;
  }
  .btn-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(34,211,238,0.26), rgba(52,211,153,0.2));
    box-shadow: 0 4px 16px rgba(34,211,238,0.12);
    transform: translateY(-1px);
  }
  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  /* ── SECTION HEADER ── */
  .section-wrap { margin-bottom: 36px; }

  .section-header {
    display: flex; align-items: center; gap: 12px;
    margin-bottom: 18px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--rim);
    flex-wrap: wrap;
  }

  .section-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.35rem; font-weight: 400;
    color: var(--text); letter-spacing: -0.01em;
    display: flex; align-items: center; gap: 10px;
  }

  /* ── NODO GRID ── */
  .nodes-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 20px;
  }

  /* ── NODO CARD ── */
  .nodo-card {
    background: var(--glass);
    border: 1px solid var(--rim);
    border-radius: var(--r-lg);
    padding: 20px;
    backdrop-filter: blur(8px);
    transition: var(--tr);
    position: relative;
    overflow: hidden;
  }

  .nodo-card:hover { border-color: var(--rim-2); transform: translateY(-2px); box-shadow: var(--shadow); }

  .nodo-accent-bar {
    position: absolute; top: 0; left: 0; right: 0; height: 2px;
  }

  .nodo-card-header {
    display: flex; justify-content: space-between;
    align-items: flex-start; margin-bottom: 16px;
  }

  .nodo-icon-wrap {
    width: 36px; height: 36px;
    border-radius: 10px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
  }

  .nodo-role {
    font-size: 13px; font-weight: 700; color: var(--text);
    font-family: 'JetBrains Mono', monospace;
  }

  .nodo-host {
    font-size: 11px; color: var(--text-3);
    font-family: 'JetBrains Mono', monospace;
    margin-top: 2px;
  }

  /* ── ROW ── */
  .nodo-row {
    display: flex; justify-content: space-between; align-items: center;
    padding: 6px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 12.5px;
  }
  .nodo-row:last-child { border-bottom: none; }
  .nodo-row-label { color: var(--text-3); font-family: 'JetBrains Mono', monospace; font-size: 11px; letter-spacing: 0.04em; }
  .nodo-row-value { color: var(--text); font-weight: 500; }

  .replicas-box {
    margin-top: 12px; padding: 12px;
    background: var(--ink-3);
    border: 1px solid var(--rim);
    border-radius: 8px;
  }
  .replicas-box-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px; letter-spacing: 0.12em; text-transform: uppercase;
    color: var(--text-3); margin-bottom: 8px;
  }
  .replica-item {
    font-size: 12px; color: var(--text-2); margin-bottom: 4px;
    display: flex; align-items: center; gap: 6px;
  }

  /* ── CARDS ── */
  .card {
    background: var(--glass);
    border: 1px solid var(--rim);
    border-radius: var(--r-lg);
    padding: 22px;
    margin-bottom: 18px;
    backdrop-filter: blur(8px);
  }

  .card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1rem; font-weight: 400; color: var(--text);
    margin-bottom: 16px; padding-bottom: 12px;
    border-bottom: 1px solid var(--rim);
    display: flex; align-items: center; gap: 10px;
    letter-spacing: -0.01em;
  }

  .card-row {
    display: flex; justify-content: space-between; align-items: center;
    margin-bottom: 14px; flex-wrap: wrap; gap: 10px;
  }

  .card-desc { font-size: 13px; color: var(--text-3); margin-bottom: 16px; font-weight: 300; line-height: 1.5; }

  /* ── BADGES ── */
  .badge {
    display: inline-flex; align-items: center; gap: 4px;
    padding: 3px 10px; border-radius: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.04em; white-space: nowrap;
  }
  .badge-green  { background: var(--green-dim); color: var(--green); border: 1px solid rgba(52,211,153,0.2); }
  .badge-cyan   { background: var(--cyan-dim);  color: var(--cyan);  border: 1px solid rgba(34,211,238,0.2); }
  .badge-amber  { background: var(--amber-dim); color: var(--amber); border: 1px solid rgba(245,158,11,0.2); }
  .badge-red    { background: var(--red-dim);   color: var(--red);   border: 1px solid rgba(224,92,92,0.2); }
  .badge-muted  { background: rgba(255,255,255,0.06); color: var(--text-3); border: 1px solid var(--rim); }
  .badge-blue   { background: var(--blue-dim); color: var(--blue); border: 1px solid rgba(78,154,241,0.2); }

  /* ── WARN ALERT ── */
  .alert-amber {
    display: flex; align-items: flex-start; gap: 14px;
    padding: 16px 18px;
    background: var(--amber-dim); border: 1px solid rgba(245,158,11,0.22);
    border-radius: var(--r); margin-bottom: 18px;
    color: var(--amber);
  }
  .alert-amber strong { font-size: 13px; font-weight: 700; display: block; margin-bottom: 4px; }
  .alert-amber p { font-size: 12.5px; color: rgba(245,158,11,0.75); margin: 0; line-height: 1.5; }

  /* ── TABLES ── */
  .table-wrap { overflow-x: auto; }
  table { width: 100%; border-collapse: separate; border-spacing: 0; }
  thead th {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px; font-weight: 500;
    letter-spacing: 0.1em; text-transform: uppercase;
    color: var(--text-3); padding: 8px 14px;
    text-align: left; border-bottom: 1px solid var(--rim); white-space: nowrap;
  }
  tbody tr { transition: var(--tr); }
  tbody tr:hover { background: rgba(255,255,255,0.02); }
  tbody td {
    padding: 10px 14px; border-bottom: 1px solid rgba(255,255,255,0.04);
    color: var(--text-2); font-size: 12.5px; vertical-align: middle;
  }
  tbody tr:last-child td { border-bottom: none; }
  code {
    font-family: 'JetBrains Mono', monospace; font-size: 11px;
    background: var(--ink-3); border: 1px solid var(--rim);
    padding: 2px 7px; border-radius: 5px; color: var(--text-2);
  }

  /* ── RESULTADO TEST ── */
  .result-pill {
    display: flex; align-items: flex-start; gap: 12px;
    padding: 16px 18px; border-radius: var(--r); border: 1px solid;
    margin-top: 16px;
  }
  .result-pill.ok   { background: var(--green-dim); border-color: rgba(52,211,153,0.22); color: var(--green); }
  .result-pill.warn { background: var(--amber-dim); border-color: rgba(245,158,11,0.22); color: var(--amber); }
  .result-pill.err  { background: var(--red-dim);   border-color: rgba(224,92,92,0.22);  color: var(--red); }

  .result-pill strong { color: inherit; font-size: 13.5px; }

  .test-nodes-grid {
    display: grid; gap: 8px; margin-top: 14px; width: 100%;
    grid-template-columns: repeat(3, 1fr);
  }
  .test-nodes-grid.two { grid-template-columns: repeat(2, 1fr); }

  .test-node-box {
    padding: 12px; border-radius: 9px; text-align: center;
    border: 1px solid;
  }
  .test-node-box.ok   { background: var(--green-dim); border-color: rgba(52,211,153,0.2); }
  .test-node-box.fail { background: var(--red-dim);   border-color: rgba(224,92,92,0.2);  }

  .test-node-role {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px; font-weight: 700; letter-spacing: 0.06em;
    margin-top: 6px; color: var(--text);
  }
  .test-node-port { font-size: 10px; color: var(--text-3); margin-top: 2px; font-family: 'JetBrains Mono', monospace; }

  .error-text { font-size: 11px; color: var(--red); margin-top: 6px; word-break: break-word; line-height: 1.4; }

  /* ── SYNC TAG ── */
  .sync-chip {
    display: inline-block;
    margin-left: 8px; padding: 2px 8px;
    border-radius: 5px; font-size: 10px; font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
  }
  .sync-chip.ok   { background: var(--green-dim); color: var(--green); }
  .sync-chip.warn { background: var(--amber-dim); color: var(--amber); }

  /* ── DELTA CHIP ── */
  .delta-chip {
    display: inline-block;
    margin-left: 7px; padding: 2px 7px;
    border-radius: 5px; font-size: 10px; font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
  }
  .delta-ok   { background: var(--green-dim); color: var(--green); }
  .delta-warn { background: var(--amber-dim); color: var(--amber); }

  @keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }

  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
`;

export default function ClusterPage() {
    const [pg, setPg] = useState<any>(null);
    const [mongo, setMongo] = useState<any>(null);
    const [testPg, setTestPg] = useState<any>(null);
    const [testMongo, setTestMongo] = useState<any>(null);
    const [ultima, setUltima] = useState<Date | null>(null);
    const [loading, setLoading] = useState(false);
    const [testing, setTesting] = useState(false);

    async function cargar() {
        setLoading(true);
        try {
            const [p, m] = await Promise.all([
                api.healthPostgres().catch((e) => ({ error: String(e) })),
                api.healthMongo().catch((e) => ({ error: String(e) })),
            ]);
            setPg(p); setMongo(m);
            setUltima(new Date());
        } finally { setLoading(false); }
    }

    useEffect(() => { cargar(); }, []);
    useEffect(() => {
        const t = setInterval(cargar, 8000);
        return () => clearInterval(t);
    }, []);

    async function correrTestPg() {
        setTesting(true);
        try { setTestPg(await api.testReplicacionPostgres()); } finally { setTesting(false); }
    }

    async function correrTestMongo() {
        setTesting(true);
        try { setTestMongo(await api.testReplicacionMongo()); } finally { setTesting(false); }
    }

    return (
        <>
            <style>{styles}</style>
            <div className="page-root">

                {/* ── HEADER ── */}
                <header className="page-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div className="header-icon"><Server size={22} /></div>
                        <div>
                            <div className="page-eyebrow">Infraestructura</div>
                            <h1 className="page-title">Estado del Clúster</h1>
                            <p className="page-lead">PostgreSQL primary + 2 standbys · MongoDB replica set 3 nodos · Refresca cada 8s</p>
                        </div>
                    </div>
                    <div className="header-actions">
                        {ultima && (
                            <div className="time-badge">
                                <Clock size={12} />
                                {ultima.toLocaleTimeString()}
                            </div>
                        )}
                        <button className="btn-secondary" onClick={cargar} disabled={loading}>
                            <RefreshCw size={13} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
                            Refrescar
                        </button>
                    </div>
                </header>

                {/* ══════════════════════════════════
                    POSTGRESQL
                ══════════════════════════════════ */}
                <section className="section-wrap">
                    <div className="section-header">
                        <div className="section-title">
                            <Database size={18} style={{ color: 'var(--blue)' }} />
                            PostgreSQL Cluster
                        </div>
                        {pg?.resumen && (
                            <>
                                <span className="badge badge-muted">{pg.resumen.arriba}/{pg.resumen.total} nodos arriba</span>
                                {pg.resumen.sincronizados
                                    ? <span className="badge badge-green"><CheckCircle size={10} /> Sincronizado</span>
                                    : <span className="badge badge-amber"><AlertTriangle size={10} /> Desincronizado</span>
                                }
                            </>
                        )}
                    </div>

                    {/* Nodos PG */}
                    <div className="nodes-grid">
                        {(pg?.nodos || []).map((n: any, i: number) => (
                            <NodoPgCard key={i} nodo={n} esPrimaryConteo={pg?.nodos?.[0]?.total_filas} />
                        ))}
                        {!pg?.nodos && (
                            <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-3)', fontFamily: 'DM Serif Display', fontStyle: 'italic', padding: 40 }}>
                                {pg?.error || 'Cargando estado del clúster…'}
                            </div>
                        )}
                    </div>

                    {/* Tabla conteos PG */}
                    {pg?.nodos?.some((n: any) => n.conteos) && (
                        <div className="card">
                            <div className="card-title">
                                <Layers size={15} style={{ color: 'var(--blue)' }} />
                                Filas por tabla en cada nodo
                                {!pg.resumen.sincronizados && (
                                    <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>
                                        <AlertTriangle size={10} /> Réplicas no coinciden con primary
                                    </span>
                                )}
                            </div>
                            <TablaConteosPg nodos={pg.nodos} />
                        </div>
                    )}

                    {/* Test replicación PG */}
                    <div className="card" style={{ marginBottom: 0 }}>
                        <div className="card-row">
                            <div className="card-title" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
                                <GitBranch size={15} style={{ color: 'var(--blue)' }} />
                                Test de replicación Postgres
                            </div>
                            <button className="btn-primary" onClick={correrTestPg} disabled={testing}>
                                <Send size={13} />
                                Ejecutar test
                            </button>
                        </div>
                        <p className="card-desc" style={{ marginTop: 12 }}>
                            Inserta una fila en el primary y verifica que aparezca en los 2 standbys.
                        </p>
                        {testPg && <ResultadoTestRep test={testPg} />}
                    </div>
                </section>

                {/* ══════════════════════════════════
                    MONGODB
                ══════════════════════════════════ */}
                <section className="section-wrap">
                    <div className="section-header">
                        <div className="section-title">
                            <Database size={18} style={{ color: 'var(--green)' }} />
                            MongoDB Replica Set
                        </div>
                        {mongo?.miembros && (
                            <>
                                <span className="badge badge-muted">{mongo.miembros.length} miembros</span>
                                {mongo.sincronizados
                                    ? <span className="badge badge-green"><CheckCircle size={10} /> Sincronizado</span>
                                    : <span className="badge badge-amber"><AlertTriangle size={10} /> Desincronizado o nodo caído</span>
                                }
                            </>
                        )}
                    </div>

                    {mongo?.modo === 'standalone-or-atlas-managed' ? (
                        <div className="alert-amber">
                            <AlertTriangle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
                            <div>
                                <strong>Replica set managed (Atlas) o usuario sin privilegios</strong>
                                <p>{mongo.nota}</p>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="nodes-grid">
                                {(mongo?.miembros || []).map((m: any) => (
                                    <NodoMongoCard key={m.id} miembro={m} />
                                ))}
                                {!mongo?.miembros && (
                                    <div className="card" style={{ gridColumn: '1 / -1', textAlign: 'center', color: 'var(--text-3)', fontFamily: 'DM Serif Display', fontStyle: 'italic', padding: 40 }}>
                                        {mongo?.error || 'Cargando estado del replica set…'}
                                    </div>
                                )}
                            </div>

                            {mongo?.miembros?.some((m: any) => m.conteos) && (
                                <div className="card">
                                    <div className="card-title">
                                        <Layers size={15} style={{ color: 'var(--green)' }} />
                                        Documentos por colección en cada nodo
                                        {!mongo.sincronizados && (
                                            <span className="badge badge-amber" style={{ marginLeft: 'auto' }}>
                                                <AlertTriangle size={10} /> Réplicas desincronizadas
                                            </span>
                                        )}
                                    </div>
                                    <TablaConteosMongo miembros={mongo.miembros} />
                                </div>
                            )}
                        </>
                    )}

                    {/* Test replicación Mongo */}
                    <div className="card" style={{ marginBottom: 0 }}>
                        <div className="card-row">
                            <div className="card-title" style={{ marginBottom: 0, paddingBottom: 0, borderBottom: 'none' }}>
                                <GitBranch size={15} style={{ color: 'var(--green)' }} />
                                Test de replicación MongoDB
                            </div>
                            <button className="btn-primary" onClick={correrTestMongo} disabled={testing}>
                                <Send size={13} />
                                Ejecutar test
                            </button>
                        </div>
                        <p className="card-desc" style={{ marginTop: 12 }}>
                            Inserta un documento en primary y lo lee con readPreference=secondaryPreferred.
                        </p>
                        {testMongo && <ResultadoTestRepMongo test={testMongo} />}
                    </div>
                </section>

            </div>
        </>
    );
}

/* ─── SECTION HEADER ─── */
function SectionHeader({ icon, title, badges }: { icon: any; title: string; badges?: any[] }) {
    return (
        <div className="section-header">
            <div className="section-title">{icon}{title}</div>
            {badges?.map((b, i) => (
                <span key={i} className={`badge ${b.kind === 'ok' ? 'badge-green' : b.kind === 'warn' ? 'badge-amber' : 'badge-muted'}`}>
                    {b.kind === 'ok'   && <CheckCircle size={10} />}
                    {b.kind === 'warn' && <AlertTriangle size={10} />}
                    {b.label}
                </span>
            ))}
        </div>
    );
}

/* ─── NODO PG CARD ─── */
function NodoPgCard({ nodo, esPrimaryConteo }: { nodo: any; esPrimaryConteo?: number }) {
    const up = nodo.status === 'UP';
    const isPrimary = up && !nodo.in_recovery;
    const accentColor = up ? (isPrimary ? 'var(--blue)' : 'var(--cyan)') : 'var(--red)';
    const iconBg     = up ? (isPrimary ? 'var(--blue-dim)' : 'var(--cyan-dim)') : 'var(--red-dim)';
    const sincronizado = up && esPrimaryConteo != null && nodo.total_filas === esPrimaryConteo;

    return (
        <div className="nodo-card">
            <div className="nodo-accent-bar" style={{ background: accentColor }} />
            <div className="nodo-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="nodo-icon-wrap" style={{ background: iconBg, color: accentColor }}>
                        {isPrimary ? <Crown size={16} /> : <Copy size={16} />}
                    </div>
                    <div>
                        <div className="nodo-role">{nodo.role}</div>
                        <div className="nodo-host">{nodo.host}:{nodo.port}</div>
                    </div>
                </div>
                {up
                    ? <span className="badge badge-green"><CheckCircle size={10} /> UP</span>
                    : <span className="badge badge-red"><XCircle size={10} /> DOWN</span>
                }
            </div>

            {up ? (
                <>
                    <Row label="Rol DB"    value={isPrimary ? 'Primary — escritura' : 'Standby — lectura'} />
                    <Row label="Latencia"  value={`${nodo.response_ms} ms`} />
                    <Row
                        label="Total filas"
                        value={
                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
                                {nodo.total_filas?.toLocaleString() ?? '—'}
                                {!isPrimary && esPrimaryConteo != null && (
                                    <span className={`delta-chip ${sincronizado ? 'delta-ok' : 'delta-warn'}`}>
                                        {sincronizado ? '= primary' : `Δ ${nodo.total_filas - esPrimaryConteo}`}
                                    </span>
                                )}
                            </span>
                        }
                    />
                    {nodo.replicas_conectadas?.length > 0 && (
                        <div className="replicas-box">
                            <div className="replicas-box-title">Réplicas conectadas</div>
                            {nodo.replicas_conectadas.map((r: any, i: number) => (
                                <div key={i} className="replica-item">
                                    <code>{r.application_name}</code>
                                    <span style={{ color: 'var(--text-3)' }}>·</span>
                                    <span>{r.state}</span>
                                    {r.replay_lag_bytes != null && (
                                        <span style={{ color: 'var(--text-3)', fontSize: 11 }}>lag {r.replay_lag_bytes}B</span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            ) : (
                <p className="error-text">{nodo.error}</p>
            )}
        </div>
    );
}

/* ─── NODO MONGO CARD ─── */
function NodoMongoCard({ miembro }: { miembro: any }) {
    const isPrimary    = miembro.es_primario;
    const isSecondary  = miembro.estado === 'SECONDARY';
    const accentColor  = isPrimary ? 'var(--gold)' : isSecondary ? 'var(--green)' : 'var(--red)';
    const iconBg       = isPrimary ? 'var(--gold-dim)' : isSecondary ? 'var(--green-dim)' : 'var(--red-dim)';
    const ok           = miembro.salud === 1;
    const sinDatos     = miembro.directo_status === 'UP' && (miembro.total_docs == null || miembro.total_docs === 0);

    return (
        <div className="nodo-card">
            <div className="nodo-accent-bar" style={{ background: accentColor }} />
            <div className="nodo-card-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div className="nodo-icon-wrap" style={{ background: iconBg, color: accentColor }}>
                        {isPrimary ? <Crown size={16} /> : <Copy size={16} />}
                    </div>
                    <div>
                        <div className="nodo-role">{miembro.estado}</div>
                        <div className="nodo-host">{miembro.nombre}</div>
                    </div>
                </div>
                {ok
                    ? <span className="badge badge-green"><CheckCircle size={10} /> Salud OK</span>
                    : <span className="badge badge-red"><XCircle size={10} /> {miembro.estado}</span>
                }
            </div>

            <Row label="ID"     value={`#${miembro.id}`} />
            <Row label="Uptime" value={miembro.uptime_segundos ? `${Math.floor(miembro.uptime_segundos / 60)} min` : '—'} />
            <Row label="Ping"   value={miembro.ping_ms != null ? `${miembro.ping_ms} ms` : '—'} />
            <Row
                label="Total docs"
                value={
                    miembro.directo_status === 'UP' ? (
                        <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
                            {miembro.total_docs?.toLocaleString() ?? 0}
                            {sinDatos && <span className="delta-chip delta-warn">vacío</span>}
                        </span>
                    ) : (
                        <span style={{ fontSize: 11, color: 'var(--red)' }}>sin acceso directo</span>
                    )
                }
            />
            {miembro.directo_error && <p className="error-text">{miembro.directo_error}</p>}
        </div>
    );
}

/* ─── ROW ─── */
function Row({ label, value }: { label: string; value: any }) {
    return (
        <div className="nodo-row">
            <span className="nodo-row-label">{label}</span>
            <span className="nodo-row-value">{value}</span>
        </div>
    );
}

/* ─── TABLA CONTEOS PG ─── */
function TablaConteosPg({ nodos }: { nodos: any[] }) {
    const tablas = ['votos_oficiales', 'mesas_electorales', 'recintos_electorales',
                    'distribucion_territorial', 'eventos_acta_oficial', 'logs_oficial'];
    const primary = nodos.find((n) => n.status === 'UP' && !n.in_recovery);

    return (
        <div className="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Tabla</th>
                        {nodos.map((n) => <th key={n.role}>{n.role}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {tablas.map((t) => {
                        const valPrimary = primary?.conteos?.[t];
                        return (
                            <tr key={t}>
                                <td><code>{t}</code></td>
                                {nodos.map((n) => {
                                    const v = n.conteos?.[t];
                                    if (n.status !== 'UP') return <td key={n.role} style={{ color: 'var(--red)', fontFamily: 'JetBrains Mono', fontSize: 11 }}>—</td>;
                                    if (v == null)          return <td key={n.role} style={{ color: 'var(--text-3)' }}>n/a</td>;
                                    const igual = valPrimary != null && v === valPrimary;
                                    return (
                                        <td key={n.role}>
                                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
                                                {v.toLocaleString()}
                                            </span>
                                            {!igual && n !== primary && valPrimary != null && (
                                                <span className="delta-chip delta-warn">Δ{v - valPrimary}</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

/* ─── TABLA CONTEOS MONGO ─── */
function TablaConteosMongo({ miembros }: { miembros: any[] }) {
    const colecciones = ['actas_rrv', 'logs_rrv', 'sms_numeros_autorizados', 'sms_mensajes_recibidos'];
    const primary = miembros.find((m) => m.es_primario);

    return (
        <div className="table-wrap">
            <table>
                <thead>
                    <tr>
                        <th>Colección</th>
                        {miembros.map((m) => (
                            <th key={m.id}>
                                {m.nombre}
                                {m.es_primario && <span className="badge badge-muted" style={{ marginLeft: 6, fontSize: 9 }}>PRIMARY</span>}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {colecciones.map((c) => {
                        const valPrimary = primary?.conteos?.[c];
                        return (
                            <tr key={c}>
                                <td><code>{c}</code></td>
                                {miembros.map((m) => {
                                    const v = m.conteos?.[c];
                                    if (m.directo_status !== 'UP') return <td key={m.id} style={{ color: 'var(--red)', fontSize: 11 }}>sin acceso</td>;
                                    if (v == null) return <td key={m.id} style={{ color: 'var(--text-3)' }}>n/a</td>;
                                    const igual = valPrimary != null && v === valPrimary;
                                    return (
                                        <td key={m.id}>
                                            <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 700, color: 'var(--text)' }}>
                                                {v.toLocaleString()}
                                            </span>
                                            {!igual && !m.es_primario && valPrimary != null && (
                                                <span className="delta-chip delta-warn">Δ{v - valPrimary}</span>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

/* ─── RESULTADO TEST PG ─── */
function ResultadoTestRep({ test }: { test: any }) {
    if (test.error) {
        return (
            <div className="result-pill err">
                <XCircle size={18} style={{ flexShrink: 0 }} />
                <strong>{test.error}</strong>
            </div>
        );
    }
    return (
        <div className={`result-pill ${test.todos_replicados ? 'ok' : 'warn'}`} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', width: '100%' }}>
                {test.todos_replicados ? <CheckCircle size={18} style={{ flexShrink: 0 }} /> : <AlertTriangle size={18} style={{ flexShrink: 0 }} />}
                <strong>{test.todos_replicados ? '✓ Replicación OK' : 'Replicación incompleta'}</strong>
                <span style={{ flex: 1 }} />
                <code style={{ fontSize: 11 }}>{test.tag}</code>
            </div>
            <div className="test-nodes-grid">
                {test.nodos.map((n: any, i: number) => (
                    <div key={i} className={`test-node-box ${n.replicado ? 'ok' : 'fail'}`}>
                        {n.replicado
                            ? <CheckCircle size={15} style={{ color: 'var(--green)' }} />
                            : <XCircle size={15} style={{ color: 'var(--red)' }} />
                        }
                        <div className="test-node-role">{n.role}</div>
                        <div className="test-node-port">:{n.port}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}

/* ─── RESULTADO TEST MONGO ─── */
function ResultadoTestRepMongo({ test }: { test: any }) {
    if (test.error) {
        return (
            <div className="result-pill err">
                <XCircle size={18} style={{ flexShrink: 0 }} />
                <strong>{test.error}</strong>
            </div>
        );
    }
    const ok = test.primary_ve && test.secondary_ve;
    return (
        <div className={`result-pill ${ok ? 'ok' : 'warn'}`} style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', width: '100%' }}>
                {ok ? <CheckCircle size={18} style={{ flexShrink: 0 }} /> : <AlertTriangle size={18} style={{ flexShrink: 0 }} />}
                <strong>{ok ? '✓ Replicación OK' : 'Replicación parcial'}</strong>
                <span style={{ flex: 1 }} />
                <code style={{ fontSize: 11 }}>{test.tag}</code>
            </div>
            <div className="test-nodes-grid two">
                {[
                    { label: 'PRIMARY',   ok: test.primary_ve },
                    { label: 'SECONDARY', ok: test.secondary_ve },
                ].map((n) => (
                    <div key={n.label} className={`test-node-box ${n.ok ? 'ok' : 'fail'}`}>
                        {n.ok
                            ? <CheckCircle size={15} style={{ color: 'var(--green)' }} />
                            : <XCircle size={15} style={{ color: 'var(--red)' }} />
                        }
                        <div className="test-node-role">{n.label}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}