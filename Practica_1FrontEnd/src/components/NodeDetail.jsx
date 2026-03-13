import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UsageChart from "./UsageChart";
import { getNodos } from "../services/api";

function NodeDetail() {

  const { id } = useParams();
  const [nodo, setNodo] = useState(null);

  useEffect(() => {

    const cargarNodo = async () => {

      const nodos = await getNodos();

      const encontrado = nodos.find(
        n => n.id_regional === id
      );

      setNodo(encontrado);

    };

    cargarNodo();

  }, [id]);

  if (!nodo) {
    return (
      <div className="text-white p-6">
        Cargando nodo...
      </div>
    );
  }

  return (

    <div className="p-8 bg-gray-950 min-h-screen text-white">

      <h1 className="text-3xl font-bold mb-6">
        Nodo: {nodo.id_regional}
      </h1>

      <div className="grid grid-cols-3 gap-6">

        <div className="bg-slate-800 p-4 rounded-xl">

          <h2 className="text-xl font-bold mb-2">
            Información
          </h2>

          <p>Capacidad: {nodo.capacidad_total} GB</p>
          <p>Usado: {nodo.espacio_usado} GB</p>
          <p>Libre: {nodo.espacio_libre} GB</p>

        </div>

        <div className="bg-slate-800 p-4 rounded-xl">

          <h3 className="font-bold mb-2">Historial</h3>

          <table className="w-full text-sm">

            <thead>
              <tr>
                <th>Fecha</th>
                <th>Uso</th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td>05-May</td>
                <td>78%</td>
              </tr>
              <tr>
                <td>07-May</td>
                <td>80%</td>
              </tr>
              <tr>
                <td>09-May</td>
                <td>82%</td>
              </tr>
            </tbody>

          </table>

        </div>

        <UsageChart />

      </div>

    </div>

  );
}

export default NodeDetail;