"use client";
import { ScrollShadow } from "@nextui-org/react";
import { useEffect, useState } from "react";

import PostCard from "./PostCard";
import { CreatePost } from "@/app/posts/components/CreatePost";
import { Post as IPost } from "@/types/Post";
import { getAllPosts } from "@/services/Posts";
import socket from "@/app/config/socketConfig";
import SkeletoPosts from "./SkeletonPosts";

/**
 * Componente que muestra una lista de publicaciones y permite crear nuevas publicaciones.
 * Maneja la carga de publicaciones desde un servicio y actualiza la lista en tiempo real usando WebSockets.
 *
 * @returns {JSX.Element} - El componente Posts renderizado.
 */
function Posts() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
    }
    allPosts();
  }, []);

  useEffect(() => {
    socket.connect();

    socket.on("userUpdate", async (data) => {
      await allPosts();
    });

    return () => {
      socket.off("userUpdate");
    };
  }, [token]);

  /**
   * Carga todas las publicaciones desde el servicio y actualiza el estado del componente.
   *
   * @async
   * @function
   * @returns {Promise<void>}
   */
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
      <ScrollShadow hideScrollBar className="w-full m-auto h-[75vh]">
        {loading ? (
          <SkeletoPosts />
        ) : (
          posts.map((post: IPost) => (
            <article key={post._id}>
              <PostCard post={post} updatePosts={allPosts} />
            </article>
          ))
        )}
      </ScrollShadow>
    </main>
  );
}

export default Posts;
