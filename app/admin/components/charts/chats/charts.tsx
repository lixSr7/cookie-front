"use client";
import { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

export const LineChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const chartInstance = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels: [
            "2023-06-01",
            "2023-06-02",
            "2023-06-03",
            "2023-06-04",
            "2023-06-05",
          ],
          datasets: [
            {
              label: "Mensajes Enviados",
              data: [50, 100, 75, 125, 90],
              borderColor: "rgba(75, 192, 192, 1)",
              fill: false,
            },
          ],
        },
        options: {
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, []);

  return <canvas ref={chartRef} />;
};

export const PieChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const chartInstance = new Chart(chartRef.current, {
        type: "pie",
        data: {
          labels: ["Usuario1", "Usuario2", "Usuario3", "Usuario4"],
          datasets: [
            {
              data: [300, 50, 100, 150],
              backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
              hoverBackgroundColor: [
                "#FF6384",
                "#36A2EB",
                "#FFCE56",
                "#4BC0C0",
              ],
            },
          ],
        },
        options: {
          responsive: true,
        },
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, []);

  return <canvas ref={chartRef} />;
};

export const RadarChart = () => {
  const chartRef = useRef(null);

  useEffect(() => {
    if (chartRef && chartRef.current) {
      const chartInstance = new Chart(chartRef.current, {
        type: "radar",
        data: {
          labels: [
            "Mensajes Enviados",
            "Mensajes Recibidos",
            "Archivos Enviados",
            "Reacciones",
          ],
          datasets: [
            {
              label: "Usuario1",
              data: [65, 59, 90, 81],
              backgroundColor: "rgba(179,181,198,0.2)",
              borderColor: "rgba(179,181,198,1)",
              pointBackgroundColor: "rgba(179,181,198,1)",
            },
            {
              label: "Usuario2",
              data: [28, 48, 40, 19],
              backgroundColor: "rgba(255,99,132,0.2)",
              borderColor: "rgba(255,99,132,1)",
              pointBackgroundColor: "rgba(255,99,132,1)",
            },
          ],
        },
        options: {
          responsive: true,
          scales: {
            r: {
              beginAtZero: true,
            },
          },
        },
      });

      return () => {
        chartInstance.destroy();
      };
    }
  }, []);

  return <canvas ref={chartRef} />;
};
