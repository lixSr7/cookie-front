"use client";
// components/TopUsersChart.tsx
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { FC } from "react";

// Registra los componentes necesarios para el gráfico
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const TopUsersChart: FC = () => {
  // Datos quemados del top 3 de usuarios con más posts
  const data = {
    labels: ["The best", "luigi__21__plus", "leonardo1"], // Nombres de los usuarios
    datasets: [
      {
        label: "Número de Posts",
        data: [50, 40, 30], // Cantidad de posts de cada usuario
        backgroundColor: ["#3498db", "#2ecc71", "#e74c3c"], // Colores de las barras
        borderColor: ["#2980b9", "#27ae60", "#c0392b"],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Top 3 Usuarios con más Posts",
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default TopUsersChart;
