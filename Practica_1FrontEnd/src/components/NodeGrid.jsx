import NodeCard from "./NodeCard";

function NodeGrid({ nodos }) {

  if (!nodos || nodos.length === 0) {
    return (
      <div className="text-gray-400">
        No hay nodos reportando todavía...
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
      {nodos.map((nodo) => (
        <NodeCard key={nodo._id} nodo={nodo} />
      ))}
    </div>
  );
}

export default NodeGrid;