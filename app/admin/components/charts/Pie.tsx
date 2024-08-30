"use client";
import { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

export const GenderPieChart = () => {
  const [token, setToken] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstanceRef = useRef<Chart<'pie', (number | null)[], string> | null>(null);

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

  const renderChart = () => {
    const genderCounts = users.reduce(
      (acc, user) => {
        if (user.gender === "male") acc.male += 1;
        if (user.gender === "female") acc.female += 1;
        if (user.gender === "not binary") acc.notBinary += 1;
        return acc;
      },
      { male: 0, female: 0, notBinary: 0 }
    );

    const chartData = {
      labels: ["Male", "Female", "Not Binary"],
      datasets: [
        {
          data: [genderCounts.male, genderCounts.female, genderCounts.notBinary],
          backgroundColor: [
            "rgba(75, 192, 192, 0.6)",
            "rgba(255, 99, 132, 0.6)",
            "rgba(153, 102, 255, 0.6)",
          ],
          borderColor: [
            "rgba(75, 192, 192, 1)",
            "rgba(255, 99, 132, 1)",
            "rgba(153, 102, 255, 1)",
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
    }
  };

  return <canvas ref={chartRef} />;
};

export default GenderPieChart;