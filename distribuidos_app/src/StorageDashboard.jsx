// StorageDashboard.jsx
import { useState, useEffect } from "react";
import CnsIcon from "./CnsIcon";
import PieChart from "./PieChart";
import DepartmentCard from "./DepartmentCard";
import DepartmentDetail from "./DepartmentDetail";
import logo from "./assets/logo_nacional.png";
import { getNodos, getCluster } from "./services/api";

// ── Mapeo id_regional → nombre legible ───────────────────────────────────────
const NOMBRE_REGIONAL = {
  oruro: "Oruro",
  lapaz: "La Paz",
  santacruz: "Santa Cruz",
  beni: "Beni",
  tarija: "Tarija",
  pando: "Pando",
  cochabamba: "Cochabamba",
  chuquisaca: "Chuquisaca",
  potosi: "Potosí",
};

// ── Formatea bytes a GB / TB legible ─────────────────────────────────────────
const fmt = (gb) => {
  if (gb === undefined || gb === null) return "—";
  if (gb >= 1024) return `${(gb / 1024).toFixed(2)} TB`;
  return `${gb.toFixed(1)} GB`;
};

// ── Transforma un reporte de la API al formato que esperan los componentes ────
const transformarNodo = (reporte) => ({
  id: reporte.id_regional,
  name: NOMBRE_REGIONAL[reporte.id_regional] || reporte.id_regional,
  total: fmt(reporte.capacidad_total),
  used: fmt(reporte.espacio_usado),
  libre: fmt(reporte.espacio_libre),
  ram: reporte.ram ? `${reporte.ram} GB de RAM` : undefined,
  noReporta: reporte.estado !== "Activo",
  // Preservamos los valores numéricos para la barra de progreso
  _capacidad: reporte.capacidad_total,
  _usado: reporte.espacio_usado,
  _libre: reporte.espacio_libre,
  // Historial si el backend lo devuelve, si no se genera en DepartmentDetail
  history: reporte.history ?? null,
});

// ─── Dashboard principal ──────────────────────────────────────────────────────
const StorageDashboard = () => {
  const [selected, setSelected] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [global, setGlobal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Carga inicial y refresco cada 30 s
  useEffect(() => {
    let cancelled = false;

    const cargar = async () => {
      try {
        const [nodos, cluster] = await Promise.all([getNodos(), getCluster()]);
        if (cancelled) return;

        setDepartments(nodos.map(transformarNodo));
        setGlobal(cluster);
        setError(null);
      } catch (err) {
        if (!cancelled) setError(err.message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    cargar();
    const interval = setInterval(cargar, 30_000);
    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, []);

  // Mantener selected sincronizado si los datos se refrescan
  useEffect(() => {
    if (selected && departments.length) {
      const actualizado = departments.find((d) => d.id === selected.id);
      if (actualizado) setSelected(actualizado);
    }
  }, [departments]);

  const GLOBAL = global
    ? {
        total: fmt(global.capacidad_total),
        used: fmt(global.espacio_usado),
        libre: fmt(global.espacio_libre),
        discos: global.total_nodos ?? 9,
        reportados: global.nodos_activos ?? 0,
        totalNodos: global.total_nodos ?? 9,
        usedPercent: Math.round(global.utilizacion_global ?? 0),
      }
    : null;

  return (
    <div
      style={{
        fontFamily: "'Segoe UI', Arial, sans-serif",
        backgroundColor: "#f3f4f6",
        minHeight: "100vh",
        padding: 24,
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: "16px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 20,
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        }}
      >
        {/* Logo + título */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <img
            src={logo}
            alt="Logo CNS"
            style={{ height: 56, width: "auto", objectFit: "contain" }}
          />
          <div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#111827", lineHeight: 1.2 }}>
              Monitor nacional de almacenamiento
            </div>
            {loading ? (
              <div style={{ fontSize: 13, color: "#9ca3af", marginTop: 4 }}>Cargando datos…</div>
            ) : error ? (
              <div style={{ fontSize: 13, color: "#ef4444", marginTop: 4 }}>
                Error al conectar: {error}
              </div>
            ) : GLOBAL ? (
              <>
                <div style={{ fontSize: 13, color: "#374151", marginTop: 4 }}>
                  <b>Total:</b> {GLOBAL.total} &nbsp;·&nbsp;
                  <b>Usado:</b> {GLOBAL.used} &nbsp;·&nbsp;
                  <b>Libre:</b> {GLOBAL.libre}
                </div>
                <div style={{ fontSize: 12, color: "#6b7280", marginTop: 2 }}>
                  Reportaron {GLOBAL.reportados} de {GLOBAL.totalNodos}
                </div>
              </>
            ) : null}
          </div>
        </div>

        {/* Pie chart + resumen */}
        {GLOBAL && (
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#111827" }}>
                {GLOBAL.discos} Discos
              </div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#1a6b3a" }}>
                {GLOBAL.usedPercent} %
              </div>
            </div>
            <PieChart usedPercent={GLOBAL.usedPercent} size={68} />
          </div>
        )}
      </div>

      {/* ── Grid de departamentos ── */}
      <div
        style={{
          backgroundColor: "white",
          borderRadius: 12,
          padding: 20,
          boxShadow: "0 1px 6px rgba(0,0,0,0.08)",
        }}
      >
        {loading ? (
          <div style={{ color: "#9ca3af", padding: 24, textAlign: "center" }}>
            Cargando nodos…
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              justifyContent: "flex-start",
            }}
          >
            {departments.map((dept) => (
              <DepartmentCard
                key={dept.id}
                department={dept}
                onClick={setSelected}
                selected={selected?.id === dept.id}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Modal de detalle ── */}
      {selected && (
        <DepartmentDetail
          department={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  );
};

export default StorageDashboard;