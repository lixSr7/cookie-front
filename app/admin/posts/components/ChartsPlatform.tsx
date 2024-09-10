"use client";

import React, { useEffect, useState } from "react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement,
} from "chart.js";
import { getPlatformAnalytics } from "@/services/Posts";

// Registrar los componentes necesarios para Chart.js
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  ArcElement,
  PointElement
);

// Definir tipos para los datos
interface PostsByMonth {
  [key: string]: number;
}

interface CommentDistribution {
  postId: string;
  numberOfComments: number;
}

interface CommentsAndLikesAverage {
  totalComments: number;
  totalLikes: number;
  totalPosts: number;
  averageComments: number;
  averageLikes: number;
}

interface PlatformAnalyticsData {
  postsByMonth: PostsByMonth;
  commentsDistribution: CommentDistribution[];
  commentsAndLikesAverage: CommentsAndLikesAverage;
}

// Hook para obtener los datos
const usePlatformAnalytics = () => {
  const [data, setData] = useState<PlatformAnalyticsData>({
    postsByMonth: {},
    commentsDistribution: [],
    commentsAndLikesAverage: {
      totalComments: 0,
      totalLikes: 0,
      totalPosts: 0,
      averageComments: 0,
      averageLikes: 0,
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getPlatformAnalytics();
        setData(response);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return data;
};

// Componente para el gráfico de líneas
export const PostsByMonthChart: React.FC = () => {
  const data = usePlatformAnalytics().postsByMonth;
  const labels = Object.keys(data);
  const values = Object.values(data);

  return (
    <div>
      <h2>Posts by Month</h2>
      <Line
        data={{
          labels,
          datasets: [
            {
              label: "Posts",
              data: values,
              borderColor: "rgba(75, 192, 192, 1)",
              backgroundColor: "rgba(75, 192, 192, 0.2)",
              fill: true,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: true,
              position: "top",
            },
            title: {
              display: true,
              text: "Posts by Month",
            },
          },
        }}
      />
    </div>
  );
};

// Componente para el gráfico de barras
export const CommentsDistributionChart: React.FC = () => {
  const data = usePlatformAnalytics().commentsDistribution;
  const labels = data.map((post) => post.postId);
  const values = data.map((post) => post.numberOfComments);

  return (
    <div>
      <h2>Comments Distribution</h2>
      <Bar
        data={{
          labels,
          datasets: [
            {
              label: "Number of Comments",
              data: values,
              backgroundColor: "rgba(153, 102, 255, 0.2)",
              borderColor: "rgba(153, 102, 255, 1)",
              borderWidth: 1,
            },
          ],
        }}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: true,
              text: "Comments Distribution by Post",
            },
          },
          scales: {
            x: {
              beginAtZero: true,
            },
            y: {
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
};

// Componente para el gráfico circular
export const CommentsAndLikesAverageChart: React.FC = () => {
  const data = usePlatformAnalytics().commentsAndLikesAverage;
  const pieData = {
    labels: ["Total Comments", "Total Likes", "Total Posts"],
    datasets: [
      {
        data: [data.totalComments, data.totalLikes, data.totalPosts],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56"],
      },
    ],
  };

  return (
    <div>
      <h2>Comments and Likes Average</h2>
      <Pie
        data={pieData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: "top",
            },
            title: {
              display: true,
              text: "Comments and Likes Average",
            },
          },
        }}
      />
    </div>
  );
};

// Componente principal que usa los gráficos
const ChartsPlatform: React.FC = () => {
  return (
    <div>
      <PostsByMonthChart />
      <CommentsDistributionChart />
      <CommentsAndLikesAverageChart />
    </div>
  );
};

export default ChartsPlatform;
