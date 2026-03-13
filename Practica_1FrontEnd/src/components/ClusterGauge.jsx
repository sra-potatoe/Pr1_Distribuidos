import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip
} from "chart.js";

ChartJS.register(ArcElement, Tooltip);

function ClusterGauge({ porcentaje }) {

  const valor = Number(porcentaje);

  const data = {
    datasets: [
      {
        data: [valor, 100 - valor],
        backgroundColor: ["#22c55e", "#1f2937"],
        borderWidth: 0
      }
    ]
  };

  const options = {
    cutout: "70%",
    plugins: {
      legend: {
        display: false
      }
    }
  };

  return (

    <div className="relative w-24 h-24">

      <Doughnut data={data} options={options} />

      <div className="absolute inset-0 flex items-center justify-center text-white font-bold">
        {valor.toFixed(1)}%
      </div>

    </div>

  );
}

export default ClusterGauge;