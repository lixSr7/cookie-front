"use client";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export const PieChart = () => {
  const [token, setToken] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart<'pie', (number | null)[], string> | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  });

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

  const renderChart = () => {
    const sessionCounts = users.reduce(
      (acc, user) => {
        if (user.status === 'active') acc.active += 1;
        if (user.status === 'inactive') acc.inactive += 1;
        return acc;
      },
      { active: 0, inactive: 0 }
    );

    const chartData = {
      labels: ["Active Users", "Inactive Users"],
      datasets: [
        {
          label: "Users",
          data: [sessionCounts.active, sessionCounts.inactive],
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(54, 162, 235, 0.2)",
          ],
          borderColor: [
            "rgba(255, 99, 132, 1)",
            "rgba(54, 162, 235, 1)",
          ],
          borderWidth: 1,
        },
      ],
    };

    const chartOptions = {
      responsive: true,
    };

    if (chartRef.current) {
      if (chartInstanceRef.current) {
        chartInstanceRef.current.destroy();
      }
      chartInstanceRef.current = new Chart(chartRef.current, {
        type: "pie",
        data: chartData,
        options: chartOptions,
      });

    };

  }
  return <canvas ref={chartRef} />;
};

export default PieChart;