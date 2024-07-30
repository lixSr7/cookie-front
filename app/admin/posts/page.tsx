import TableUserWithPosts from "@/app/admin/posts/components/Table";
import CountersUP from "./components/CountersUP";
export default function DashboardPosts() {
  return (
    <div className="flex flex-col  h-screen w-full px-4 py-6 gap-8">
      <CountersUP />
      <TableUserWithPosts />
    </div>
  );
}
