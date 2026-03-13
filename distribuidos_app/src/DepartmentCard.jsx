// DepartmentCard.jsx
import DiskIcon from "./DiskIcon";
import StorageBar from "./StorageBar";

function DepartmentCard ({ department, onClick, selected })
 {
  const { name, total, used, libre, noReporta } = department;

  return (
    <div
      onClick={() => onClick(department)}
      style={{
        width: 160,
        minHeight: 200,
        border: selected ? "2px solid #1a6b3a" : "1.5px solid #d1d5db",
        borderRadius: 12,
        backgroundColor: selected ? "#f0fdf4" : "white",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "16px 12px 12px",
        cursor: "pointer",
        boxShadow: selected
          ? "0 0 0 3px rgba(26,107,58,0.15)"
          : "0 1px 4px rgba(0,0,0,0.07)",
        transition: "all 0.2s ease",
        userSelect: "none",
        boxSizing: "border-box",
      }}
      onMouseEnter={(e) => {
        if (!selected) e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.12)";
      }}
      onMouseLeave={(e) => {
        if (!selected) e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.07)";
      }}
    >
      {/* Icono de disco */}
      <DiskIcon inactive={noReporta} size={60} />

      {/* Nombre del departamento */}
      <div
        style={{
          fontFamily: "'Segoe UI', Arial, sans-serif",
          fontWeight: 700,
          fontSize: 15,
          color: noReporta ? "#ef4444" : "#111827",
          marginTop: 8,
          textAlign: "center",
        }}
      >
        {name}
      </div>

      {noReporta ? (
        <div
          style={{
            fontFamily: "'Segoe UI', Arial, sans-serif",
            fontSize: 13,
            color: "#ef4444",
            fontWeight: 600,
            marginTop: 4,
          }}
        >
          No reporta
        </div>
      ) : (
        <div style={{ width: "100%", marginTop: 4 }}>
          <div
            style={{
              fontFamily: "'Segoe UI', Arial, sans-serif",
              fontSize: 12,
              color: "#374151",
              textAlign: "center",
              lineHeight: 1.7,
            }}
          >
            {total}
            <br />
            {used} Uso
            <br />
            {libre} Libre
          </div>
          <StorageBar total={total} used={used} libre={libre} />
        </div>
      )}
    </div>
  );
};

export default DepartmentCard;  