"use client";

//? Components
import { Card } from "@nextui-org/react";

import BarChart from "./components/charts/Bar";
import { GenderPieChart } from "./components/charts/Pie";
import { LineChart } from "./components/charts/chats/charts";
import { ChatsLineChart } from "./chats/components/firstChart";

import { PostsByMonthChart } from "./posts/components/ChartsPlatform";

import PieChart from "./chats/components/secondChart";
import Counters from "./components/Counters";

function Dashboard() {
  return (
    <section className="grid grid-cols-8 grid-rows-6 gap-4 h-full max-h-[50em] place-content-center">
      <Card className="col-span-4 col-start-5 row-span-2 row-start-1 p-4 rounded-xl">
        <LineChart />
      </Card>

      <Card className="col-span-4 col-start-5 row-span-4 row-start-3 flex flex-col gap-4 p-4 rounded-xl">
        <div className="flex-1">
          <PostsByMonthChart />
        </div>
        <div className="flex-1">
          <ChatsLineChart />
        </div>
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

export default Dashboard;
