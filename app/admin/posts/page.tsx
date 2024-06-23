"use client";

import { getAllPosts } from "@/services/Posts";
import { ScrollShadow, Spinner } from "@nextui-org/react";
import { useEffect, useState } from "react";
import { Post as IPost } from "@/interfaces/Post";
import PostCard from "./components/posts";

function DashboardPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
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
            <PostCard token={token} post={post} updatePosts={allPosts} />
          </article>
        ))
      )}
    </main>
  );
}

export default DashboardPosts;
