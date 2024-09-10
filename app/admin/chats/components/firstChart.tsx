"use client";

import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

import { getAllChatsForCharts } from "./request";

interface ChatData {
  _id: string;
  createdAt: string;
  messages: { createdAt: string }[];
}

export const ChatsLineChart: React.FC = () => {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [chartData, setChartData] = useState<{
    labels: string[];
    datasets: {
      label: string;
      data: number[];
      borderColor: string;
      backgroundColor: string;
      borderWidth: number;
    }[];
  }>({
    labels: [],
    datasets: [],
  });

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      console.error("No token found");

      return;
    }

    const fetchData = async () => {
      try {
        const data = await getAllChatsForCharts(token);
        const chatCountsByMonth = new Array(12).fill(0);
        const messageCountsByMonth = new Array(12).fill(0);

        data.chats.forEach((chat: ChatData) => {
          const chatMonth = new Date(chat.createdAt).getMonth();

          chatCountsByMonth[chatMonth]++;
          chat.messages.forEach((message) => {
            const messageMonth = new Date(message.createdAt).getMonth();

            messageCountsByMonth[messageMonth]++;
          });
        });

        const monthNames = [
          "Enero",
          "Febrero",
          "Marzo",
          "Abril",
          "Mayo",
          "Junio",
          "Julio",
          "Agosto",
          "Septiembre",
          "Octubre",
          "Noviembre",
          "Diciembre",
        ];

        const combinedData = chatCountsByMonth.map((chats, month) => ({
          month,
          monthName: monthNames[month],
          chats,
          messages: messageCountsByMonth[month],
        }));

        // Sort by the combined number of chats and messages in descending order
        combinedData.sort(
          (a, b) => b.chats + b.messages - (a.chats + a.messages),
        );

        // Take the top 5 months
        let top5Months = combinedData.slice(0, 5);

        // Ensure the best month is in the middle
        const bestMonth = top5Months[0];

        top5Months = [
          top5Months[1], // First item
          top5Months[2], // Second item
          bestMonth, // Best month in the middle
          top5Months[3], // Fourth item
          top5Months[4], // Fifth item
        ];

        // Sort the top 5 months by their month index for continuous order
        top5Months.sort((a, b) => a.month - b.month);

        setChartData({
          labels: top5Months.map((item) => item.monthName),
          datasets: [
            {
              label: "Cantidad de chats",
              data: top5Months.map((item) => item.chats),
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              borderWidth: 1,
            },
            {
              label: "Cantidad de mensajes",
              data: top5Months.map((item) => item.messages),
              borderColor: "rgba(255, 99, 132, 1)",
              backgroundColor: "rgba(255, 99, 132, 0.2)",
              borderWidth: 1,
            },
          ],
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
          type: "line",
          data: chartData,
          options: {
            responsive: true,
            plugins: {
              title: {
                display: true,
                text: "Comportamiento de los chats y mensajes mes a mes",
              },
            },
            scales: {
              x: {
                title: {
                  display: true,
                  text: "Mes",
                },
              },
              y: {
                title: {
                  display: true,
                  text: "Cantidad",
                },
                beginAtZero: true,
              },
            },
          },
        });
      }
    }
  }, [chartData]);

  return <canvas ref={chartRef} />;
};
