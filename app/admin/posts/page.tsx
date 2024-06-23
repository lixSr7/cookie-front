"use client";
import PostCard from "@/app/posts/components/PostCard";
import { getAllPosts } from "@/services/Posts";
import { ScrollShadow, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Post as IPost } from "@/interfaces/Post";

function DashboardPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    allPosts();
  }, []);

  const allPosts = async () => {
    try {
      const postsData = await getAllPosts();
      setPosts(postsData.reverse());
      setLoading(false);
      console.log("All posts:", postsData);
      // toast.success('All posts 🎔')
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <main className="grid grid-cols-3 gap-4 max-w-7xl">
      {loading ? (
        <div className="flex items-center justify-center h-full">
          <Spinner size="lg" color="danger" />
        </div>
      ) : (
        posts.map((post: IPost) => (
          <article key={post._id}>
            <PostCard post={post} updatePosts={allPosts} />
          </article>
        ))
      )}
    </main>
  );
}

export default DashboardPosts;
