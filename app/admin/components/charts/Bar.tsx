"use client";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { format, subMonths } from "date-fns";

const BarChart = () => {
  const [token, setToken] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart | null>(null); 

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchUsers();
    }
  }, [token]);

  useEffect(() => {
    if (users.length > 0) {
      renderChart();
    }
  }, [users]);

  const fetchUsers = async () => {
    try {
      const response = await fetch("https://rest-api-cookie-u-c.onrender.com/api/users/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-access-token": token,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        console.error("Failed to fetch users:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const getLastFiveMonths = () => {
    const months = [];
    for (let i = 0; i < 5; i++) {
      const month = subMonths(new Date(), i);
      months.push(format(month, "yyyy-MM"));
    }
    return months.reverse();
  };

  const filterUsersByMonth = (users: any[], months: string[]) => {
    return months.map((month) => {
      const count = users.filter((user) => user.createdAt.startsWith(month)).length;
      return { month, count };
    });
  };

  const renderChart = () => {
    const months = getLastFiveMonths();
    const data = filterUsersByMonth(users, months);

    const chartData = {
      labels: data.map((d) => d.month),
      datasets: [
        {
          label: "User Registrations",
          data: data.map((d) => d.count),
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    };

    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "bar",
        data: chartData,
        options: chartOptions,
      });
    }
  };

  return <canvas ref={chartRef} />;
};

export default BarChart;
