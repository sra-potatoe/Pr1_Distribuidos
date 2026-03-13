import { useEffect, useState } from "react";
import NodeGrid from "../components/NodeGrid";
import HeaderCluster from "../components/HeaderCluster";
import { getNodos } from "../services/api";

function Dashboard() {

  const [nodos, setNodos] = useState([]);

  const cargarDatos = async () => {
    const data = await getNodos();
    setNodos(data);
  };

  useEffect(() => {

    cargarDatos();

    const intervalo = setInterval(cargarDatos, 5000);

    return () => clearInterval(intervalo);

  }, []);

  return (
    <div className="min-h-screen bg-gray-950 p-8">

        <HeaderCluster nodos={nodos} />

        <NodeGrid nodos={nodos} />

    </div>
    );
}

export default Dashboard;