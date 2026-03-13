// PieChart.jsx
const PieChart = ({ usedPercent = 78, size = 64 }) => {
  const r = 24;
  const cx = 32;
  const cy = 32;
  const circumference = 2 * Math.PI * r;
  const offset = circumference * (1 - usedPercent / 100);

  return (
    <svg width={size} height={size} viewBox="0 0 64 64" style={{ transform: "rotate(-90deg)" }}>
      {/* Fondo gris */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#d1d5db"
        strokeWidth="12"
      />
      {/* Arco verde (usado) */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="#22c55e"
        strokeWidth="12"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="butt"
      />
    </svg>
  );
};

export default PieChart;