import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function UsageChart() {

  const data = {
    labels: ["05-May", "07-May", "09-May", "11-May", "13-May"],
    datasets: [
      {
        label: "Uso TB",
        data: [78, 79, 82, 79, 73],
        borderColor: "cyan",
        tension: 0.3
      }
    ]
  };

  return (

    <div className="bg-slate-800 p-4 rounded-xl">

      <Line data={data} />

    </div>

  );
}

export default UsageChart;