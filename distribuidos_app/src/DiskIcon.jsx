// DiskIcon.jsx
const DiskIcon = ({ inactive = false, size = 64 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 64 64"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
  >
    {/* Cuerpo principal del disco/servidor */}
    <rect
      x="8"
      y="14"
      width="48"
      height="36"
      rx="4"
      ry="4"
      stroke={inactive ? "#ccc" : "#333"}
      strokeWidth="3"
      fill="white"
    />
    {/* Ranura superior */}
    <rect
      x="8"
      y="14"
      width="48"
      height="10"
      rx="4"
      ry="4"
      stroke={inactive ? "#ccc" : "#333"}
      strokeWidth="3"
      fill={inactive ? "#eee" : "#f0f0f0"}
    />
    {/* Botón/led izquierdo */}
    <circle
      cx="18"
      cy="19"
      r="2.5"
      fill={inactive ? "#ccc" : "#555"}
    />
    {/* Ranura de disco */}
    <rect
      x="26"
      y="17"
      width="22"
      height="4"
      rx="2"
      fill={inactive ? "#ddd" : "#bbb"}
    />
    {/* Línea inferior del cuerpo */}
    <line
      x1="8"
      y1="40"
      x2="56"
      y2="40"
      stroke={inactive ? "#ccc" : "#333"}
      strokeWidth="2"
    />
    {/* Pie izquierdo */}
    <rect
      x="14"
      y="50"
      width="10"
      height="5"
      rx="2"
      fill={inactive ? "#ccc" : "#333"}
    />
    {/* Pie derecho */}
    <rect
      x="40"
      y="50"
      width="10"
      height="5"
      rx="2"
      fill={inactive ? "#ccc" : "#333"}
    />
  </svg>
);

export default DiskIcon;