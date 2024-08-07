import CountersUP from "./components/CountersUP";

import TableUserWithPosts from "@/app/admin/posts/components/Table";
export default function DashboardPosts() {
  return (
    <div className="flex flex-col  h-screen w-full px-4 py-6 gap-8">
      <CountersUP />
      <TableUserWithPosts />
    </div>
  );
}
