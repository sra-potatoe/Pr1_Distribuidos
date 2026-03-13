import ClusterGauge from "./ClusterGauge";

function HeaderCluster({ nodos = [] }) {

  if (!nodos || nodos.length === 0) {
    return (
      <div className="text-white mb-4">
        Esperando datos del cluster...
      </div>
    );
  }

  const totalCapacidad = nodos.reduce(
    (acc, nodo) => acc + nodo.capacidad_total,
    0
  );

  const totalUsado = nodos.reduce(
    (acc, nodo) => acc + nodo.espacio_usado,
    0
  );

  const totalLibre = nodos.reduce(
    (acc, nodo) => acc + nodo.espacio_libre,
    0
  );

  const porcentaje = totalCapacidad > 0
    ? (totalUsado / totalCapacidad) * 100
    : 0;

  const activos = nodos.length;

  return (
    <div className="bg-gray-900 p-6 rounded-xl mb-6">

      <div className="flex items-center justify-between">

        <div>

          <h2 className="text-xl text-white font-bold mb-2">
            Estado del Cluster
          </h2>

          <p className="text-gray-400">
            Nodos activos: <span className="text-white">{activos}</span>
          </p>

          <p className="text-gray-400">
            Capacidad total: <span className="text-white">{totalCapacidad} GB</span>
          </p>

          <p className="text-gray-400">
            Espacio libre: <span className="text-white">{totalLibre} GB</span>
          </p>

        </div>

        <ClusterGauge porcentaje={porcentaje} />

      </div>

    </div>
  );
}

export default HeaderCluster;