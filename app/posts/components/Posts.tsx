"use client";
import { ScrollShadow, Spinner } from "@nextui-org/react";
import { CreatePost } from "@/app/posts/components/CreatePost";
import { Post as IPost } from "@/types/Post";
import { getAllPosts } from "@/services/Posts";
import PostCard from "./PostCard";
import { useEffect, useState } from "react";
import { toast } from "sonner";

function Posts() {
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
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <main className="flex flex-col items-center w-full gap-4">
      <CreatePost
        updatePosts={() => {
          setLoading(true);
          allPosts();
        }}
      />
      <ScrollShadow className="w-full m-auto h-[75vh]" hideScrollBar>
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
      </ScrollShadow>
    </main>
  );
}

export default Posts;
