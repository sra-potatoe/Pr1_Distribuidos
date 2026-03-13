// DepartmentDetail.jsx
import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import { getCrecimiento, enviarComando } from "./services/api";

// ── Disk icon ──
const DiskIcon = ({ size = 64, inactive = false }) => (
  <svg width={size} height={size} viewBox="0 0 64 64" fill="none">
    <rect x="6" y="10" width="52" height="44" rx="7"
      stroke={inactive ? "#9ca3af" : "#1f2937"} strokeWidth="3" fill="none" />
    <line x1="6" y1="26" x2="58" y2="26"
      stroke={inactive ? "#9ca3af" : "#1f2937"} strokeWidth="2.5" />
    <line x1="6" y1="38" x2="58" y2="38"
      stroke={inactive ? "#9ca3af" : "#1f2937"} strokeWidth="2.5" />
    <circle cx="18" cy="18" r="3" fill={inactive ? "#d1d5db" : "#1f2937"} />
    <circle cx="18" cy="32" r="3" fill={inactive ? "#d1d5db" : "#1f2937"} />
    <circle cx="18" cy="46" r="3" fill={inactive ? "#d1d5db" : "#1f2937"} />
  </svg>
);

// ── Storage bar (acepta valores numéricos _capacidad/_usado) ──
const StorageBar = ({ total, used }) => {
  const pct = total > 0 ? Math.min((used / total) * 100, 100) : 0;
  const color = pct > 85 ? "#ef4444" : pct > 60 ? "#f59e0b" : "#22c55e";
  return (
    <div style={{ height: 10, backgroundColor: "#e5e7eb", borderRadius: 99, overflow: "hidden" }}>
      <div style={{
        width: `${pct}%`, height: "100%", backgroundColor: color,
        borderRadius: 99, transition: "width 0.6s ease",
      }} />
    </div>
  );
};

// ── Custom tooltip ──
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: "#fff", border: "1px solid #e5e7eb", borderRadius: 8,
        padding: "8px 14px", fontSize: 13, boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
      }}>
        <div style={{ color: "#6b7280", marginBottom: 2 }}>{label}</div>
        <div style={{ fontWeight: 700, color: "#1a6b3a" }}>{payload[0].value} GB</div>
      </div>
    );
  }
  return null;
};

// ── Formatea fecha ISO → "13-Mar-26" ──
const fmtFecha = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("es-BO", { day: "2-digit", month: "short", year: "2-digit" });
};

// ── Fallback de historial simulado si el backend no lo devuelve ──
const generarHistorialFallback = (usadoActual) => {
  const base = usadoActual || 50;
  return Array.from({ length: 15 }, (_, i) => ({
    fecha: fmtFecha(new Date(Date.now() - (14 - i) * 86400000).toISOString()),
    uso: parseFloat((base * (0.9 + Math.random() * 0.2)).toFixed(1)),
  }));
};

// ══════════════════════════════════════════════
//  MAIN COMPONENT
// ══════════════════════════════════════════════
const DepartmentDetail = ({ department, onClose }) => {
  const [visible, setVisible] = useState(false);
  const [crecimiento, setCrecimiento] = useState(null);
  const [comandoStatus, setComandoStatus] = useState(null);
  const [enviando, setEnviando] = useState(false);

  useEffect(() => {
    if (department) {
      document.body.style.overflow = "hidden";
      setTimeout(() => setVisible(true), 10);

      // Carga tasa de crecimiento
      getCrecimiento(department.id)
        .then(setCrecimiento)
        .catch(() => setCrecimiento(null));
    } else {
      document.body.style.overflow = "";
      setVisible(false);
    }
    return () => { document.body.style.overflow = ""; };
  }, [department]);

  if (!department) return null;

  const {
    id,
    name = "Nodo",
    total = "—",
    used = "—",
    libre = "—",
    ram,
    noReporta = false,
    _capacidad = 0,
    _usado = 0,
    history,
  } = department;

  // Historial: usa datos reales si existen, si no genera fallback
  const historialFinal = history?.length
    ? history.map((h) => ({
        fecha: fmtFecha(h.timestamp || h.fecha),
        uso: parseFloat((h.espacio_usado ?? h.uso ?? 0).toFixed(1)),
      }))
    : generarHistorialFallback(_usado);

  const tableRows = historialFinal.slice(-8);

  const handleClose = () => {
    setVisible(false);
    setTimeout(onClose, 240);
  };

  const handleComando = async (cmd) => {
    setEnviando(true);
    setComandoStatus(null);
    try {
      const resp = await enviarComando(id, cmd);
      setComandoStatus({ ok: true, msg: resp.msg || "Comando enviado" });
    } catch (e) {
      setComandoStatus({ ok: false, msg: e.message });
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      style={{
        position: "fixed", inset: 0,
        backgroundColor: `rgba(0,0,0,${visible ? 0.5 : 0})`,
        display: "flex", alignItems: "center", justifyContent: "center",
        zIndex: 9999, transition: "background-color 0.24s ease",
        padding: "16px", boxSizing: "border-box",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: "#fff", borderRadius: 14,
          width: "100%", maxWidth: 1200,
          maxHeight: "calc(100vh - 32px)",
          display: "flex", flexDirection: "column",
          boxShadow: "0 20px 60px rgba(0,0,0,0.25)",
          fontFamily: "'Segoe UI', Arial, sans-serif",
          overflow: "hidden",
          transform: visible ? "translateY(0) scale(1)" : "translateY(20px) scale(0.97)",
          opacity: visible ? 1 : 0,
          transition: "transform 0.26s cubic-bezier(.22,.9,.36,1), opacity 0.22s ease",
        }}
      >
        {/* ── HEADER ── */}
        <div style={{
          background: "#1a6b3a", padding: "12px 20px",
          display: "flex", alignItems: "center", gap: 12, flexShrink: 0,
        }}>
          <div style={{
            width: 44, height: 44, borderRadius: "50%",
            border: "2px solid rgba(255,255,255,0.6)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backgroundColor: "rgba(255,255,255,0.1)", flexShrink: 0,
          }}>
            <span style={{ color: "#fff", fontWeight: 900, fontSize: 12, letterSpacing: "-0.5px" }}>CNS</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 15, fontWeight: 800, color: "#fff" }}>
              Monitor nacional de almacenamiento
            </div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.75)", marginTop: 2 }}>
              Total: {total} · Usado: {used} · Libre: {libre}
              {crecimiento?.crecimiento_gb_por_hora !== undefined && (
                <> · Crecimiento: {crecimiento.crecimiento_gb_por_hora >= 0 ? "+" : ""}{crecimiento.crecimiento_gb_por_hora.toFixed(2)} GB/h</>
              )}
            </div>
          </div>
          <button
            onClick={handleClose}
            style={{
              flexShrink: 0, background: "rgba(255,255,255,0.15)",
              border: "none", borderRadius: 8,
              color: "#fff", fontSize: 22, width: 34, height: 34,
              cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.28)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.15)")}
          >
            ×
          </button>
        </div>

        {/* ── BODY ── */}
        <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>

          {/* LEFT — server info + comandos */}
          <div style={{
            width: 200, flexShrink: 0,
            borderRight: "1px solid #e5e7eb",
            padding: "24px 16px",
            display: "flex", flexDirection: "column", alignItems: "center",
            gap: 5, background: "#fafafa", overflowY: "auto",
          }}>
            <DiskIcon size={68} inactive={noReporta} />
            <div style={{
              fontSize: 17, fontWeight: 800, marginTop: 6, textAlign: "center",
              color: noReporta ? "#ef4444" : "#111827",
            }}>
              {name}
            </div>

            {noReporta ? (
              <div style={{ color: "#ef4444", fontSize: 12, textAlign: "center", marginTop: 6 }}>
                No hay informes
              </div>
            ) : (
              <>
                <div style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>{total}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b" }}>Uso: {used}</div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#22c55e" }}>{libre} Libre</div>
                {ram && <div style={{ fontSize: 12, color: "#6b7280", marginTop: 6 }}>{ram}</div>}
                <div style={{ width: "100%", marginTop: 10 }}>
                  <StorageBar total={_capacidad} used={_usado} />
                </div>
              </>
            )}

            {/* ── Comandos TCP ── */}
            <div style={{ width: "100%", marginTop: 16, borderTop: "1px solid #e5e7eb", paddingTop: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#6b7280", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Comandos
              </div>
              {["status", "restart", "cleanup"].map((cmd) => (
                <button
                  key={cmd}
                  disabled={enviando}
                  onClick={() => handleComando(cmd)}
                  style={{
                    width: "100%", marginBottom: 6,
                    padding: "7px 0",
                    background: enviando ? "#e5e7eb" : "#1a6b3a",
                    color: enviando ? "#9ca3af" : "#fff",
                    border: "none", borderRadius: 7, fontSize: 12,
                    fontWeight: 600, cursor: enviando ? "default" : "pointer",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) => { if (!enviando) e.currentTarget.style.background = "#15572f"; }}
                  onMouseLeave={(e) => { if (!enviando) e.currentTarget.style.background = "#1a6b3a"; }}
                >
                  {cmd}
                </button>
              ))}
              {comandoStatus && (
                <div style={{
                  marginTop: 6, fontSize: 11, padding: "6px 8px", borderRadius: 6,
                  background: comandoStatus.ok ? "#f0fdf4" : "#fef2f2",
                  color: comandoStatus.ok ? "#15803d" : "#dc2626",
                  border: `1px solid ${comandoStatus.ok ? "#bbf7d0" : "#fecaca"}`,
                }}>
                  {comandoStatus.msg}
                </div>
              )}
            </div>
          </div>

          {/* CENTER — tabla historial */}
          <div style={{ width: 220, flexShrink: 0, borderRight: "1px solid #e5e7eb", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr style={{ background: "#f9fafb", borderBottom: "2px solid #e5e7eb" }}>
                  <th style={{ padding: "11px 16px", textAlign: "left", fontWeight: 600, color: "#374151" }}>
                    Fecha
                  </th>
                  <th style={{ padding: "11px 16px", textAlign: "right", fontWeight: 600, color: "#374151" }}>
                    Uso (GB)
                  </th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row, i) => (
                  <tr key={i} style={{
                    borderBottom: "1px solid #f3f4f6",
                    background: i % 2 === 0 ? "#fff" : "#fafafa",
                  }}>
                    <td style={{ padding: "10px 16px", color: "#374151" }}>{row.fecha}</td>
                    <td style={{ padding: "10px 16px", textAlign: "right", fontWeight: 700, color: "#111827" }}>
                      {row.uso}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* RIGHT — gráfico */}
          <div style={{ flex: 1, padding: "16px 16px 8px 12px", minWidth: 0, display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 12, color: "#6b7280", marginBottom: 6, fontWeight: 600 }}>
              Uso de disco (GB) — últimos 15 días
            </div>
            <div style={{ flex: 1, minHeight: 0 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={historialFinal} margin={{ top: 6, right: 10, left: -18, bottom: 40 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis
                    dataKey="fecha"
                    tick={{ fontSize: 9, fill: "#9ca3af" }}
                    angle={-45}
                    textAnchor="end"
                    interval={0}
                    height={52}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: "#9ca3af" }}
                    tickCount={5}
                    width={42}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="uso"
                    stroke="#1a6b3a"
                    strokeWidth={2.5}
                    dot={false}
                    activeDot={{ r: 5, fill: "#1a6b3a", strokeWidth: 0 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetail;