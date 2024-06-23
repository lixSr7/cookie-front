'use client';

//? Components
import { Card, ScrollShadow } from "@nextui-org/react";

import BarChart from "./components/charts/Bar";
import { GenderPieChart, CategoryPieChart } from "./components/charts/Pie";
import LineChart from "./posts/components/LineChartPosts";
import { getAllPosts } from "@/services/Posts";

import Counters from "./posts/components/Counters";
import { ChatsLineChart } from "./chats/components/firstChart";
import PieChart from "./chats/components/secondChart";

function Dashboard() {
  return (
    <section className="grid grid-cols-8 grid-rows-6 gap-4 h-full max-h-[50em] place-content-center">
      <Card className="col-span-4 col-start-5 row-span-2 row-start-1 p-4 rounded-xl">
        <LineChart />
      </Card>
      <Card className="flex items-center justify-between col-span-4 col-start-5 row-span-2 row-start-3 gap-4 p-4 rounded-xl">
        <Counters />
      </Card>
      <Card className="col-span-4 col-start-5 row-span-2 row-start-5 p-4 rounded-xl">
        <ChatsLineChart />
      </Card>
      <Card className="col-span-4 col-start-1 row-span-3 row-start-1 p-4 rounded-xl">
        <BarChart />
      </Card>
      <Card className="col-span-2 col-start-1 row-span-3 row-start-4 p-4 rounded-xl">
        <GenderPieChart />
      </Card>
      <Card className="col-span-2 col-start-3 row-span-3 row-start-4 p-4 rounded-xl">
        <PieChart />
      </Card>
    </section>
  );
}

export default Dashboard
