'use client';

import { useEffect, useState } from 'react';
import {
    ScrollText, RefreshCw, AlertCircle, CheckCircle, XCircle,
    FileSpreadsheet, Zap, MessageSquare, Clock, User, Hash,
    Filter, AlertTriangle, Activity, ChevronDown,
} from 'lucide-react';
import { api } from '@/lib/api';

type Origen = 'TODOS' | 'OFICIAL' | 'RRV' | 'SMS' | 'ERRORES_OFICIAL';

const TABS: { id: Origen; label: string; color: string }[] = [
    { id: 'TODOS',           label: 'Todos',         color: '#94a3b8' },
    { id: 'OFICIAL',         label: 'Oficial',       color: '#60a5fa' },
    { id: 'RRV',             label: 'RRV',           color: '#fbbf24' },
    { id: 'SMS',             label: 'SMS',           color: '#34d399' },
    { id: 'ERRORES_OFICIAL', label: 'Errores',       color: '#f87171' },
];

export default function AuditoriaPage() {
    const [origen, setOrigen] = useState<Origen>('TODOS');
    const [eventosOficial, setEventosOficial] = useState<any[]>([]);
    const [eventosRrv, setEventosRrv] = useState<any[]>([]);
    const [mensajesSms, setMensajesSms] = useState<any[]>([]);
    const [logsErrores, setLogsErrores] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [filtroMesa, setFiltroMesa] = useState('');

    async function cargar() {
        setLoading(true);
        try {
            const mesa = filtroMesa ? parseInt(filtroMesa, 10) : undefined;
            const [eo, er, sm, le] = await Promise.all([
                api.eventosOficial({ limit: 100, mesa }).catch(() => []),
                api.eventosRrv(100).catch(() => []),
                api.listarMensajesSms(100).catch(() => []),
                api.logsErroresOficial(50).catch(() => []),
            ]);
            setEventosOficial(eo);
            setEventosRrv(er);
            setMensajesSms(sm);
            setLogsErrores(le);
        } finally { setLoading(false); }
    }

    useEffect(() => { cargar(); /* eslint-disable-next-line */ }, [filtroMesa]);
    useEffect(() => {
        const t = setInterval(cargar, 4000);
        return () => clearInterval(t);
        // eslint-disable-next-line
    }, [filtroMesa]);

    const timeline = [
        ...eventosOficial.map((e) => ({
            fuente: 'OFICIAL', ts: e.timestamp, titulo: e.tipo_evento,
            actor: e.actor, mesa: e.codigo_mesa, extra: e.estado_resultante, raw: e,
            ok: !e.tipo_evento?.includes('RECHAZ') && !e.tipo_evento?.includes('CUARENTENA') && !e.tipo_evento?.includes('ANULADA'),
        })),
        ...eventosRrv.map((e) => ({
            fuente: 'RRV', ts: e.timestamp, titulo: e.tipo_error || 'EVENTO_RRV',
            actor: 'rrv-pipeline', mesa: e.datos_entrada?.codigo_mesa,
            extra: e.detalle, raw: e,
            ok: !e.tipo_error?.includes('NO_AUTORIZADO') && !e.tipo_error?.includes('FALLIDA') && !e.tipo_error?.includes('FALTANTE'),
        })),
        ...mensajesSms.map((m) => ({
            fuente: 'SMS', ts: m.timestamp, titulo: m.resultado || 'MENSAJE_SMS',
            actor: m.numero_origen, mesa: m.codigo_mesa, extra: m.texto, raw: m,
            ok: m.resultado?.startsWith('ENCOLADO'),
        })),
        ...logsErrores.map((l) => ({
            fuente: 'ERRORES_OFICIAL', ts: l.timestamp, titulo: l.tipo_error,
            actor: l.operador_id ? `op:${l.operador_id}` : 'sistema',
            mesa: l.codigo_mesa, extra: l.detalle, raw: l, ok: false,
        })),
    ]
        .filter((e) => origen === 'TODOS' || e.fuente === origen)
        .sort((a, b) => new Date(b.ts).getTime() - new Date(a.ts).getTime());

    const stats = {
        total: timeline.length,
        ok: timeline.filter((e) => e.ok).length,
        errores: timeline.filter((e) => !e.ok).length,
        smsRechazados: mensajesSms.filter((m) => !m.resultado?.startsWith('ENCOLADO')).length,
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;1,300&family=JetBrains+Mono:wght@400;500&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .aud-root {
                    min-height: 100vh;
                    background: #080c14;
                    color: #e2e8f0;
                    font-family: 'DM Sans', sans-serif;
                    padding: 0 32px 80px;
                    position: relative;
                    overflow-x: hidden;
                }
                .aud-root::before {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background:
                        radial-gradient(ellipse 70% 50% at 50% -5%, rgba(168,85,247,0.09) 0%, transparent 55%),
                        radial-gradient(ellipse 40% 40% at 95% 20%, rgba(99,102,241,0.07) 0%, transparent 50%);
                    pointer-events: none;
                    z-index: 0;
                }
                .aud-root::after {
                    content: '';
                    position: fixed;
                    inset: 0;
                    background-image: radial-gradient(rgba(255,255,255,0.035) 1px, transparent 1px);
                    background-size: 32px 32px;
                    pointer-events: none;
                    z-index: 0;
                }
                .aud-inner {
                    position: relative;
                    z-index: 1;
                    max-width: 1180px;
                    margin: 0 auto;
                }

                /* ── Page header ── */
                .aud-header {
                    padding: 44px 0 36px;
                    animation: fadeDown .55s ease both;
                }
                .aud-title-row {
                    display: flex;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 24px;
                    margin-bottom: 32px;
                    flex-wrap: wrap;
                }
                .aud-title-left {
                    display: flex;
                    align-items: center;
                    gap: 18px;
                }
                .aud-icon {
                    width: 52px; height: 52px;
                    background: linear-gradient(135deg, rgba(168,85,247,0.2), rgba(124,58,237,0.2));
                    border: 1px solid rgba(168,85,247,0.3);
                    border-radius: 16px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #c084fc;
                    flex-shrink: 0;
                    box-shadow: 0 0 30px rgba(168,85,247,0.15);
                }
                .aud-title-text h1 {
                    font-family: 'Syne', sans-serif;
                    font-size: 26px;
                    font-weight: 800;
                    color: #f8fafc;
                 letter-spacing: normal;
                    line-height: 1.15;
                    margin-bottom: 4px;
                }
                .aud-title-text .lead {
                    font-size: 14px;
                    color: #475569;
                    font-weight: 400;
                }
                .live-badge {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: rgba(16,185,129,0.1);
                    border: 1px solid rgba(16,185,129,0.25);
                    border-radius: 100px;
                    padding: 8px 16px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #34d399;
                   
                    flex-shrink: 0;
                    align-self: flex-start;
                }
                .live-dot {
                    width: 7px; height: 7px;
                    border-radius: 50%;
                    background: #10b981;
                    box-shadow: 0 0 8px #10b981;
                    animation: pulse-dot 2s infinite;
                }
                @keyframes pulse-dot {
                    0%,100% { opacity:1; transform:scale(1); }
                    50% { opacity:.6; transform:scale(1.4); }
                }

                /* ── Tabs ── */
                .aud-tabs {
                    display: flex;
                    gap: 4px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 14px;
                    padding: 5px;
                    width: fit-content;
                }
                .aud-tab {
                    padding: 8px 18px;
                    border-radius: 10px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    border: none;
                    background: transparent;
                    color: #475569;
                    transition: all .2s ease;
                    font-family: 'DM Sans', sans-serif;
               
                }
                .aud-tab:hover { color: #94a3b8; background: rgba(255,255,255,0.04); }
                .aud-tab.active {
                    background: rgba(255,255,255,0.08);
                    color: var(--tab-color);
                    box-shadow: 0 1px 4px rgba(0,0,0,0.3);
                }

                /* ── KPI grid ── */
                .kpi-grid {
                    display: grid;
                    grid-template-columns: repeat(4, 1fr);
                    gap: 16px;
                    margin-bottom: 32px;
                    animation: fadeUp .6s ease both .1s;
                }
                @media(max-width:900px) { .kpi-grid { grid-template-columns: repeat(2,1fr); } }
                @media(max-width:520px) { .kpi-grid { grid-template-columns: 1fr; } }

                .kpi-card {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 18px;
                    padding: 22px 24px;
                    position: relative;
                    overflow: hidden;
                    transition: transform .2s, border-color .2s;
                }
                .kpi-card:hover { transform: translateY(-3px); border-color: rgba(255,255,255,0.12); }
                .kpi-card::before {
                    content: '';
                    position: absolute;
                    top: 0; left: 0; right: 0;
                    height: 2px;
                    background: var(--kpi-accent, linear-gradient(90deg,#6366f1,#8b5cf6));
                    border-radius: 18px 18px 0 0;
                }
                .kpi-label {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #475569;
                 
                    text-transform: uppercase;
                    margin-bottom: 14px;
                }
                .kpi-value {
                    font-family: 'Syne', sans-serif;
                    font-size: 38px;
                    font-weight: 800;
                    color: #f8fafc;
                
                    line-height: 1;
                }
                .kpi-icon-bg {
                    position: absolute;
                    right: 18px;
                    top: 50%;
                    transform: translateY(-50%);
                    opacity: .06;
                    color: #fff;
                }

                /* ── Main card ── */
                .aud-card {
                    background: rgba(255,255,255,0.025);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 24px;
                    overflow: hidden;
                    animation: fadeUp .6s ease both .2s;
                }

                /* ── Toolbar ── */
                .aud-toolbar {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 18px 24px;
                    border-bottom: 1px solid rgba(255,255,255,0.06);
                    background: rgba(0,0,0,0.2);
                    flex-wrap: wrap;
                }
                .toolbar-title {
                    font-family: 'Syne', sans-serif;
                    font-size: 15px;
                    font-weight: 700;
                    color: #e2e8f0;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    
                }
                .toolbar-spacer { flex: 1; }
                .toolbar-input-wrap {
                    position: relative;
                    display: flex;
                    align-items: center;
                }
                .toolbar-input-icon {
                    position: absolute;
                    left: 12px;
                    color: #475569;
                    pointer-events: none;
                }
                .toolbar-input {
                    background: rgba(255,255,255,0.05);
                    border: 1px solid rgba(255,255,255,0.09);
                    border-radius: 10px;
                    padding: 9px 14px 9px 34px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    color: #e2e8f0;
                    outline: none;
                    min-width: 190px;
                    transition: border-color .2s, background .2s;
                }
                .toolbar-input::placeholder { color: #334155; }
                .toolbar-input:focus {
                    border-color: rgba(168,85,247,0.4);
                    background: rgba(168,85,247,0.06);
                }
                /* Chrome number input arrows */
                .toolbar-input::-webkit-inner-spin-button,
                .toolbar-input::-webkit-outer-spin-button { -webkit-appearance: none; }

                .toolbar-btn {
                    display: flex;
                    align-items: center;
                    gap: 7px;
                    background: rgba(255,255,255,0.06);
                    border: 1px solid rgba(255,255,255,0.1);
                    border-radius: 10px;
                    padding: 9px 16px;
                    font-family: 'DM Sans', sans-serif;
                    font-size: 13px;
                    font-weight: 600;
                    color: #94a3b8;
                    cursor: pointer;
                    transition: all .2s;
                }
                .toolbar-btn:hover:not(:disabled) {
                    background: rgba(255,255,255,0.1);
                    color: #e2e8f0;
                    border-color: rgba(255,255,255,0.18);
                }
                .toolbar-btn:disabled { opacity: .5; cursor: not-allowed; }
                .toolbar-btn svg { transition: transform .4s ease; }
                .toolbar-btn:hover:not(:disabled) svg { transform: rotate(180deg); }

                .event-count-badge {
                    background: rgba(168,85,247,0.15);
                    border: 1px solid rgba(168,85,247,0.25);
                    border-radius: 8px;
                    padding: 4px 12px;
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 12px;
                    font-weight: 500;
                    color: #c084fc;
                }

                /* ── Timeline ── */
                .aud-timeline {
                    padding: 28px 28px 8px;
                    max-height: 72vh;
                    overflow-y: auto;
                    scrollbar-width: thin;
                    scrollbar-color: rgba(255,255,255,0.1) transparent;
                }
                .aud-timeline::-webkit-scrollbar { width: 5px; }
                .aud-timeline::-webkit-scrollbar-track { background: transparent; }
                .aud-timeline::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }

                .tl-wrap {
                    position: relative;
                    padding-left: 28px;
                }
                .tl-wrap::before {
                    content: '';
                    position: absolute;
                    left: 11px;
                    top: 6px;
                    bottom: 0;
                    width: 1px;
                    background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent 95%);
                }

                /* ── Timeline item ── */
                .tl-item {
                    position: relative;
                    margin-bottom: 16px;
                    animation: slideIn .3s ease both;
                }
                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(-8px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                .tl-dot {
                    position: absolute;
                    left: -28px;
                    top: 12px;
                    width: 22px; height: 22px;
                    border-radius: 50%;
                    background: var(--tl-bg);
                    color: var(--tl-color);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 2px solid #080c14;
                    z-index: 1;
                    box-shadow: 0 0 12px var(--tl-glow, transparent);
                }

                .tl-body {
                    background: rgba(255,255,255,0.028);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 14px;
                    padding: 14px 18px;
                    border-left: 2.5px solid var(--tl-status-color, #334155);
                    transition: background .2s, border-color .2s;
                    cursor: default;
                }
                .tl-body:hover {
                    background: rgba(255,255,255,0.05);
                    border-color: rgba(255,255,255,0.1);
                }

                .tl-row1 {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex-wrap: wrap;
                    margin-bottom: 6px;
                }
                .tl-source-badge {
                    font-size: 10px;
                    font-weight: 800;
                   
                
                    text-transform: uppercase;
                    padding: 3px 9px;
                    border-radius: 6px;
                    background: var(--tl-bg);
                    color: var(--tl-color);
                    flex-shrink: 0;
                }
                .tl-event-name {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 13px;
                    font-weight: 500;
                    color: #e2e8f0;
               
                    flex: 1;
                    min-width: 0;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }
                .tl-mesa {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 11px;
                    color: #475569;
                    background: rgba(255,255,255,0.04);
                    padding: 2px 8px;
                    border-radius: 6px;
                    border: 1px solid rgba(255,255,255,0.06);
                }
                .tl-ts {
                    font-family: 'JetBrains Mono', monospace;
                    font-size: 11px;
                    color: #334155;
                    white-space: nowrap;
                    margin-left: auto;
                }

                .tl-extra {
                    font-size: 13px;
                    color: #475569;
                    margin: 6px 0 4px;
                    word-break: break-word;
                    line-height: 1.55;
                    font-weight: 300;
                }
                .tl-actor {
                    display: flex;
                    align-items: center;
                    gap: 5px;
                    font-size: 11px;
                    color: #334155;
                    font-family: 'JetBrains Mono', monospace;
                }

                /* ── Empty ── */
                .aud-empty {
                    text-align: center;
                    padding: 64px 24px;
                    color: #334155;
                }
                .aud-empty svg {
                    margin: 0 auto 16px;
                    opacity: .3;
                    display: block;
                }
                .aud-empty p {
                    font-size: 15px;
                    font-weight: 500;
                }

                /* ── Keyframes ── */
                @keyframes fadeUp {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                @keyframes fadeDown {
                    from { opacity: 0; transform: translateY(-12px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>

            <div className="aud-root">
                <div className="aud-inner">

                    {/* Header */}
                    <header className="aud-header">
                        <div className="aud-title-row">
                            <div className="aud-title-left">
                                <div className="aud-icon">
                                    <ScrollText size={24} />
                                </div>
                                <div className="aud-title-text">
                                    <h1>Auditoría del sistema</h1>
                                    <p className="lead">
                                        Event log inmutable — Oficial, RRV, SMS y errores · Actualiza cada 4s
                                    </p>
                                </div>
                            </div>
                            <div className="live-badge">
                                <span className="live-dot" />
                                En vivo
                            </div>
                        </div>

                        {/* Tabs */}
                        <div className="aud-tabs">
                            {TABS.map((t) => (
                                <button
                                    key={t.id}
                                    className={`aud-tab ${origen === t.id ? 'active' : ''}`}
                                    style={{ '--tab-color': t.color } as React.CSSProperties}
                                    onClick={() => setOrigen(t.id)}
                                >
                                    {t.label}
                                </button>
                            ))}
                        </div>
                    </header>

                    {/* KPI cards */}
                    <div className="kpi-grid">
                        <KpiCard
                            label="Eventos totales"
                            value={stats.total}
                            icon={<Activity size={40} />}
                            accent="linear-gradient(90deg,#6366f1,#8b5cf6)"
                        />
                        <KpiCard
                            label="Exitosos"
                            value={stats.ok}
                            icon={<CheckCircle size={40} />}
                            accent="linear-gradient(90deg,#10b981,#059669)"
                        />
                        <KpiCard
                            label="Errores / advertencias"
                            value={stats.errores}
                            icon={<AlertTriangle size={40} />}
                            accent="linear-gradient(90deg,#f59e0b,#ef4444)"
                        />
                        <KpiCard
                            label="SMS rechazados"
                            value={stats.smsRechazados}
                            icon={<XCircle size={40} />}
                            accent="linear-gradient(90deg,#a855f7,#7c3aed)"
                        />
                    </div>

                    {/* Timeline card */}
                    <div className="aud-card">
                        {/* Toolbar */}
                        <div className="aud-toolbar">
                            <span className="toolbar-title">
                                <Filter size={15} />
                                Línea de tiempo
                            </span>
                            <span className="event-count-badge">{timeline.length} eventos</span>
                            <span className="toolbar-spacer" />
                            <div className="toolbar-input-wrap">
                                <Hash size={13} className="toolbar-input-icon" />
                                <input
                                    type="number"
                                    placeholder="Filtrar por mesa..."
                                    value={filtroMesa}
                                    onChange={(e) => setFiltroMesa(e.target.value)}
                                    className="toolbar-input"
                                />
                            </div>
                            <button className="toolbar-btn" onClick={cargar} disabled={loading}>
                                <RefreshCw size={13} />
                                Refrescar
                            </button>
                        </div>

                        {/* Timeline */}
                        <div className="aud-timeline">
                            {timeline.length === 0 ? (
                                <div className="aud-empty">
                                    <ScrollText size={36} />
                                    <p>No hay eventos registrados.</p>
                                </div>
                            ) : (
                                <div className="tl-wrap">
                                    {timeline.map((ev, i) => (
                                        <TimelineItem key={i} ev={ev} />
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
}

/* ── Sub-components ── */

const FUENTE_CFG: Record<string, { color: string; bg: string; glow: string; Icon: any }> = {
    OFICIAL:         { color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  glow: 'rgba(96,165,250,0.4)',   Icon: FileSpreadsheet },
    RRV:             { color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  glow: 'rgba(251,191,36,0.4)',   Icon: Zap },
    SMS:             { color: '#34d399', bg: 'rgba(52,211,153,0.12)',  glow: 'rgba(52,211,153,0.4)',   Icon: MessageSquare },
    ERRORES_OFICIAL: { color: '#f87171', bg: 'rgba(248,113,113,0.12)', glow: 'rgba(248,113,113,0.4)', Icon: AlertCircle },
};

function TimelineItem({ ev }: { ev: any }) {
    const cfg = FUENTE_CFG[ev.fuente] || FUENTE_CFG.OFICIAL;
    const Icon = cfg.Icon;
    const statusColor = ev.ok ? '#10b981' : '#f59e0b';

    return (
        <div
            className="tl-item"
            style={{
                '--tl-bg': cfg.bg,
                '--tl-color': cfg.color,
                '--tl-glow': cfg.glow,
                '--tl-status-color': statusColor,
            } as React.CSSProperties}
        >
            <div className="tl-dot">
                <Icon size={11} />
            </div>

            <div className="tl-body">
                <div className="tl-row1">
                    <span className="tl-source-badge">{ev.fuente.replace('_OFICIAL', '')}</span>
                    <span className="tl-event-name">{ev.titulo}</span>
                    {ev.mesa && (
                        <span className="tl-mesa">
                            <Hash size={10} />
                            Mesa {ev.mesa}
                        </span>
                    )}
                    <span className="tl-ts">
                        <Clock size={10} style={{ verticalAlign: 'middle', marginRight: 3 }} />
                        {new Date(ev.ts).toLocaleString('es-CL', {
                            day: '2-digit', month: '2-digit',
                            hour: '2-digit', minute: '2-digit', second: '2-digit',
                        })}
                    </span>
                </div>

                {ev.extra && (
                    <div className="tl-extra">
                        {String(ev.extra).slice(0, 200)}{String(ev.extra).length > 200 ? '…' : ''}
                    </div>
                )}

                <div className="tl-actor">
                    <User size={10} />
                    {ev.actor || 'sistema'}
                </div>
            </div>
        </div>
    );
}

function KpiCard({ label, value, icon, accent }: {
    label: string; value: number; icon: React.ReactNode; accent: string;
}) {
    return (
        <div className="kpi-card" style={{ '--kpi-accent': accent } as React.CSSProperties}>
            <div className="kpi-icon-bg">{icon}</div>
            <div className="kpi-label">{label}</div>
            <div className="kpi-value">{value.toLocaleString('es-CL')}</div>
        </div>
    );
}