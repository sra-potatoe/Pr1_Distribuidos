import { useNavigate } from "react-router-dom";

function NodeCard({ nodo }) {

  const navigate = useNavigate();

  const porcentaje = nodo.capacidad_total > 0
    ? (nodo.espacio_usado / nodo.capacidad_total) * 100
    : 0;

  let colorBarra = "bg-green-500";

  if (porcentaje > 90) {
    colorBarra = "bg-red-500";
  } else if (porcentaje > 70) {
    colorBarra = "bg-yellow-500";
  }

  const estado = nodo.estado === "Activo" ? "🟢 Activo" : "🔴 Caído";

  return (

    <div
      onClick={() => navigate(`/nodo/${nodo.id_regional}`)}
      className="bg-gray-800 p-4 rounded-xl shadow hover:scale-105 transition cursor-pointer"
    >

      <div className="flex justify-between items-center">

        <h3 className="text-white font-bold">
          {nodo.id_regional}
        </h3>

        <span className="text-sm text-gray-300">
          {estado}
        </span>

      </div>

      <p className="text-gray-400 mt-1">
        Capacidad: {nodo.capacidad_total} GB
      </p>

      <div className="w-full bg-gray-700 rounded-full h-2 mt-3">

        <div
          className={`${colorBarra} h-2 rounded-full`}
          style={{ width: `${porcentaje}%` }}
        />

      </div>

      <p className="text-right text-gray-300 mt-1 text-sm">
        {porcentaje.toFixed(1)}%
      </p>

    </div>

  );
}

export default NodeCard;