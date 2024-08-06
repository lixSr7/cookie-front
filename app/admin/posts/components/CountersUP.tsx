"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@nextui-org/react";
import CountUp from "react-countup";

import { getStatsPlatform } from "@/services/Posts";

interface Stats {
  totalPosts: number;
  totalComments: number;
  totalLikes: number;
  totalSavedPosts: number;
}

function CountersUP() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getStatsPlatform();

        setStats(data);
      } catch (error) {
        console.error("Failed to fetch statistics:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="grid grid-cols-3 gap-4">
      <Counter loading={loading} title="Posts" value={stats?.totalPosts || 0} />
      <Counter
        loading={loading}
        title="Comments"
        value={stats?.totalComments || 0}
      />
      <Counter loading={loading} title="Likes" value={stats?.totalLikes || 0} />
    </div>
  );
}

interface CounterProps {
  title: string;
  value: number;
  loading: boolean;
}

function Counter({ title, value, loading }: CounterProps) {
  return (
    <div className="relative p-16 rounded-md text-xl font-bold bg-gradient-to-r from-gradient-start to-gradient-end animate-bg-gradient text-white">
      {loading ? (
        <div className="absolute inset-0 bg-gray-300" style={{ zIndex: 1 }}>
          <Skeleton className="h-full w-full" />
        </div>
      ) : (
        <>
          + <CountUp duration={3} end={value} separator="," start={0} />
          <span className="ml-2">{title}</span>
        </>
      )}
    </div>
  );
}

export default CountersUP;
