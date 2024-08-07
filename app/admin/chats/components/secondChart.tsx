"use client";

import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

import { getAllChatsForCharts } from "./request";

const PieChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart<"pie", number[], string> | null>(null);
  const [chartData, setChartData] = useState<{
    labels: string[];
    data: number[];
    backgroundColor: string[];
    borderColor: string[];
    borderWidth: number;
  }>({
    labels: [],
    data: [],
    backgroundColor: [],
    borderColor: [],
    borderWidth: 1,
  });

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");

        return;
      }

      try {
        const data = await getAllChatsForCharts(token);

        // Verificar si se recibieron los datos esperados
        if (!data || !data.chats) {
          console.error("Error: No data received or missing chats");

          return;
        }

        // Contar la cantidad de chats
        const totalChats = data.totalChats;

        // Crear un array con el número de mensajes por chat
        const messageCounts = data.chats.map(
          (chat: any) => chat.messages.length,
        );

        // Calcular el total de mensajes sumando los mensajes de todos los chats
        const totalMessages = messageCounts.reduce(
          (acc: number, count: number) => acc + count,
          0,
        );

        setChartData({
          labels: ["Chats", "Mensajes"],
          data: [totalChats, totalMessages],
          backgroundColor: [
            "rgba(75, 192, 192, 0.2)",
            "rgba(255, 99, 132, 0.2)",
          ],
          borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
          borderWidth: 1,
        });
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (chartRef.current && chartData.labels.length > 0) {
      const ctx = chartRef.current.getContext("2d");

      if (ctx) {
        if (chartInstance.current) {
          chartInstance.current.destroy();
        }
        chartInstance.current = new Chart(ctx, {
          type: "pie",
          data: {
            labels: chartData.labels,
            datasets: [
              {
                data: chartData.data,
                backgroundColor: chartData.backgroundColor,
                borderColor: chartData.borderColor,
                borderWidth: chartData.borderWidth,
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Distribución de Chats y Mensajes",
              },
            },
          },
        });
      }
    }
  }, [chartData]);

  return <canvas ref={chartRef} />;
};

export default PieChart;
