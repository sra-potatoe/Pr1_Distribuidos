// StorageBar.jsx
const getBarColor = (usedPercent) => {
  if (usedPercent < 50) return "#22c55e";   // verde
  if (usedPercent < 80) return "#f59e0b";   // naranja
  return "#ef4444";                          // rojo
};

const StorageBar = ({ total, used, libre }) => {
  // Calculamos porcentaje usado
  const parseGB = (str) => {
    if (!str) return 0;
    const num = parseFloat(str);
    if (str.includes("TB")) return num * 1000;
    return num;
  };

  const totalGB = parseGB(total);
  const usedGB = parseGB(used);
  const percent = totalGB > 0 ? Math.min((usedGB / totalGB) * 100, 100) : 0;
  const color = getBarColor(percent);

  return (
    <div style={{ width: "100%", marginTop: 8 }}>
      <div
        style={{
          width: "100%",
          height: 12,
          backgroundColor: "#e5e7eb",
          borderRadius: 6,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${percent}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: 6,
            transition: "width 0.4s ease",
          }}
        />
      </div>
    </div>
  );
};

export default StorageBar;