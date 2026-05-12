'use client';

import { useEffect, useState } from 'react';
import {
    Bar, BarChart, CartesianGrid, Legend,
    PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line,
} from 'recharts';
import { Activity, Clock, MapPin, Users, CheckCircle, AlertTriangle, Trophy, Zap, FileSpreadsheet, Layers } from 'lucide-react';
import { api } from '@/lib/api';
import BoliviaMap from '@/components/BoliviaMap';

const COLORS = ['#c9a84c', '#4e9af1', '#e05c5c', '#7c5cbf', '#64748b', '#334155'];

/* ─── ESTILOS GLOBALES ─── */
const globalStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap');

  :root {
    --ink:        #0b0f1a;
    --ink-2:      #111827;
    --ink-3:      #1a2236;
    --ink-4:      #223;
    --glass:      rgba(255,255,255,0.04);
    --glass-b:    rgba(255,255,255,0.09);
    --rim:        rgba(255,255,255,0.07);
    --gold:       #c9a84c;
    --gold-soft:  #e8c96b;
    --gold-dim:   rgba(201,168,76,0.15);
    --blue:       #4e9af1;
    --blue-dim:   rgba(78,154,241,0.15);
    --green:      #34d399;
    --green-dim:  rgba(52,211,153,0.12);
    --red:        #e05c5c;
    --amber:      #f59e0b;
    --text:       #e8eaf0;
    --text-2:     #9ba3b4;
    --text-3:     #5c6479;
    --r:          12px;
    --r-lg:       18px;
    --shadow:     0 4px 24px rgba(0,0,0,0.4);
    --shadow-sm:  0 2px 8px rgba(0,0,0,0.3);
    --transition: 0.22s cubic-bezier(0.4,0,0.2,1);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'DM Sans', sans-serif;
    background: var(--ink);
    color: var(--text);
    min-height: 100vh;
  }

  /* Fondo con textura sutil */
  .dash-root {
    min-height: 100vh;
    padding: 32px;
    background:
      radial-gradient(ellipse 80% 60% at 50% -10%, rgba(201,168,76,0.06) 0%, transparent 70%),
      radial-gradient(ellipse 60% 40% at 100% 100%, rgba(78,154,241,0.05) 0%, transparent 60%),
      var(--ink);
    position: relative;
  }

  /* Línea decorativa superior */
  .dash-root::before {
    content: '';
    position: fixed;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, var(--gold), var(--blue), var(--gold), transparent);
    z-index: 100;
  }

  /* ── HEADER ── */
  .header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 36px;
    padding-bottom: 28px;
    border-bottom: 1px solid var(--rim);
    position: relative;
  }

  .header-eyebrow {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--gold);
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .header-eyebrow::before {
    content: '';
    display: inline-block;
    width: 20px;
    height: 1px;
    background: var(--gold);
  }

  .header-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2.6rem;
    font-weight: 400;
    line-height: 1.1;
    color: var(--text);
    letter-spacing: -0.02em;
  }

  .header-title em {
    font-style: italic;
    color: var(--gold-soft);
  }

  .header-sub {
    font-size: 0.875rem;
    color: var(--text-2);
    margin-top: 6px;
    font-weight: 300;
    letter-spacing: 0.01em;
  }

  /* ── STATUS BADGE ── */
  .status-badge {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 10px 18px;
    border-radius: 40px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.03em;
    border: 1px solid;
    backdrop-filter: blur(12px);
    transition: var(--transition);
    font-family: 'JetBrains Mono', monospace;
  }

  .status-badge.ok {
    background: rgba(52,211,153,0.08);
    border-color: rgba(52,211,153,0.3);
    color: var(--green);
  }

  .status-badge.error {
    background: rgba(224,92,92,0.08);
    border-color: rgba(224,92,92,0.3);
    color: var(--red);
  }

  .pulse {
    width: 7px; height: 7px;
    border-radius: 50%;
    background: currentColor;
    box-shadow: 0 0 0 0 currentColor;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0%   { box-shadow: 0 0 0 0 currentColor; opacity: 1; }
    70%  { box-shadow: 0 0 0 6px transparent; opacity: 0.6; }
    100% { box-shadow: 0 0 0 0 transparent; opacity: 1; }
  }

  /* ── TOOLBAR ── */
  .toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 14px 20px;
    background: var(--glass);
    border: 1px solid var(--rim);
    border-radius: var(--r-lg);
    margin-bottom: 14px;
    backdrop-filter: blur(8px);
    flex-wrap: wrap;
  }

  .toolbar-label {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-3);
    font-family: 'JetBrains Mono', monospace;
    white-space: nowrap;
  }

  .toolbar select {
    background: var(--ink-3);
    color: var(--text);
    border: 1px solid var(--rim);
    border-radius: 8px;
    padding: 7px 12px;
    font-size: 13px;
    font-family: 'DM Sans', sans-serif;
    font-weight: 500;
    outline: none;
    cursor: pointer;
    transition: var(--transition);
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239ba3b4'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 10px center;
    padding-right: 28px;
  }

  .toolbar select:hover, .toolbar select:focus {
    border-color: rgba(201,168,76,0.4);
    background-color: var(--ink-4);
  }

  .toolbar select:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  /* ── TABS ── */
  .tabs-strip {
    display: flex;
    gap: 4px;
    background: var(--ink-3);
    padding: 4px;
    border-radius: 10px;
    border: 1px solid var(--rim);
  }

  .tab-btn {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 7px 16px;
    border-radius: 7px;
    font-size: 12.5px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    border: none;
    background: transparent;
    color: var(--text-2);
    letter-spacing: 0.01em;
    font-family: 'DM Sans', sans-serif;
  }

  .tab-btn:hover { color: var(--text); background: var(--glass-b); }

  .tab-btn.active {
    background: linear-gradient(135deg, rgba(201,168,76,0.2), rgba(78,154,241,0.15));
    color: var(--gold-soft);
    border: 1px solid rgba(201,168,76,0.25);
    box-shadow: 0 2px 12px rgba(201,168,76,0.1);
  }

  /* ── CARDS ── */
  .card {
    background: var(--glass);
    border: 1px solid var(--rim);
    border-radius: var(--r-lg);
    padding: 24px;
    backdrop-filter: blur(8px);
    transition: var(--transition);
  }

  .card:hover {
    border-color: rgba(255,255,255,0.11);
  }

  .card-title {
    font-family: 'DM Serif Display', serif;
    font-size: 1.05rem;
    font-weight: 400;
    color: var(--text);
    margin-bottom: 20px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--rim);
    display: flex;
    align-items: center;
    gap: 10px;
    letter-spacing: -0.01em;
  }

  .card-title svg { opacity: 0.7; }

  /* ── KPI GRID ── */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
    margin-bottom: 24px;
  }

  .kpi-card {
    position: relative;
    overflow: hidden;
    background: var(--ink-3);
    border: 1px solid var(--rim);
    border-radius: var(--r);
    padding: 20px;
    transition: var(--transition);
  }

  .kpi-card::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, var(--accent-light, transparent), transparent 60%);
    pointer-events: none;
  }

  .kpi-card:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow);
    border-color: var(--accent, var(--rim));
  }

  .kpi-accent {
    position: absolute;
    top: 0; left: 0;
    width: 3px;
    height: 100%;
    border-radius: 3px 0 0 3px;
    background: var(--accent, var(--gold));
  }

  .kpi-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.12em;
    text-transform: uppercase;
    color: var(--text-3);
    margin-bottom: 10px;
    padding-left: 12px;
  }

  .kpi-value {
    font-family: 'DM Serif Display', serif;
    font-size: 2.1rem;
    font-weight: 400;
    color: var(--text);
    padding-left: 12px;
    letter-spacing: -0.03em;
    line-height: 1;
  }

  /* ── BLOQUE KPI (combinado) ── */
  .bloque-kpi {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .mini-kpi {
    background: var(--ink-3);
    padding: 12px 14px;
    border-radius: 10px;
    border-left: 3px solid var(--accent, var(--gold));
    transition: var(--transition);
  }

  .mini-kpi:hover { background: rgba(255,255,255,0.04); }

  .mini-label {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--text-3);
    font-weight: 500;
    margin-bottom: 5px;
  }

  .mini-value {
    font-family: 'DM Serif Display', serif;
    font-size: 1.6rem;
    font-weight: 400;
    color: var(--text);
    letter-spacing: -0.02em;
  }

  /* ── VISTA CARDS (combinado) ── */
  .vista-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 16px;
    margin-bottom: 24px;
  }

  .vista-card {
    background: var(--glass);
    border: 1px solid var(--rim);
    border-radius: var(--r-lg);
    padding: 20px;
    border-top: 2px solid var(--accent, var(--gold));
    backdrop-filter: blur(8px);
  }

  .vista-card h3 {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: 'DM Serif Display', serif;
    font-size: 0.95rem;
    font-weight: 400;
    color: var(--text-2);
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid var(--rim);
    letter-spacing: 0.01em;
  }

  /* ── TABLAS ── */
  table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    font-size: 13px;
  }

  thead tr {
    background: transparent;
  }

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
  }

  tbody tr {
    transition: var(--transition);
  }

  tbody tr:hover { background: rgba(255,255,255,0.025); }

  tbody td {
    padding: 11px 14px;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    color: var(--text-2);
    vertical-align: middle;
  }

  tbody td strong, tbody td:first-child { color: var(--text); }

  /* Barra de progreso participación */
  .progress-track {
    flex: 1;
    height: 5px;
    background: rgba(255,255,255,0.08);
    border-radius: 10px;
    overflow: hidden;
  }

  .progress-fill {
    height: 100%;
    border-radius: 10px;
    background: linear-gradient(90deg, var(--blue), var(--gold));
    transition: width 0.8s cubic-bezier(0.4,0,0.2,1);
  }

  .tag {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 600;
    font-family: 'JetBrains Mono', monospace;
  }

  .tag.green { background: var(--green-dim); color: var(--green); }
  .tag.amber { background: rgba(245,158,11,0.12); color: var(--amber); }

  /* ── MAPA ── */
  .map-wrap {
    position: relative;
    flex: 1;
    min-height: 380px;
  }

  .map-legend {
    position: absolute;
    bottom: 12px;
    right: 12px;
    background: rgba(17,24,39,0.92);
    backdrop-filter: blur(8px);
    padding: 10px 14px;
    border-radius: 10px;
    font-size: 11px;
    border: 1px solid var(--rim);
  }

  .map-legend strong {
    font-family: 'JetBrains Mono', monospace;
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    display: block;
    color: var(--text-3);
    margin-bottom: 6px;
  }

  .legend-row {
    display: flex;
    align-items: center;
    gap: 7px;
    margin-top: 4px;
    color: var(--text-2);
  }

  .legend-dot {
    width: 10px; height: 10px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  /* ── EXPLORADOR ── */
  .geo-chip {
    padding: 8px 14px;
    background: var(--ink-3);
    border: 1px solid var(--rim);
    border-radius: 8px;
    font-size: 12.5px;
    font-weight: 500;
    color: var(--text-2);
    cursor: pointer;
    transition: var(--transition);
    font-family: 'DM Sans', sans-serif;
  }

  .geo-chip:hover {
    border-color: rgba(201,168,76,0.4);
    color: var(--gold-soft);
    background: var(--gold-dim);
  }

  .recinto-row {
    padding: 14px 16px;
    background: var(--ink-3);
    border: 1px solid var(--rim);
    border-radius: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: var(--transition);
  }

  .recinto-row:hover {
    border-color: rgba(78,154,241,0.3);
    background: var(--blue-dim);
  }

  .recinto-row strong { font-size: 13px; color: var(--text); }
  .recinto-row .meta { font-size: 11.5px; color: var(--text-3); margin-top: 2px; }

  .btn-action {
    padding: 7px 14px;
    background: linear-gradient(135deg, rgba(201,168,76,0.2), rgba(78,154,241,0.15));
    border: 1px solid rgba(201,168,76,0.3);
    border-radius: 8px;
    color: var(--gold-soft);
    font-size: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: var(--transition);
    font-family: 'DM Sans', sans-serif;
    white-space: nowrap;
  }

  .btn-action:hover {
    background: linear-gradient(135deg, rgba(201,168,76,0.3), rgba(78,154,241,0.25));
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(201,168,76,0.15);
  }

  .btn-back {
    padding: 7px 14px;
    background: var(--ink-3);
    border: 1px solid var(--rim);
    border-radius: 8px;
    color: var(--text-2);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: var(--transition);
    font-family: 'DM Sans', sans-serif;
    margin-bottom: 16px;
  }

  .btn-back:hover { color: var(--text); border-color: rgba(255,255,255,0.15); }

  .mesa-chip {
    padding: 16px 14px;
    background: var(--ink-3);
    border: 1px solid var(--rim);
    border-radius: 10px;
    text-align: center;
    cursor: pointer;
    transition: var(--transition);
  }

  .mesa-chip:hover {
    border-color: rgba(201,168,76,0.3);
    background: var(--gold-dim);
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0,0,0,0.3);
  }

  .mesa-chip strong { display: block; font-size: 20px; color: var(--text); font-family: 'DM Serif Display', serif; }
  .mesa-chip span { font-size: 11px; color: var(--text-3); margin-top: 2px; display: block; }

  /* ── RANKING ── */
  .ranking-list { list-style: none; }
  .ranking-list li {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 9px 0;
    border-bottom: 1px solid rgba(255,255,255,0.04);
    font-size: 12.5px;
    color: var(--text-2);
  }

  .rank-num {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    color: var(--text-3);
    width: 18px;
    flex-shrink: 0;
    text-align: right;
  }

  .rank-name { flex: 1; color: var(--text); font-weight: 500; line-height: 1.3; }

  .rank-time {
    font-family: 'JetBrains Mono', monospace;
    font-size: 11px;
    font-weight: 600;
    color: var(--gold);
    white-space: nowrap;
  }

  /* ── MESA DETALLE ── */
  .mesa-detalle {
    background: var(--ink-3);
    border: 1px solid var(--rim);
    border-radius: var(--r-lg);
    padding: 22px;
  }

  .votos-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    margin-top: 14px;
  }

  .voto-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 14px;
    background: var(--glass);
    border: 1px solid var(--rim);
    border-radius: 8px;
    font-size: 13px;
    transition: var(--transition);
  }

  .voto-row:hover { border-color: rgba(201,168,76,0.2); }
  .voto-row span { color: var(--text-2); }
  .voto-row strong { font-family: 'JetBrains Mono', monospace; color: var(--gold-soft); font-size: 14px; }

  /* ── GANADORES ── */
  .ganador-tag {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 11px;
    font-weight: 700;
    font-family: 'JetBrains Mono', monospace;
  }

  /* ── TOOLTIPS ── */
  .recharts-tooltip-wrapper .recharts-default-tooltip {
    background: var(--ink-2) !important;
    border: 1px solid var(--rim) !important;
    border-radius: 10px !important;
    color: var(--text) !important;
  }

  /* ── EMPTY STATE ── */
  .empty-state {
    text-align: center;
    padding: 32px;
    color: var(--text-3);
    font-size: 13px;
    font-style: italic;
    font-family: 'DM Serif Display', serif;
  }

  /* ── LOADING ── */
  .loading-screen {
    display: flex;
    flex-direction: column;
    height: 100vh;
    justify-content: center;
    align-items: center;
    gap: 20px;
    background: var(--ink);
  }

  .loading-title {
    font-family: 'DM Serif Display', serif;
    font-size: 2rem;
    color: var(--gold-soft);
    letter-spacing: -0.02em;
  }

  .loading-bar {
    width: 220px;
    height: 2px;
    background: var(--rim);
    border-radius: 2px;
    overflow: hidden;
  }

  .loading-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--gold), var(--blue), var(--gold));
    background-size: 200% 100%;
    animation: shimmer 1.6s ease-in-out infinite;
  }

  @keyframes shimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── RECHARTS PERSONALIZATION ── */
  .recharts-cartesian-grid-horizontal line,
  .recharts-cartesian-grid-vertical line {
    stroke: rgba(255,255,255,0.05) !important;
  }

  .recharts-text { fill: var(--text-3) !important; font-family: 'JetBrains Mono', monospace !important; font-size: 10px !important; }

  /* Scrollbars */
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 3px; }
  ::-webkit-scrollbar-thumb:hover { background: rgba(255,255,255,0.18); }

  /* GRID utils */
  .layout-2col { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px; }
  .layout-main { display: grid; grid-template-columns: 1.15fr 2fr; gap: 20px; margin-bottom: 20px; }
  .layout-bottom { display: grid; grid-template-columns: 1.4fr 1fr; gap: 20px; margin-bottom: 20px; }
  .layout-4 { display: grid; grid-template-columns: repeat(4,1fr); gap: 16px; margin-bottom: 24px; }
  .mb-20 { margin-bottom: 20px; }
`;

export default function Dashboard() {
    const [rrv, setRrv] = useState<any>(null);
    const [oficial, setOficial] = useState<any>(null);
    const [tiempos, setTiempos] = useState<any>(null);
    const [ultimaActualizacion, setUltimaActualizacion] = useState<Date | null>(null);
    const [estadoConexion, setEstadoConexion] = useState<'conectando' | 'ok' | 'error'>('conectando');
    const [conteoRrv, setConteoRrv] = useState<{ total: number; porEstado: any[] } | null>(null);

    const [selectedDepto, setSelectedDepto] = useState<string>('TODOS');
    const [selectedProv, setSelectedProv] = useState<string>('TODOS');
    const [selectedRecinto, setSelectedRecinto] = useState<string>('TODOS');
    const [selectedMesa, setSelectedMesa] = useState<string>('TODOS');
    const [filtroTiempos, setFiltroTiempos] = useState<'rapidas' | 'lentas'>('rapidas');

    const [provincias, setProvincias] = useState<string[]>([]);
    const [recintos, setRecintos] = useState<any[]>([]);
    const [mesas, setMesas] = useState<any[]>([]);
    const [mesaDetalle, setMesaDetalle] = useState<any>(null);
    const [provTiempos, setProvTiempos] = useState<any>(null);

    const [vista, setVista] = useState<'combinada' | 'oficial' | 'rrv'>('combinada');
    const [ganadores, setGanadores] = useState<any>(null);
    const [nivelGanador, setNivelGanador] = useState<'departamento' | 'provincia' | 'municipio' | 'recinto'>('departamento');
    const [topHorarios, setTopHorarios] = useState<any[]>([]);

    useEffect(() => {
        if (selectedDepto !== 'TODOS') {
            api.getProvincias(selectedDepto).then(setProvincias).catch(() => setProvincias([]));
            setSelectedProv('TODOS'); setSelectedRecinto('TODOS'); setSelectedMesa('TODOS');
        } else setProvincias([]);
    }, [selectedDepto]);

    useEffect(() => {
        if (selectedProv !== 'TODOS') {
            api.getRecintos(selectedDepto, selectedProv).then(setRecintos).catch(() => setRecintos([]));
            api.tiempos(selectedDepto, selectedProv).then(setProvTiempos).catch(() => setProvTiempos(null));
            setSelectedRecinto('TODOS'); setSelectedMesa('TODOS');
        } else { setRecintos([]); setProvTiempos(null); }
    }, [selectedProv]);

    useEffect(() => {
        if (selectedRecinto !== 'TODOS') {
            api.getMesas(selectedRecinto).then(setMesas).catch(() => setMesas([]));
            setSelectedMesa('TODOS');
        } else setMesas([]);
    }, [selectedRecinto]);

    useEffect(() => {
        if (selectedMesa !== 'TODOS') api.getMesaDetalle(selectedMesa).then(setMesaDetalle).catch(() => setMesaDetalle(null));
        else setMesaDetalle(null);
    }, [selectedMesa]);

    useEffect(() => {
        const cargar = async () => {
            try {
                const [r, o, t, th, crrv] = await Promise.all([
                    api.rrvResumen(), api.oficialResumen(),
                    api.tiempos().catch(() => null),
                    api.topHorarios().catch(() => []),
                    api.conteoRrv().catch(() => null),
                ]);
                setRrv(r); setOficial(o); setTiempos(t); setTopHorarios(th);
                if (crrv) setConteoRrv(crrv);
                setUltimaActualizacion(new Date());
                setEstadoConexion('ok');
            } catch (err) {
                console.error('[dashboard] error fetching:', err);
                setEstadoConexion('error');
            }
        };
        cargar();
        const t = setInterval(cargar, 10000);
        return () => clearInterval(t);
    }, []);

    useEffect(() => {
        api.ganadorTerritorio(nivelGanador).then(setGanadores).catch(() => setGanadores(null));
    }, [nivelGanador]);

    if (!rrv && !oficial && estadoConexion === 'conectando') {
        return (
            <>
                <style>{globalStyles}</style>
                <div className="loading-screen">
                    <div className="loading-title">Cómputo Electoral</div>
                    <div className="loading-bar"><div className="loading-fill" /></div>
                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 11, color: 'var(--text-3)', letterSpacing: '0.1em' }}>INICIANDO SISTEMA…</div>
                </div>
            </>
        );
    }

    const totalesRrv = rrv?.totales || {};
    const totalesOf = oficial?.totales || {};
    const partidos = ['p1', 'p2', 'p3', 'p4', 'votos_blancos', 'votos_nulos'];

    const dataComparacion = partidos.map((p) => {
        let keyOficial = `total_${p}`;
        if (p === 'votos_blancos') keyOficial = 'total_blancos';
        if (p === 'votos_nulos') keyOficial = 'total_nulos';
        return {
            partido: p.replace('votos_', '').toUpperCase(),
            RRV: Number(totalesRrv[p] || 0),
            Oficial: Number(totalesOf[keyOficial] || totalesOf[p] || 0),
        };
    });

    const dataPie = partidos.slice(0, 4).map((p, i) => ({
        name: p.toUpperCase(),
        value: Number(totalesOf[`total_${p}`] || totalesOf[p] || 0),
        fill: COLORS[i],
    }));

    const participacionData = oficial?.participacion || [];
    const deptosOptions = ['TODOS', ...Array.from(new Set(participacionData.map((p: any) => p.departamento)))];
    const displayParticipacion = selectedDepto === 'TODOS'
        ? participacionData
        : participacionData.filter((p: any) => p.departamento === selectedDepto);

    const colorPartido: Record<string, string> = {
        P1: '#c9a84c', P2: '#4e9af1', P3: '#e05c5c', P4: '#7c5cbf',
    };

    const customTooltipStyle = {
        background: '#111827',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 10,
        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
        color: '#e8eaf0',
        fontSize: 12,
        fontFamily: 'DM Sans, sans-serif',
    };

    return (
        <>
            <style>{globalStyles}</style>
            <div className="dash-root">

                {/* ── HEADER ── */}
                <header className="header">
                    <div>
                        <div className="header-eyebrow">
                            <Activity size={11} />
                            Sistema de Cómputo Plurinacional
                        </div>
                        <h1 className="header-title">
                            Cómputo <em>Electoral</em>
                        </h1>
                        <p className="header-sub">Visualización interactiva en tiempo real · RRV & Oficial</p>
                    </div>
                    <div className={`status-badge ${estadoConexion === 'ok' ? 'ok' : 'error'}`}>
                        <span className="pulse" />
                        {estadoConexion === 'ok' ? 'Sistema en Línea' : 'Reconectando…'}
                        {ultimaActualizacion && (
                            <span style={{ opacity: 0.6, fontWeight: 400 }}>
                                {ultimaActualizacion.toLocaleTimeString()}
                            </span>
                        )}
                    </div>
                </header>

                {/* ── VISTA SELECTOR ── */}
                <div className="toolbar mb-20">
                    <span className="toolbar-label"><Layers size={13} />Vista</span>
                    <div className="tabs-strip">
                        <button className={`tab-btn ${vista === 'combinada' ? 'active' : ''}`} onClick={() => setVista('combinada')}>
                            <Activity size={13} /> Combinada
                        </button>
                        <button className={`tab-btn ${vista === 'oficial' ? 'active' : ''}`} onClick={() => setVista('oficial')}>
                            <FileSpreadsheet size={13} /> Oficial
                        </button>
                        <button className={`tab-btn ${vista === 'rrv' ? 'active' : ''}`} onClick={() => setVista('rrv')}>
                            <Zap size={13} /> Rápido RRV
                        </button>
                    </div>
                    <span style={{ flex: 1 }} />
                    <span style={{ fontSize: 11, color: 'var(--text-3)', fontFamily: 'JetBrains Mono', letterSpacing: '0.04em' }}>
                        {vista === 'combinada' && 'OFICIAL + RRV EN PARALELO'}
                        {vista === 'oficial' && 'SOLO CÓMPUTO OFICIAL — POSTGRESQL'}
                        {vista === 'rrv' && 'SOLO RECEPCIÓN RÁPIDA — MONGODB'}
                    </span>
                </div>

                {/* ── FILTROS ── */}
                <div className="toolbar mb-20">
                    <span className="toolbar-label"><MapPin size={13} />Filtrar</span>
                    <select value={selectedDepto} onChange={e => setSelectedDepto(e.target.value)}>
                        {deptosOptions.map((opt: any) => <option key={opt} value={opt}>{opt}</option>)}
                    </select>
                    <select value={selectedProv} onChange={e => setSelectedProv(e.target.value)} disabled={selectedDepto === 'TODOS'}>
                        <option value="TODOS">Todas las provincias</option>
                        {provincias.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <select value={selectedRecinto} onChange={e => setSelectedRecinto(e.target.value)} disabled={selectedProv === 'TODOS'}>
                        <option value="TODOS">Todos los recintos</option>
                        {recintos.map(r => <option key={r.id_recinto} value={r.id_recinto}>{r.nombre}</option>)}
                    </select>
                    <select value={selectedMesa} onChange={e => setSelectedMesa(e.target.value)} disabled={selectedRecinto === 'TODOS'}>
                        <option value="TODOS">Todas las mesas</option>
                        {mesas.map(m => <option key={m.codigo_mesa} value={m.codigo_mesa}>Mesa #{m.nro_mesa} · {m.cantidad_habilitada} hab.</option>)}
                    </select>
                </div>

                {/* ── KPIs ── */}
                {vista === 'combinada' && (
                    <div className="vista-grid mb-20">
                        <div className="vista-card" style={{ '--accent': '#4e9af1' } as any}>
                            <h3><FileSpreadsheet size={15} style={{ color: '#4e9af1' }} />Cómputo Oficial</h3>
                            <BloqueKpi
                                emitidos={Number(totalesOf.total_emitidos || 0)}
                                validos={['p1','p2','p3','p4'].reduce((a, p) => a + Number(totalesOf[`total_${p}`] || totalesOf[p] || 0), 0)}
                                mesas={(oficial?.estados || []).find((e: any) => e.estado === 'APROBADA')?.cantidad || 0}
                                cuarentena={(oficial?.estados || []).find((e: any) => e.estado === 'EN_CUARENTENA')?.cantidad || 0}
                            />
                        </div>
                        <div className="vista-card" style={{ '--accent': '#c9a84c' } as any}>
                            <h3><Zap size={15} style={{ color: '#c9a84c' }} />Cómputo Rápido RRV</h3>
                            <BloqueKpi
                                emitidos={conteoRrv?.total ?? (rrv?.estados || []).reduce((s: number, e: any) => s + (e.cantidad || 0), 0)}
                                validos={(conteoRrv?.porEstado || []).find((e: any) => e._id === 'APROBADA')?.cantidad || 0}
                                mesas={Number(totalesRrv.votos_emitidos || 0)}
                                cuarentena={(conteoRrv?.porEstado || []).find((e: any) => e._id === 'EN_VERIFICACION')?.cantidad || 0}
                                label1="Total Actas RRV" label2="Actas Aprobadas"
                                label3="Votos Emitidos" label4="En Verificación"
                            />
                        </div>
                        <div className="vista-card" style={{ '--accent': '#34d399' } as any}>
                            <h3><Activity size={15} style={{ color: '#34d399' }} />Combinado Total</h3>
                            <BloqueKpi
                                emitidos={Number(totalesOf.total_emitidos || 0) + Number(totalesRrv.votos_emitidos || 0)}
                                validos={
                                    ['p1','p2','p3','p4'].reduce((a, p) => a + Number(totalesOf[`total_${p}`] || totalesOf[p] || 0), 0)
                                    + ['p1','p2','p3','p4'].reduce((a, p) => a + Number(totalesRrv[p] || 0), 0)
                                }
                                mesas={
                                    ((oficial?.estados || []).find((e: any) => e.estado === 'APROBADA')?.cantidad || 0)
                                    + ((rrv?.estados || []).find((e: any) => e._id === 'APROBADA')?.cantidad || 0)
                                }
                                cuarentena={
                                    ((oficial?.estados || []).find((e: any) => e.estado === 'EN_CUARENTENA')?.cantidad || 0)
                                    + ((rrv?.estados || []).find((e: any) => e._id === 'EN_VERIFICACION')?.cantidad || 0)
                                }
                                label3="Mesas Aprobadas" label4="Pendientes (suma)"
                            />
                        </div>
                    </div>
                )}

                {vista === 'oficial' && (
                    <div className="layout-4">
                        {[
                            { label: 'Votos Emitidos', value: Number(totalesOf.total_emitidos || 0), color: '#4e9af1', icon: <Users size={16} /> },
                            { label: 'Votos Válidos', value: ['p1','p2','p3','p4'].reduce((a, p) => a + Number(totalesOf[`total_${p}`] || totalesOf[p] || 0), 0), color: '#34d399', icon: <CheckCircle size={16} /> },
                            { label: 'Mesas Aprobadas', value: (oficial?.estados || []).find((e: any) => e.estado === 'APROBADA')?.cantidad || 0, color: '#7c5cbf', icon: <FileSpreadsheet size={16} /> },
                            { label: 'En Cuarentena', value: (oficial?.estados || []).find((e: any) => e.estado === 'EN_CUARENTENA')?.cantidad || 0, color: '#f59e0b', icon: <AlertTriangle size={16} /> },
                        ].map(k => (
                            <div key={k.label} className="kpi-card" style={{ '--accent': k.color, '--accent-light': `${k.color}10` } as any}>
                                <div className="kpi-accent" style={{ background: k.color }} />
                                <div className="kpi-label">{k.label}</div>
                                <div className="kpi-value">{Number(k.value).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                )}

                {vista === 'rrv' && (
                    <div className="layout-4">
                        {[
                            { label: 'Total Actas RRV', value: conteoRrv?.total ?? 0, color: '#c9a84c' },
                            { label: 'Actas Aprobadas', value: (conteoRrv?.porEstado || []).find((e: any) => e._id === 'APROBADA')?.cantidad || 0, color: '#34d399' },
                            { label: 'Votos Emitidos', value: Number(totalesRrv.votos_emitidos || 0), color: '#4e9af1' },
                            { label: 'Inconsistentes', value: (['DUPLICADO_PARCIAL','DATOS_INCONSISTENTES','MESA_FANTASMA'].reduce((s: number, k: string) => s + ((conteoRrv?.porEstado || []).find((e: any) => e._id === k)?.cantidad || 0), 0)), color: '#e05c5c' },
                        ].map(k => (
                            <div key={k.label} className="kpi-card" style={{ '--accent': k.color, '--accent-light': `${k.color}10` } as any}>
                                <div className="kpi-accent" style={{ background: k.color }} />
                                <div className="kpi-label">{k.label}</div>
                                <div className="kpi-value">{Number(k.value).toLocaleString()}</div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── MAPA + GRÁFICOS ── */}
                <div className="layout-main">
                    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
                        <h3 className="card-title"><MapPin size={16} />Mapa de Participación</h3>
                        <div className="map-wrap">
                            <BoliviaMap
                                data={participacionData}
                                onDepartmentClick={(depto: string) => setSelectedDepto(depto === selectedDepto ? 'TODOS' : depto)}
                            />
                            <div className="map-legend">
                                <strong>Participación</strong>
                                <div className="legend-row"><span className="legend-dot" style={{ background: '#06d6a0' }} />&gt; 80%</div>
                                <div className="legend-row"><span className="legend-dot" style={{ background: '#118ab2' }} />50% – 80%</div>
                                <div className="legend-row"><span className="legend-dot" style={{ background: '#ffd166' }} />&lt; 50%</div>
                            </div>
                        </div>
                        <p style={{ fontSize: 11, color: 'var(--text-3)', textAlign: 'center', marginTop: 12, fontFamily: 'JetBrains Mono', letterSpacing: '0.04em' }}>
                            Selecciona un departamento para filtrar
                        </p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                        <div className="card">
                            <h3 className="card-title"><Activity size={16} />Comparativa RRV vs Oficial</h3>
                            <ResponsiveContainer width="100%" height={240}>
                                <BarChart data={dataComparacion} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="partido" axisLine={false} tickLine={false} tick={{ fill: '#5c6479', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5c6479', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                                    <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                    <Legend wrapperStyle={{ paddingTop: 16, fontSize: 12, color: '#9ba3b4', fontFamily: 'DM Sans' }} />
                                    <Bar dataKey="RRV" fill="#c9a84c" radius={[4, 4, 0, 0]} barSize={32} />
                                    <Bar dataKey="Oficial" fill="#4e9af1" radius={[4, 4, 0, 0]} barSize={32} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        <div className="card">
                            <h3 className="card-title">Distribución Votos Válidos</h3>
                            <ResponsiveContainer width="100%" height={180}>
                                <PieChart>
                                    <Pie data={dataPie} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={3}>
                                        {dataPie.map((d, i) => <Cell key={i} fill={d.fill} />)}
                                    </Pie>
                                    <Tooltip contentStyle={customTooltipStyle} />
                                    <Legend wrapperStyle={{ fontSize: 12, color: '#9ba3b4', fontFamily: 'DM Sans' }} />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* ── TABLA PARTICIPACIÓN + EXPLORADOR ── */}
                <div className={selectedDepto !== 'TODOS' ? 'layout-2col' : ''} style={{ marginBottom: 20 }}>
                    <div className="card">
                        <h3 className="card-title">
                            <Users size={16} />
                            Detalle Departamental {selectedDepto !== 'TODOS' ? `— ${selectedDepto}` : ''}
                        </h3>
                        <div style={{ overflowX: 'auto' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Departamento</th>
                                        <th>Habilitados</th>
                                        <th>Emitidos</th>
                                        <th>Participación</th>
                                        <th>Estado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {displayParticipacion.map((p: any) => (
                                        <tr key={p.departamento}>
                                            <td><strong>{p.departamento}</strong></td>
                                            <td>{Number(p.total_habilitados).toLocaleString()}</td>
                                            <td>{Number(p.total_emitidos).toLocaleString()}</td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                    <div className="progress-track">
                                                        <div className="progress-fill" style={{ width: `${p.porcentaje}%` }} />
                                                    </div>
                                                    <span style={{ fontSize: 12, fontWeight: 700, minWidth: 42, fontFamily: 'JetBrains Mono', color: 'var(--text)' }}>{p.porcentaje}%</span>
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`tag ${Number(p.porcentaje) > 50 ? 'green' : 'amber'}`}>
                                                    {Number(p.porcentaje) > 50 ? 'Óptimo' : 'Procesando'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                    {displayParticipacion.length === 0 && (
                                        <tr><td colSpan={5}><div className="empty-state">Sin datos para el filtro seleccionado</div></td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {selectedDepto !== 'TODOS' && (
                        <div className="card">
                            <h3 className="card-title"><MapPin size={16} />Explorador Geográfico — {selectedDepto}</h3>

                            {selectedProv === 'TODOS' ? (
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                                    {provincias.map(p => (
                                        <button key={p} className="geo-chip" onClick={() => setSelectedProv(p)}>{p}</button>
                                    ))}
                                </div>
                            ) : selectedRecinto === 'TODOS' ? (
                                <div>
                                    <button className="btn-back" onClick={() => setSelectedProv('TODOS')}>← Volver a Provincias</button>
                                    <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16 }}>
                                        <div>
                                            <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
                                                Recintos en {selectedProv}
                                            </div>
                                            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                                                {recintos.map(r => (
                                                    <div key={r.id_recinto} className="recinto-row">
                                                        <div>
                                                            <strong>{r.nombre}</strong>
                                                            <div className="meta">{r.cantidad_mesas} mesas · {r.direccion}</div>
                                                        </div>
                                                        <button className="btn-action" onClick={() => setSelectedRecinto(r.id_recinto)}>Ver Mesas</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                        <div style={{ background: 'var(--ink-3)', padding: 16, borderRadius: 12, border: '1px solid var(--rim)' }}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                                                <span style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-3)' }}>Tiempos</span>
                                                <select value={filtroTiempos} onChange={(e) => setFiltroTiempos(e.target.value as any)} style={{ fontSize: 11, padding: '4px 8px', background: 'var(--ink)', border: '1px solid var(--rim)', borderRadius: 6, color: 'var(--text-2)', fontFamily: 'DM Sans', outline: 'none' }}>
                                                    <option value="rapidas">Más Rápidos</option>
                                                    <option value="lentas">Más Lentos</option>
                                                </select>
                                            </div>
                                            <ul className="ranking-list">
                                                {provTiempos?.data ? (
                                                    provTiempos.data[filtroTiempos === 'rapidas' ? 'mas_rapidas' : 'mas_lentas']?.map((m: any, i: number) => (
                                                        <li key={m.id_recinto || i}>
                                                            <span className="rank-num">{i + 1}</span>
                                                            <span className="rank-name">{m.recinto_nombre}</span>
                                                            <span className="rank-time">{Math.floor(m.duracion_minutos / 60)}h {m.duracion_minutos % 60}m</span>
                                                        </li>
                                                    ))
                                                ) : <li style={{ color: 'var(--text-3)', fontSize: 12 }}>Cargando…</li>}
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                            ) : selectedMesa === 'TODOS' ? (
                                <div>
                                    <button className="btn-back" onClick={() => setSelectedRecinto('TODOS')}>← Volver a Recintos</button>
                                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
                                        Mesas del Recinto
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 8 }}>
                                        {mesas.map(m => (
                                            <div key={m.codigo_mesa} className="mesa-chip" onClick={() => setSelectedMesa(m.codigo_mesa)}>
                                                <strong>Mesa {m.nro_mesa}</strong>
                                                <span>{m.cantidad_habilitada} hab.</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <button className="btn-back" onClick={() => setSelectedMesa('TODOS')}>← Volver a Mesas</button>
                                    <div style={{ fontFamily: 'JetBrains Mono', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 12 }}>
                                        Mesa #{selectedMesa} — Detalle Oficial
                                    </div>
                                    {mesaDetalle ? (
                                        <div className="mesa-detalle">
                                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 12, marginBottom: 16 }}>
                                                {[
                                                    { l: 'Estado', v: <span className="tag green">{mesaDetalle.estado}</span> },
                                                    { l: 'Habilitados', v: mesaDetalle.habilitados },
                                                    { l: 'Emitidos', v: mesaDetalle.votos_emitidos },
                                                    { l: 'Ausentismo', v: mesaDetalle.ausentismo },
                                                ].map(x => (
                                                    <div key={x.l}>
                                                        <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 5 }}>{x.l}</div>
                                                        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text)' }}>{x.v}</div>
                                                    </div>
                                                ))}
                                            </div>
                                            <div style={{ borderTop: '1px solid var(--rim)', paddingTop: 14 }}>
                                                <div style={{ fontFamily: 'JetBrains Mono', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--text-3)', marginBottom: 10 }}>Distribución de Votos</div>
                                                <div className="votos-grid">
                                                    {[
                                                        ['Daenerys Targaryen', mesaDetalle.p1],
                                                        ['Sansa Stark', mesaDetalle.p2],
                                                        ['Robert Baratheon', mesaDetalle.p3],
                                                        ['Tyrion Lannister', mesaDetalle.p4],
                                                        ['Votos Blancos', mesaDetalle.votos_blancos],
                                                        ['Votos Nulos', mesaDetalle.votos_nulos],
                                                    ].map(([n, v]) => (
                                                        <div key={n} className="voto-row">
                                                            <span>{n}</span>
                                                            <strong>{v}</strong>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="empty-state">Sin resultados consolidados para esta mesa</div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* ── GANADORES + HORARIOS ── */}
                <div className="layout-bottom">
                    <div className="card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, paddingBottom: 12, borderBottom: '1px solid var(--rim)' }}>
                            <h3 style={{ fontFamily: 'DM Serif Display', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: 10, margin: 0 }}>
                                <Trophy size={16} style={{ color: '#c9a84c' }} />
                                Partido Ganador por Territorio
                            </h3>
                            <select value={nivelGanador} onChange={(e) => setNivelGanador(e.target.value as any)} style={{ width: 'auto', background: 'var(--ink-3)', color: 'var(--text)', border: '1px solid var(--rim)', borderRadius: 8, padding: '6px 28px 6px 12px', fontSize: 12, fontFamily: 'JetBrains Mono', outline: 'none', appearance: 'none', backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%239ba3b4'/%3E%3C/svg%3E\")", backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' }}>
                                <option value="departamento">Por Departamento</option>
                                <option value="provincia">Por Provincia</option>
                                <option value="municipio">Por Municipio</option>
                                <option value="recinto">Por Recinto</option>
                            </select>
                        </div>
                        <div style={{ maxHeight: 380, overflowY: 'auto' }}>
                            <table>
                                <thead>
                                    <tr>
                                        <th>{nivelGanador.charAt(0).toUpperCase() + nivelGanador.slice(1)}</th>
                                        <th>Ganador</th>
                                        <th>Votos</th>
                                        <th>P1</th><th>P2</th><th>P3</th><th>P4</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {(ganadores?.data || []).map((g: any, i: number) => {
                                        const nombre = g.recinto_nombre || g.municipio || g.provincia || g.departamento;
                                        const c = colorPartido[g.partido_ganador] || '#64748b';
                                        return (
                                            <tr key={i}>
                                                <td><strong>{nombre}</strong></td>
                                                <td>
                                                    <span className="ganador-tag" style={{ background: `${c}18`, color: c, border: `1px solid ${c}30` }}>
                                                        🏆 {g.partido_ganador}
                                                    </span>
                                                </td>
                                                <td><strong style={{ fontFamily: 'JetBrains Mono', fontSize: 12 }}>{Number(g.votos_ganador).toLocaleString()}</strong></td>
                                                <td style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--text-3)' }}>{g.p1}</td>
                                                <td style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--text-3)' }}>{g.p2}</td>
                                                <td style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--text-3)' }}>{g.p3}</td>
                                                <td style={{ fontSize: 11, fontFamily: 'JetBrains Mono', color: 'var(--text-3)' }}>{g.p4}</td>
                                            </tr>
                                        );
                                    })}
                                    {(!ganadores?.data || ganadores.data.length === 0) && (
                                        <tr><td colSpan={7}><div className="empty-state">Sin actas aprobadas para calcular ganadores</div></td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="card-title"><Clock size={16} />Cierre de Mesas por Hora</h3>
                        {topHorarios.length > 0 ? (
                            <ResponsiveContainer width="100%" height={290}>
                                <BarChart data={topHorarios.map((h: any) => ({
                                    hora: `${h.hora}:00`,
                                    actas: Number(h.actas_cerradas),
                                    emitidos: Number(h.total_emitidos),
                                }))}>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.05)" />
                                    <XAxis dataKey="hora" axisLine={false} tickLine={false} tick={{ fill: '#5c6479', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                                    <YAxis axisLine={false} tickLine={false} tick={{ fill: '#5c6479', fontSize: 10, fontFamily: 'JetBrains Mono' }} />
                                    <Tooltip contentStyle={customTooltipStyle} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
                                    <Legend wrapperStyle={{ fontSize: 12, color: '#9ba3b4', fontFamily: 'DM Sans', paddingTop: 12 }} />
                                    <Bar dataKey="actas" fill="#4e9af1" name="Actas cerradas" radius={[4, 4, 0, 0]} />
                                    <Bar dataKey="emitidos" fill="#34d399" name="Votos emitidos" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <div className="empty-state">Aún no hay datos de cierre</div>
                        )}
                    </div>
                </div>

            </div>
        </>
    );
}

function BloqueKpi({ emitidos, validos, mesas, cuarentena, label1 = 'Votos Emitidos', label2 = 'Votos Válidos', label3 = 'Mesas Aprobadas', label4 = 'En Cuarentena' }: any) {
    return (
        <div className="bloque-kpi">
            <Mini label={label1} value={Number(emitidos || 0).toLocaleString()} color="#4e9af1" />
            <Mini label={label2} value={Number(validos || 0).toLocaleString()} color="#34d399" />
            <Mini label={label3} value={Number(mesas || 0).toLocaleString()} color="#7c5cbf" />
            <Mini label={label4} value={Number(cuarentena || 0).toLocaleString()} color="#f59e0b" />
        </div>
    );
}

function Mini({ label, value, color }: { label: string; value: any; color: string }) {
    return (
        <div className="mini-kpi" style={{ '--accent': color } as any}>
            <div className="mini-label">{label}</div>
            <div className="mini-value">{value}</div>
        </div>
    );
}