"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export const GenderPieChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const chartInstance = new Chart(chartRef.current, {
        type: "pie",
        data: {
          labels: ["Hombres", "Mujeres", "Otros"],
          datasets: [
            {
              data: [3000, 4500, 500],
              backgroundColor: [
                "rgba(54, 162, 235, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 206, 86, 0.2)",
              ],
              borderColor: [
                "rgba(54, 162, 235, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(255, 206, 86, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, []);

  return <canvas ref={chartRef} />;
};
export const CategoryPieChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const chartInstance = new Chart(chartRef.current, {
        type: "pie",
        data: {
          labels: ["Tecnología", "Deportes", "Música", "Cine", "Arte"],
          datasets: [
            {
              data: [120, 200, 150, 80, 50],
              backgroundColor: [
                "rgba(153, 102, 255, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 99, 132, 0.2)",
                "rgba(54, 162, 235, 0.2)",
              ],
              borderColor: [
                "rgba(153, 102, 255, 1)",
                "rgba(75, 192, 192, 1)",
                "rgba(255, 159, 64, 1)",
                "rgba(255, 99, 132, 1)",
                "rgba(54, 162, 235, 1)",
              ],
              borderWidth: 1,
            },
          ],
        },
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, []);

  return <canvas ref={chartRef} />;
};
