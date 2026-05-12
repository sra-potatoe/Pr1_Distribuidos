'use client';

import { useEffect, useRef, useState } from 'react';
import {
    FileSpreadsheet, Send, Trash2, Plus, RefreshCw, ClipboardList,
    Layers, Search, CheckCircle, AlertTriangle, XCircle, X,
} from 'lucide-react';
import { api } from '@/lib/api';

type Tab = 'form' | 'actas' | 'mesas';

const CAMPOS_VOTOS = [
    { key: 'p1', label: 'Daenerys Targaryen', short: 'P1' },
    { key: 'p2', label: 'Sansa Stark', short: 'P2' },
    { key: 'p3', label: 'Robert Baratheon', short: 'P3' },
    { key: 'p4', label: 'Tyrion Lannister', short: 'P4' },
] as const;

const ESTADO_FILTROS = ['', 'APROBADA', 'PENDIENTE', 'EN_CUARENTENA', 'ANULADA', 'RECHAZADA'];

/* ─── ESTILOS GLOBALES ─── */
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
    --gold-dim:  rgba(201,168,76,0.13);
    --blue:      #4e9af1;
    --blue-dim:  rgba(78,154,241,0.13);
    --green:     #34d399;
    --green-dim: rgba(52,211,153,0.12);
    --red:       #e05c5c;
    --red-dim:   rgba(224,92,92,0.12);
    --amber:     #f59e0b;
    --amber-dim: rgba(245,158,11,0.12);
    --purple:    #a78bfa;
    --text:      #e8eaf0;
    --text-2:    #9ba3b4;
    --text-3:    #5c6479;
    --r:         10px;
    --r-lg:      16px;
    --shadow:    0 8px 32px rgba(0,0,0,0.5);
    --tr:        0.2s cubic-bezier(0.4,0,0.2,1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--ink);
    color: var(--text);
  }

  /* ── PAGE WRAPPER ── */
  .page-root {
    padding: 32px;
    min-height: 100vh;
    background:
      radial-gradient(ellipse 70% 50% at 50% -5%, rgba(201,168,76,0.05) 0%, transparent 70%),
      radial-gradient(ellipse 50% 35% at 100% 100%, rgba(78,154,241,0.04) 0%, transparent 60%),
      var(--ink);
  }

  .page-root::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), var(--blue), var(--gold), transparent);
    z-index: 100;
  }

  /* ── PAGE HEADER ── */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;
    padding-bottom: 24px;
    border-bottom: 1px solid var(--rim);
    flex-wrap: wrap;
    gap: 16px;
  }

  .header-icon {
    width: 48px; height: 48px;
    border-radius: 14px;
    background: linear-gradient(135deg, var(--gold-dim), var(--blue-dim));
    border: 1px solid rgba(201,168,76,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--gold-soft);
    flex-shrink: 0;
  }

  .page-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 4px;
  }

  .page-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.9rem;
    font-weight: 400;
    color: var(--text);
    letter-spacing: -0.02em;
    line-height: 1.1;
  }

  .page-lead {
    font-size: 13px;
    color: var(--text-3);
    margin-top: 3px;
    font-weight: 300;
  }

  /* ── TABS ── */
  .tabs-strip {
    display: flex;
    gap: 4px;
    background: var(--ink-3);
    padding: 4px;
    border-radius: 12px;
    border: 1px solid var(--rim);
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 9px 18px;
    border-radius: 9px;
    font-size: 13px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--tr);
    border: none;
    background: transparent;
    color: var(--text-2);
    font-family: 'DM Sans', sans-serif;
  }

  .tab-btn:hover { color: var(--text); background: var(--glass-b); }

  .tab-btn.active {
    background: linear-gradient(135deg, rgba(201,168,76,0.18), rgba(78,154,241,0.12));
    color: var(--gold-soft);
    border: 1px solid rgba(201,168,76,0.22);
    box-shadow: 0 2px 12px rgba(201,168,76,0.1);
  }

  /* ── CARDS ── */
  .card {
    background: var(--glass);
    border: 1px solid var(--rim);
    border-radius: var(--r-lg);
    padding: 24px;
    margin-bottom: 20px;
    backdrop-filter: blur(8px);
  }

  .card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.05rem;
    font-weight: 400;
    color: var(--text);
    margin-bottom: 20px;
    padding-bottom: 14px;
    border-bottom: 1px solid var(--rim);
    letter-spacing: -0.01em;
  }

  /* ── LAYOUT ── */
  .two-col { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; }
  .mb-0 { margin-bottom: 0 !important; }

  /* ── FORM ELEMENTS ── */
  .form-section-title {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-3);
    margin: 20px 0 12px;
    display: flex;
    align-items: center;
    gap: 10px;
  }

  .form-section-title::before, .form-section-title::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--rim);
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .field { display: flex; flex-direction: column; gap: 6px; }
  .field.full { grid-column: 1 / -1; }

  label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-3);
  }

  input[type="text"],
  input[type="number"],
  select,
  textarea {
    background: var(--ink-3);
    border: 1px solid var(--rim);
    border-radius: 8px;
    padding: 10px 14px;
    color: var(--text);
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    outline: none;
    transition: var(--tr);
    width: 100%;
  }

  input:focus, select:focus, textarea:focus {
    border-color: rgba(201,168,76,0.45);
    background: var(--ink-4);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.07);
  }

  input::placeholder { color: var(--text-3); }

  input:disabled, select:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }

  select {
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%235c6479'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    padding-right: 30px;
    cursor: pointer;
  }

  .hint {
    font-size: 11.5px;
    color: var(--text-3);
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* ── MESA INFO BOX ── */
  .mesa-info-box {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(130px, 1fr));
    gap: 10px;
    margin-top: 10px;
    padding: 14px;
    background: var(--gold-dim);
    border: 1px solid rgba(201,168,76,0.2);
    border-radius: 10px;
  }

  .info-item-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(201,168,76,0.6);
    margin-bottom: 3px;
  }

  .info-item-value {
    font-size: 15px;
    font-weight: 700;
    color: var(--gold-soft);
  }

  .info-item-sub {
    font-size: 11px;
    color: rgba(201,168,76,0.5);
    margin-top: 2px;
  }

  /* ── BUTTONS ── */
  .btn-primary {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 20px;
    background: linear-gradient(135deg, rgba(201,168,76,0.25), rgba(78,154,241,0.18));
    border: 1px solid rgba(201,168,76,0.35);
    border-radius: 9px;
    color: var(--gold-soft);
    font-size: 13.5px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--tr);
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }

  .btn-primary:hover:not(:disabled) {
    background: linear-gradient(135deg, rgba(201,168,76,0.35), rgba(78,154,241,0.25));
    box-shadow: 0 4px 16px rgba(201,168,76,0.15);
    transform: translateY(-1px);
  }

  .btn-primary:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

  .btn-secondary {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    padding: 10px 18px;
    background: var(--ink-3);
    border: 1px solid var(--rim);
    border-radius: 9px;
    color: var(--text-2);
    font-size: 13.5px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--tr);
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }

  .btn-secondary:hover:not(:disabled) { border-color: var(--rim-2); color: var(--text); }
  .btn-secondary:disabled { opacity: 0.4; cursor: not-allowed; }

  .btn-danger {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 7px 13px;
    background: var(--red-dim);
    border: 1px solid rgba(224,92,92,0.25);
    border-radius: 8px;
    color: var(--red);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--tr);
    font-family: 'DM Sans', sans-serif;
  }

  .btn-danger:hover:not(:disabled) {
    background: rgba(224,92,92,0.2);
    border-color: rgba(224,92,92,0.4);
  }

  .btn-danger:disabled { opacity: 0.35; cursor: not-allowed; }

  .btn-ghost {
    background: transparent;
    border: none;
    padding: 6px;
    border-radius: 6px;
    cursor: pointer;
    color: var(--text-2);
    transition: var(--tr);
    display: flex;
    align-items: center;
  }

  .btn-ghost:hover { background: var(--glass-b); color: var(--text); }

  .btn-sm {
    padding: 6px 12px !important;
    font-size: 11.5px !important;
    border-radius: 7px !important;
  }

  /* ── TOOLBAR ── */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 20px;
    flex-wrap: wrap;
  }

  .toolbar-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.1rem;
    font-weight: 400;
    color: var(--text);
  }

  .spacer { flex: 1; }

  .search-wrap {
    position: relative;
    display: flex;
    align-items: center;
  }

  .search-wrap svg {
    position: absolute;
    left: 11px;
    color: var(--text-3);
    pointer-events: none;
  }

  .search-wrap input {
    padding-left: 34px;
    min-width: 220px;
  }

  /* ── TABLES ── */
  .table-wrap { overflow-x: auto; }

  table { width: 100%; border-collapse: separate; border-spacing: 0; }

  thead th {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-3);
    padding: 8px 14px;
    text-align: left;
    border-bottom: 1px solid var(--rim);
    white-space: nowrap;
  }

  tbody tr { transition: var(--tr); }
  tbody tr:hover { background: rgba(255,255,255,0.02); }

  tbody td {
    padding: 11px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: var(--text-2);
    font-size: 13px;
    vertical-align: middle;
  }

  tbody tr:last-child td { border-bottom: none; }

  code {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    background: var(--ink-3);
    border: 1px solid var(--rim);
    padding: 2px 7px;
    border-radius: 5px;
    color: var(--text-2);
  }

  .empty-row td {
    text-align: center;
    padding: 40px;
    color: var(--text-3);
    font-family: 'DM Serif Display', serif;
    font-style: italic;
  }

  /* ── BADGES / ESTADO ── */
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 10px;
    border-radius: 20px;
    font-family: 'JetBrains Mono', monospace;
    font-size: 10.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    white-space: nowrap;
  }

  .badge-green   { background: var(--green-dim); color: var(--green); border: 1px solid rgba(52,211,153,0.2); }
  .badge-blue    { background: var(--blue-dim);  color: var(--blue);  border: 1px solid rgba(78,154,241,0.2); }
  .badge-amber   { background: var(--amber-dim); color: var(--amber); border: 1px solid rgba(245,158,11,0.2); }
  .badge-red     { background: var(--red-dim);   color: var(--red);   border: 1px solid rgba(224,92,92,0.2); }
  .badge-muted   { background: rgba(255,255,255,0.06); color: var(--text-3); border: 1px solid var(--rim); }
  .badge-purple  { background: rgba(167,139,250,0.12); color: var(--purple); border: 1px solid rgba(167,139,250,0.2); }

  /* ── VERIFICACIÓN PANEL ── */
  .verify-section-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    font-weight: 600;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 10px;
  }

  .resumen-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 8px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
  }

  .resumen-item span { font-size: 13px; color: var(--text-2); }
  .resumen-item strong { font-family: 'JetBrains Mono', monospace; font-size: 15px; color: var(--text); }

  /* ── RESULTADO ENVIO ── */
  .result-pill {
    display: flex;
    align-items: flex-start;
    gap: 14px;
    padding: 16px 18px;
    border-radius: var(--r);
    margin-top: 20px;
    border: 1px solid;
  }

  .result-pill.ok   { background: var(--green-dim); border-color: rgba(52,211,153,0.25); color: var(--green); }
  .result-pill.warn { background: var(--amber-dim); border-color: rgba(245,158,11,0.25); color: var(--amber); }
  .result-pill.err  { background: var(--red-dim);   border-color: rgba(224,92,92,0.25);  color: var(--red); }

  .result-pill strong { color: inherit; font-size: 14px; }
  .result-pill div { font-size: 12px; margin-top: 3px; opacity: 0.8; }

  .result-pill pre {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    margin-top: 8px;
    background: rgba(0,0,0,0.3);
    padding: 10px;
    border-radius: 7px;
    overflow-x: auto;
    color: var(--text-2);
    opacity: 1;
    max-height: 200px;
  }

  details summary { cursor: pointer; font-size: 11.5px; opacity: 0.7; }
  details summary:hover { opacity: 1; }

  /* ── TIP CARD ── */
  .tip-card {
    background: linear-gradient(135deg, rgba(201,168,76,0.06), rgba(78,154,241,0.04));
    border: 1px solid rgba(201,168,76,0.15);
    border-radius: var(--r);
    padding: 16px 18px;
  }

  .tip-card-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 8px;
  }

  .tip-card p { font-size: 13px; color: var(--text-2); line-height: 1.65; }
  .tip-card strong { color: var(--amber); }
  .tip-card em { color: var(--blue); font-style: italic; }

  /* ── MODAL ── */
  .modal-backdrop {
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.7);
    backdrop-filter: blur(6px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
  }

  .modal {
    background: var(--ink-2);
    border: 1px solid var(--rim-2);
    border-radius: var(--r-lg);
    padding: 28px;
    width: 100%;
    max-width: 480px;
    box-shadow: var(--shadow);
    position: relative;
  }

  .modal::before {
    content: '';
    position: absolute;
    top: 0; left: 30px; right: 30px;
    height: 1px;
    background: linear-gradient(90deg, transparent, var(--gold), transparent);
  }

  .modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 22px;
  }

  .modal-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.2rem;
    font-weight: 400;
    color: var(--text);
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 22px;
    padding-top: 18px;
    border-top: 1px solid var(--rim);
  }

  /* ── SCROLLBAR ── */
  ::-webkit-scrollbar { width: 5px; height: 5px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 3px; }
`;

export default function OficialPage() {
    const [tab, setTab] = useState<Tab>('form');

    return (
        <>
            <style>{styles}</style>
            <div className="page-root">
                <header className="page-header">
                    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <div className="header-icon">
                            <FileSpreadsheet size={22} />
                        </div>
                        <div>
                            <div className="page-eyebrow">Sistema Electoral</div>
                            <h1 className="page-title">Cómputo Oficial</h1>
                            <p className="page-lead">Transcripción de actas físicas y administración de mesas electorales</p>
                        </div>
                    </div>
                    <div className="tabs-strip">
                        <button className={`tab-btn ${tab === 'form' ? 'active' : ''}`} onClick={() => setTab('form')}>
                            <FileSpreadsheet size={14} /> Transcribir
                        </button>
                        <button className={`tab-btn ${tab === 'actas' ? 'active' : ''}`} onClick={() => setTab('actas')}>
                            <ClipboardList size={14} /> Actas
                        </button>
                        <button className={`tab-btn ${tab === 'mesas' ? 'active' : ''}`} onClick={() => setTab('mesas')}>
                            <Layers size={14} /> Mesas
                        </button>
                    </div>
                </header>

                {tab === 'form'  && <FormularioActa />}
                {tab === 'actas' && <CrudActas />}
                {tab === 'mesas' && <CrudMesas />}
            </div>
        </>
    );
}

// ─────────────────────────────────────────────
// FORMULARIO DE ACTA
// ─────────────────────────────────────────────
function FormularioActa() {
    const [acta, setActa] = useState({
        codigo_mesa: '', votos_emitidos: '', ausentismo: '',
        p1: '', p2: '', p3: '', p4: '',
        votos_blancos: '', votos_nulos: '',
        creado_por: 'operador_web',
    });
    const [resp, setResp] = useState<any>(null);
    const [enviando, setEnviando] = useState(false);
    const [mesaInfo, setMesaInfo] = useState<any>(null);
    const [mesaError, setMesaError] = useState<string | null>(null);
    const [buscandoMesa, setBuscandoMesa] = useState(false);

    function set(campo: string, valor: string) {
        setActa((a) => ({ ...a, [campo]: valor }));
    }

    function reset() {
        setActa({
            codigo_mesa: '', votos_emitidos: '', ausentismo: '',
            p1: '', p2: '', p3: '', p4: '',
            votos_blancos: '', votos_nulos: '',
            creado_por: 'operador_web',
        });
        setResp(null); setMesaInfo(null); setMesaError(null);
    }

    useEffect(() => {
        const codigo = acta.codigo_mesa.trim();
        if (!codigo || codigo.length < 6) {
            setMesaInfo(null); setMesaError(null); return;
        }
        const timer = setTimeout(async () => {
            setBuscandoMesa(true);
            try {
                const info = await api.mesaInfo(codigo);
                if (info && !info.error) { setMesaInfo(info); setMesaError(null); }
                else { setMesaInfo(null); setMesaError(info?.error || 'Mesa no encontrada en el padrón'); }
            } catch {
                setMesaInfo(null); setMesaError('Mesa no encontrada en el padrón');
            } finally {
                setBuscandoMesa(false);
            }
        }, 400);
        return () => clearTimeout(timer);
    }, [acta.codigo_mesa]);

    async function enviar() {
        setEnviando(true);
        try {
            const numeric: any = { ...acta };
            for (const k of Object.keys(acta)) {
                if (k !== 'creado_por' && acta[k as keyof typeof acta] !== '')
                    numeric[k] = parseInt(acta[k as keyof typeof acta] as string, 10);
            }
            numeric.fuente = 'MANUAL';
            const r = await api.enviarActaOficial(numeric);
            setResp(r);
        } finally {
            setEnviando(false);
        }
    }

    const totalCandidatos = ['p1','p2','p3','p4']
        .reduce((a, k) => a + (parseInt(acta[k as keyof typeof acta] as string, 10) || 0), 0);
    const totalConBlancosNulos = totalCandidatos
        + (parseInt(acta.votos_blancos, 10) || 0)
        + (parseInt(acta.votos_nulos, 10) || 0);
    const emitidos = parseInt(acta.votos_emitidos, 10) || 0;
    const ausentismoIngresado = parseInt(acta.ausentismo, 10) || 0;
    const balanceOk = emitidos > 0 && emitidos === totalConBlancosNulos;
    const habilitados = mesaInfo?.cantidad_habilitada || 0;
    const balancePadronOk = habilitados > 0 && (emitidos + ausentismoIngresado) === habilitados;
    const ausentismoSugerido = habilitados > 0 ? Math.max(0, habilitados - emitidos) : null;

    return (
        <div className="two-col">
            {/* ── Formulario principal ── */}
            <div className="card mb-0">
                <div className="card-title">Transcripción de acta física</div>

                {/* Identificación */}
                <div className="form-section-title">Identificación</div>
                <div className="form-grid">
                    <div className="field full">
                        <label>Código de mesa</label>
                        <input
                            type="number"
                            placeholder="Ej. 10101001001"
                            value={acta.codigo_mesa}
                            onChange={(e) => set('codigo_mesa', e.target.value)}
                        />
                        {buscandoMesa && (
                            <span className="hint" style={{ color: 'var(--blue)' }}>
                                <RefreshCw size={11} style={{ animation: 'spin 1s linear infinite' }} />
                                Buscando en padrón…
                            </span>
                        )}
                        {!buscandoMesa && mesaError && (
                            <span className="hint" style={{ color: 'var(--red)' }}>
                                <AlertTriangle size={11} /> {mesaError}
                            </span>
                        )}
                        {!buscandoMesa && mesaInfo && (
                            <div className="mesa-info-box">
                                <div>
                                    <div className="info-item-label">Habilitados</div>
                                    <div className="info-item-value">{Number(mesaInfo.cantidad_habilitada).toLocaleString()}</div>
                                </div>
                                <div>
                                    <div className="info-item-label">Mesa Nº</div>
                                    <div className="info-item-value">{mesaInfo.nro_mesa}</div>
                                </div>
                                <div style={{ gridColumn: 'span 2' }}>
                                    <div className="info-item-label">Recinto</div>
                                    <div className="info-item-value" style={{ fontSize: 13 }}>{mesaInfo.recinto_nombre}</div>
                                    <div className="info-item-sub">{mesaInfo.departamento} · {mesaInfo.provincia}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Resumen */}
                <div className="form-section-title">Resumen del acta</div>
                <div className="form-grid">
                    <div className="field">
                        <label>Votos emitidos</label>
                        <input type="number" value={acta.votos_emitidos} onChange={(e) => set('votos_emitidos', e.target.value)} />
                    </div>
                    <div className="field">
                        <label>Ausentismo</label>
                        <input type="number" value={acta.ausentismo} onChange={(e) => set('ausentismo', e.target.value)} />
                        {ausentismoSugerido != null && acta.ausentismo === '' && (
                            <span className="hint" style={{ color: 'var(--blue)' }}>
                                Sugerido: {ausentismoSugerido}
                                <button
                                    type="button"
                                    style={{ marginLeft: 6, padding: '2px 8px', fontSize: 11, background: 'var(--blue-dim)', border: '1px solid rgba(78,154,241,0.25)', borderRadius: 5, color: 'var(--blue)', cursor: 'pointer', fontFamily: 'DM Sans' }}
                                    onClick={() => set('ausentismo', String(ausentismoSugerido))}
                                >Usar</button>
                            </span>
                        )}
                    </div>
                </div>

                {/* Candidaturas */}
                <div className="form-section-title">Votos por candidatura</div>
                <div className="form-grid">
                    {CAMPOS_VOTOS.map((c) => (
                        <div key={c.key} className="field">
                            <label>{c.short} — {c.label}</label>
                            <input
                                type="number"
                                value={acta[c.key as keyof typeof acta]}
                                onChange={(e) => set(c.key, e.target.value)}
                            />
                        </div>
                    ))}
                </div>

                {/* Otros */}
                <div className="form-section-title">Otros</div>
                <div className="form-grid">
                    <div className="field">
                        <label>Votos blancos</label>
                        <input type="number" value={acta.votos_blancos} onChange={(e) => set('votos_blancos', e.target.value)} />
                    </div>
                    <div className="field">
                        <label>Votos nulos</label>
                        <input type="number" value={acta.votos_nulos} onChange={(e) => set('votos_nulos', e.target.value)} />
                    </div>
                </div>

                <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
                    <button className="btn-primary" onClick={enviar} disabled={enviando || !acta.codigo_mesa}>
                        <Send size={14} />
                        {enviando ? 'Enviando…' : 'Enviar acta'}
                    </button>
                    <button className="btn-secondary" onClick={reset} disabled={enviando}>Limpiar</button>
                </div>

                {resp && <ResultadoEnvio resp={resp} />}
            </div>

            {/* ── Panel lateral ── */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                {/* Verificación */}
                <div className="card mb-0">
                    <div className="card-title">Verificación rápida</div>

                    <div className="verify-section-label">Balance interno (R2)</div>
                    <div style={{ marginBottom: 14 }}>
                        <div className="resumen-item"><span>Suma candidaturas</span><strong>{totalCandidatos.toLocaleString()}</strong></div>
                        <div className="resumen-item"><span>+ Blancos + Nulos</span><strong>{totalConBlancosNulos.toLocaleString()}</strong></div>
                        <div className="resumen-item" style={{ borderBottom: 'none' }}><span>Votos emitidos</span><strong>{emitidos.toLocaleString()}</strong></div>
                    </div>
                    <div style={{ paddingBottom: 16, marginBottom: 16, borderBottom: '1px solid var(--rim)' }}>
                        {emitidos === 0 ? (
                            <span className="badge badge-muted">Sin datos</span>
                        ) : balanceOk ? (
                            <span className="badge badge-green"><CheckCircle size={11} /> Balance interno OK</span>
                        ) : (
                            <span className="badge badge-amber"><AlertTriangle size={11} /> Diferencia {Math.abs(emitidos - totalConBlancosNulos)}</span>
                        )}
                    </div>

                    <div className="verify-section-label">Balance vs padrón (R1)</div>
                    <div style={{ marginBottom: 14 }}>
                        <div className="resumen-item"><span>Habilitados</span><strong>{habilitados ? habilitados.toLocaleString() : '—'}</strong></div>
                        <div className="resumen-item" style={{ borderBottom: 'none' }}><span>Emitidos + Ausentismo</span><strong>{(emitidos + ausentismoIngresado).toLocaleString()}</strong></div>
                    </div>
                    <div>
                        {!habilitados ? (
                            <span className="badge badge-muted">Esperando código de mesa</span>
                        ) : balancePadronOk ? (
                            <span className="badge badge-green"><CheckCircle size={11} /> Cuadra con padrón</span>
                        ) : (
                            <span className="badge badge-amber">
                                <AlertTriangle size={11} /> Diferencia {Math.abs(habilitados - emitidos - ausentismoIngresado)}
                            </span>
                        )}
                    </div>
                </div>

                {/* Tip */}
                <div className="tip-card">
                    <div className="tip-card-label">ℹ Nota del sistema</div>
                    <p>
                        El acta se guarda siempre. Si los balances no cuadran,
                        queda como <strong>EN_CUARENTENA</strong> en lugar de aprobada
                        y aparece en la pestaña <em>Actas</em> para revisión.
                    </p>
                </div>
            </div>
        </div>
    );
}

function ResumenItem({ label, value }: { label: string; value: string }) {
    return (
        <div className="resumen-item">
            <span>{label}</span>
            <strong>{value}</strong>
        </div>
    );
}

function ResultadoEnvio({ resp }: { resp: any }) {
    const variant = resp.status === 'APROBADA' ? 'ok'
                  : resp.status === 'EN_CUARENTENA' ? 'warn' : 'err';
    const Icon = variant === 'ok' ? CheckCircle : variant === 'warn' ? AlertTriangle : XCircle;
    return (
        <div className={`result-pill ${variant}`}>
            <Icon size={20} style={{ flexShrink: 0, marginTop: 1 }} />
            <div style={{ flex: 1 }}>
                <strong>{resp.status || 'Error'}</strong>
                {resp.motivo && <div>{resp.motivo}</div>}
                <details style={{ marginTop: 6 }}>
                    <summary>Ver respuesta completa</summary>
                    <pre>{JSON.stringify(resp, null, 2)}</pre>
                </details>
            </div>
        </div>
    );
}

// ─────────────────────────────────────────────
// CRUD ACTAS
// ─────────────────────────────────────────────
function CrudActas() {
    const [actas, setActas] = useState<any[]>([]);
    const [totalActas, setTotalActas] = useState<number | null>(null);
    const [estado, setEstado] = useState('');
    const [mesa, setMesa] = useState('');
    const [loading, setLoading] = useState(false);
    const loadingRef = useRef(false);

    async function cargar(silencioso = false) {
        if (loadingRef.current) return;
        loadingRef.current = true;
        if (!silencioso) setLoading(true);
        try {
            const r = await api.listarActas({
                estado: estado || undefined,
                mesa: mesa ? parseInt(mesa, 10) : undefined,
                limit: 300,
            });
            setActas(r);
            if (!estado && !mesa) setTotalActas(r.length);
        } finally {
            loadingRef.current = false;
            setLoading(false);
        }
    }

    useEffect(() => { cargar(); /* eslint-disable-next-line */ }, [estado]);
    useEffect(() => {
        const t = setInterval(() => cargar(true), 8000);
        return () => clearInterval(t);
    }, [estado, mesa]);

    async function anular(id: string, codigoMesa: number) {
        if (!confirm(`¿Anular el acta de la mesa ${codigoMesa}? Quedará marcada como ANULADA y dejará de contar.`)) return;
        const r: any = await api.anularActa(id, 'Anulada manualmente desde panel de administración');
        if (r?.error) { alert('Error: ' + r.error); return; }
        setActas(prev => prev.map(a => a.id === id ? { ...a, estado: 'ANULADA' } : a));
        await cargar();
    }

    async function rechazar(id: string, codigoMesa: number) {
        const motivo = prompt(`Motivo del rechazo del acta de mesa ${codigoMesa}:`);
        if (!motivo) return;
        const r: any = await api.cambiarEstadoActaOficial(id, 'RECHAZADA', motivo);
        if (r?.error) { alert('Error: ' + r.error); return; }
        setActas(prev => prev.map(a => a.id === id ? { ...a, estado: 'RECHAZADA' } : a));
        await cargar();
    }

    async function aprobar(id: string, codigoMesa: number) {
        if (!confirm(`¿Aprobar manualmente el acta de mesa ${codigoMesa}? Volverá a contar en los totales.`)) return;
        const r: any = await api.cambiarEstadoActaOficial(id, 'APROBADA', 'Aprobación manual desde panel');
        if (r?.error) { alert('Error: ' + r.error); return; }
        setActas(prev => prev.map(a => a.id === id ? { ...a, estado: 'APROBADA' } : a));
        await cargar();
    }

    return (
        <div className="card mb-0">
            <div className="toolbar">
                <div className="toolbar-title">
                    Actas oficiales
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 400, color: 'var(--text-3)', marginLeft: 10 }}>
                        {actas.length}{totalActas !== null && actas.length < totalActas ? ` / ${totalActas.toLocaleString()}` : ''}
                    </span>
                </div>
                <span className="spacer" />
                <select value={estado} onChange={(e) => setEstado(e.target.value)} style={{ width: 'auto' }}>
                    {ESTADO_FILTROS.map((e) => (
                        <option key={e} value={e}>{e || 'Todos los estados'}</option>
                    ))}
                </select>
                <div className="search-wrap">
                    <Search size={14} />
                    <input
                        placeholder="Buscar por mesa…"
                        type="number"
                        value={mesa}
                        onChange={(e) => setMesa(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && cargar()}
                    />
                </div>
                <button className="btn-secondary" onClick={() => cargar()} disabled={loading}>
                    <RefreshCw size={13} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
                    Refrescar
                </button>
            </div>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Mesa</th>
                            <th>Recinto / Depto</th>
                            <th>Emitidos</th>
                            <th>P1/P2/P3/P4</th>
                            <th>B / N</th>
                            <th>Fuente</th>
                            <th>Estado</th>
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {actas.map((a) => (
                            <tr key={a.id}>
                                <td>
                                    <strong style={{ color: 'var(--text)' }}>#{a.nro_mesa}</strong><br />
                                    <code>{a.codigo_mesa}</code>
                                </td>
                                <td>
                                    <span style={{ color: 'var(--text)', fontWeight: 500 }}>{a.recinto_nombre}</span><br />
                                    <span style={{ color: 'var(--text-3)', fontSize: 11 }}>{a.departamento}</span>
                                </td>
                                <td style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>{Number(a.votos_emitidos || 0).toLocaleString()}</td>
                                <td style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-3)' }}>{a.p1}/{a.p2}/{a.p3}/{a.p4}</td>
                                <td style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-3)' }}>{a.votos_blancos}/{a.votos_nulos}</td>
                                <td><span className="badge badge-muted">{a.fuente}</span></td>
                                <td><EstadoBadge estado={a.estado} /></td>
                                <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                                    <div style={{ display: 'flex', gap: 5, justifyContent: 'flex-end' }}>
                                        {a.estado !== 'APROBADA' && a.estado !== 'ANULADA' && (
                                            <button
                                                className="btn-secondary btn-sm"
                                                style={{ color: 'var(--green)', borderColor: 'rgba(52,211,153,0.2)' }}
                                                onClick={() => aprobar(a.id, a.codigo_mesa)}
                                            >Aprobar</button>
                                        )}
                                        {a.estado !== 'RECHAZADA' && a.estado !== 'ANULADA' && (
                                            <button
                                                className="btn-secondary btn-sm"
                                                onClick={() => rechazar(a.id, a.codigo_mesa)}
                                            >Rechazar</button>
                                        )}
                                        {a.estado !== 'ANULADA' && (
                                            <button
                                                className="btn-danger btn-sm"
                                                onClick={() => anular(a.id, a.codigo_mesa)}
                                                title="Anular permanentemente"
                                            >
                                                <Trash2 size={11} />
                                            </button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {actas.length === 0 && (
                            <tr className="empty-row">
                                <td colSpan={8}>
                                    {loading ? 'Cargando…' : 'No hay actas para los filtros seleccionados'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function EstadoBadge({ estado }: { estado: string }) {
    const map: Record<string, string> = {
        APROBADA:      'badge badge-green',
        PENDIENTE:     'badge badge-blue',
        EN_CUARENTENA: 'badge badge-amber',
        ANULADA:       'badge badge-muted',
        RECHAZADA:     'badge badge-red',
    };
    return <span className={map[estado] || 'badge badge-muted'}>{estado}</span>;
}

// ─────────────────────────────────────────────
// CRUD MESAS
// ─────────────────────────────────────────────
function CrudMesas() {
    const [mesas, setMesas] = useState<any[]>([]);
    const [recintos, setRecintos] = useState<any[]>([]);
    const [q, setQ] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);

    async function cargar() {
        setLoading(true);
        try {
            const m = await api.listarMesasCrud({ q: q || undefined, limit: 200 });
            setMesas(m);
        } finally { setLoading(false); }
    }

    useEffect(() => {
        cargar();
        api.listarRecintosTodos().then(setRecintos).catch(() => setRecintos([]));
    }, []);

    async function eliminar(codigoMesa: number) {
        if (!confirm(`¿Eliminar la mesa ${codigoMesa}?\nSolo se puede si no tiene actas activas.`)) return;
        try {
            const r: any = await api.eliminarMesa(codigoMesa);
            if (r?.error) { alert('⚠️ No se pudo eliminar:\n' + r.error); return; }
            setMesas(prev => prev.filter(m => m.codigo_mesa !== codigoMesa));
            await cargar();
        } catch (err: any) {
            alert('⚠️ Error: ' + (err.message || String(err)));
        }
    }

    return (
        <div className="card mb-0">
            <div className="toolbar">
                <div className="toolbar-title">
                    Mesas electorales
                    <span style={{ fontFamily: 'JetBrains Mono', fontSize: 12, fontWeight: 400, color: 'var(--text-3)', marginLeft: 10 }}>
                        {mesas.length}
                    </span>
                </div>
                <span className="spacer" />
                <div className="search-wrap">
                    <Search size={14} />
                    <input
                        placeholder="Buscar mesa o recinto…"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && cargar()}
                    />
                </div>
                <button className="btn-secondary" onClick={cargar} disabled={loading}>
                    <RefreshCw size={13} style={loading ? { animation: 'spin 1s linear infinite' } : {}} />
                    Refrescar
                </button>
                <button className="btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={14} /> Nueva mesa
                </button>
            </div>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Código de mesa</th>
                            <th>Nº</th>
                            <th>Habilitados</th>
                            <th>Recinto</th>
                            <th>Departamento / Provincia</th>
                            <th>Actas activas</th>
                            <th style={{ textAlign: 'right' }}>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {mesas.map((m) => (
                            <tr key={m.codigo_mesa}>
                                <td><code>{m.codigo_mesa}</code></td>
                                <td><strong style={{ color: 'var(--text)' }}>#{m.nro_mesa}</strong></td>
                                <td style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>{Number(m.cantidad_habilitada).toLocaleString()}</td>
                                <td style={{ color: 'var(--text)', fontWeight: 500 }}>{m.recinto_nombre}</td>
                                <td style={{ color: 'var(--text-3)' }}>{m.departamento} · {m.provincia}</td>
                                <td>
                                    {m.actas_activas > 0
                                        ? <span className="badge badge-blue">{m.actas_activas}</span>
                                        : <span className="badge badge-muted">0</span>
                                    }
                                </td>
                                <td style={{ textAlign: 'right' }}>
                                    <button
                                        className="btn-danger btn-sm"
                                        onClick={() => eliminar(m.codigo_mesa)}
                                        disabled={m.actas_activas > 0}
                                        title={m.actas_activas > 0 ? 'Anula sus actas primero' : 'Eliminar mesa'}
                                    >
                                        <Trash2 size={11} /> Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {mesas.length === 0 && (
                            <tr className="empty-row">
                                <td colSpan={7}>
                                    {loading ? 'Cargando…' : 'No hay mesas para mostrar'}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showModal && (
                <ModalNuevaMesa
                    recintos={recintos}
                    onClose={() => setShowModal(false)}
                    onCreated={() => { setShowModal(false); cargar(); }}
                />
            )}
        </div>
    );
}

function ModalNuevaMesa({ recintos, onClose, onCreated }: {
    recintos: any[]; onClose: () => void; onCreated: () => void;
}) {
    const [data, setData] = useState({
        codigo_mesa: '', nro_mesa: '', cantidad_habilitada: '', id_recinto: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [enviando, setEnviando] = useState(false);

    async function guardar(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        if (!data.codigo_mesa || !data.nro_mesa || !data.cantidad_habilitada || !data.id_recinto) {
            setError('Todos los campos son obligatorios.');
            return;
        }
        setEnviando(true);
        try {
            const r: any = await api.crearMesa({
                codigo_mesa: parseInt(data.codigo_mesa, 10),
                nro_mesa: parseInt(data.nro_mesa, 10),
                cantidad_habilitada: parseInt(data.cantidad_habilitada, 10),
                id_recinto: parseInt(data.id_recinto, 10),
            });
            if (r.error) setError(r.error);
            else onCreated();
        } catch (err: any) {
            setError(err.message || 'Error creando mesa');
        } finally {
            setEnviando(false);
        }
    }

    return (
        <div className="modal-backdrop" onClick={onClose}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="modal-title">Nueva mesa electoral</div>
                    <button className="btn-ghost" onClick={onClose}><X size={16} /></button>
                </div>

                <form onSubmit={guardar}>
                    <div className="form-grid">
                        <div className="field full">
                            <label>Recinto</label>
                            <select
                                value={data.id_recinto}
                                onChange={(e) => setData({ ...data, id_recinto: e.target.value })}
                            >
                                <option value="">Selecciona un recinto…</option>
                                {recintos.map((r) => (
                                    <option key={r.id_recinto} value={r.id_recinto}>
                                        {r.nombre} — {r.departamento}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="field full">
                            <label>Código de mesa (11 dígitos)</label>
                            <input
                                type="number"
                                placeholder="10101001001"
                                value={data.codigo_mesa}
                                onChange={(e) => setData({ ...data, codigo_mesa: e.target.value })}
                            />
                        </div>
                        <div className="field">
                            <label>Nº de mesa</label>
                            <input
                                type="number"
                                placeholder="1"
                                value={data.nro_mesa}
                                onChange={(e) => setData({ ...data, nro_mesa: e.target.value })}
                            />
                        </div>
                        <div className="field">
                            <label>Cantidad habilitada</label>
                            <input
                                type="number"
                                placeholder="200"
                                value={data.cantidad_habilitada}
                                onChange={(e) => setData({ ...data, cantidad_habilitada: e.target.value })}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="result-pill err" style={{ marginTop: 16 }}>
                            <XCircle size={18} style={{ flexShrink: 0 }} />
                            <div><strong>Error</strong><div>{error}</div></div>
                        </div>
                    )}

                    <div className="modal-actions">
                        <button type="button" className="btn-secondary" onClick={onClose}>Cancelar</button>
                        <button type="submit" className="btn-primary" disabled={enviando}>
                            {enviando ? 'Creando…' : 'Crear mesa'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

/* Animación spin para loader */
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { from { transform: rotate(0deg) } to { transform: rotate(360deg) } }';
if (typeof document !== 'undefined') document.head.appendChild(spinStyle);