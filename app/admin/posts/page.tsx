import { Toaster } from "sonner";
import CountersUP from "./components/CountersUP";
import TopUsersChart from "./components/TopUsersChart";

import TableUserWithPosts from "@/app/admin/posts/components/Table";
export default function DashboardPosts() {
  return (
    <>
      <div className="flex flex-col  h-screen w-full px-4 py-6 gap-8">
        <div className="max-w-xl w-full">
          <TopUsersChart />
        </div>
        <CountersUP />
        <TableUserWithPosts />
      </div>
      <Toaster richColors closeButton position="top-right" />
    </>
  );
}
