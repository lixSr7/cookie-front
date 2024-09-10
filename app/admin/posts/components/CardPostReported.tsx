import { useState, useEffect } from "react";

import { CardPost } from "./PostsOfUser";
import { Card, Spinner } from "@nextui-org/react";
import { Post as typePost, ReportPost as typeReport } from "@/types/Post";
import { getReportedPosts } from "@/services/Posts";

function CardPostReported() {
  const [posts, setPosts] = useState<typePost[]>([]);
  const [loading, setloading] = useState(true);

  const fechData = () => {
    getReportedPosts()
      .then((data: typePost[]) => {
        setPosts(data.reverse());
        console.log(data);
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
      })
      .finally(() => {
        setloading(false);
      });
  };
  useEffect(() => {
    fechData();
  }, []);

  if (loading) return <Spinner color="danger" />;
  if (posts.length === 0) return <p>No posts found.</p>;

  return (
    <div className=" py-3 px-2 overflow-y-auto max-h-[500px] scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
      {posts.map((post) => (
        <div
          key={post._id}
          className=" flex flex-col gap-3 p-2
        "
        >
          <CardPost post={post} />
          <CardReport reports={post.reports.reverse()} />
        </div>
      ))}
    </div>
  );
}

function CardReport({ reports }: { reports: typeReport[] }) {
  return (
    <div className="flex flex-col gap-3 w-full ">
      {reports.map((report) => (
        <Card className="w-full py-2 px-4" key={report._id}>
          {report.reason}
        </Card>
      ))}
    </div>
  );
}

export default CardPostReported;
