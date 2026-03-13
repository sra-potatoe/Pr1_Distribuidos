// CnsIcon.jsx
const CnsIcon = ({ size = 60 }) => (
  <svg width={size} height={size} viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="30" fill="#1a6b3a" />
    <text x="10" y="26" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="16" fill="white">C</text>
    <text x="26" y="26" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="16" fill="white">N</text>
    <line x1="8" y1="30" x2="52" y2="30" stroke="white" strokeWidth="1.5" />
    <text x="18" y="46" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize="16" fill="white">S</text>
  </svg>
);

export default CnsIcon;