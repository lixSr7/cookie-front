import React, { useEffect, useRef } from "react";
import Chart, { ChartConfiguration } from "chart.js/auto";
import { Card } from "@nextui-org/react";

interface ChartProps {
  data: ChartConfiguration["data"];
  type: ChartConfiguration["type"];
  options?: ChartConfiguration["options"];
}

const ChartComponent: React.FC<ChartProps> = ({ data, type, options }) => {
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (chartRef.current) {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
      const ctx = chartRef.current.getContext("2d");
      if (ctx) {
        chartInstance.current = new Chart(ctx, {
          type: type,
          data: data,
          options: options,
        });
      }
    }

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, type, options]);

  return <canvas ref={chartRef} />;
};

export default function DashboardChats() {
  const userData = {
    labels: ["User 1", "User 2", "User 3", "User 4", "User 5"],
    datasets: [
      {
        label: "Mensajes por usuario",
        data: [120, 180, 90, 200, 150],
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const trendData = {
    labels: ["June 1", "June 2", "June 3", "June 4", "June 5"],
    datasets: [
      {
        label: "Tendencia general de mensajes",
        data: [50, 60, 70, 65, 80],
        fill: false,
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 2,
        tension: 0.1,
      },
    ],
  };

  const pieData = {
    labels: ["User 1", "User 2", "User 3", "User 4", "User 5"],
    datasets: [
      {
        label: "Porcentaje de mensajes por usuario",
        data: [20, 25, 15, 30, 10],
        backgroundColor: [
          "#ff6384",
          "#36a2eb",
          "#cc65fe",
          "#ffce56",
          "#65fc92",
        ],
        borderWidth: 1,
      },
    ],
  };

  const stackedData = {
    labels: ["June 1", "June 2", "June 3", "June 4", "June 5"],
    datasets: [
      {
        label: "Mensajes por fecha",
        data: [30, 50, 40, 70, 60],
        backgroundColor: "rgba(255, 206, 86, 0.5)",
        borderColor: "rgba(255, 206, 86, 1)",
        borderWidth: 1,
      },
      {
        label: "Otros datos",
        data: [20, 30, 40, 50, 60],
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <section>
      {/* Gráfico de barras */}
      <ChartComponent data={stackedData} type="line" />
    </section>
  );
}
