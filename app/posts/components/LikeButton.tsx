"use client";
import { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { Heart as HeartIcon } from "@geist-ui/icons";
import { jwtDecode } from "jwt-decode";

import { createLike, deleteLike } from "@/services/Posts";
import { userToken } from "@/types/Users";
import { Like as typeLike } from "@/types/Post";

/**
 * Componente para manejar el botón de dar like a un post.
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.postId - ID del post al cual se da like.
 * @param {typeLike[]} props.likes - Lista de likes asociados al post.
 * @returns {JSX.Element} - Elemento del botón de like.
 */
function LikeButton({
  postId,
  likes,
}: {
  postId: string;
  likes: typeLike[];
}): JSX.Element {
  const [userId, setUserId] = useState<string>("");
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [likeId, setLikeId] = useState<string | null>(null);

  // Efecto para obtener el userId desde el token almacenado en localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decodeToken: userToken = jwtDecode(storedToken);

      setUserId(decodeToken.id);
    }
  }, []);

  // Efecto para determinar si el usuario ha dado like al post
  useEffect(() => {
    const initialIsLiked = likes.some((like) => like.userId === userId);

    setIsLiked(initialIsLiked);

    if (initialIsLiked) {
      const userLike = likes.find((like) => like.userId === userId);

      setLikeId(userLike?._id || null);
    }
  }, [likes, userId]);

  // Maneja la acción de quitar el like
  const handleUnlike = async () => {
    if (likeId) {
      try {
        await deleteLike(postId, likeId);
        setIsLiked(false);
        setLikeId(null);
      } catch (error) {
        console.error("Error deleting like:", error);
      }
    }
  };

  // Maneja la acción de dar like
  const handleLike = async () => {
    try {
      const newLike = await createLike(postId);

      setIsLiked(true);
      setLikeId(newLike._id);
    } catch (error) {
      console.error("Error creating like:", error);
    }
  };

  // Botón cuando el post ya tiene un like del usuario
  const LikedButton = () => (
    <Button
      isIconOnly
      aria-label="Unlike"
      color="danger"
      onClick={handleUnlike}
    >
      <HeartIcon className="w-6 h-6 cursor-pointer fill-white" />
    </Button>
  );

  // Botón cuando el post no tiene un like del usuario
  const UnlikedButton = () => (
    <Button isIconOnly aria-label="Like" color="default" onClick={handleLike}>
      <HeartIcon className="w-6 h-6 cursor-pointer opacity-60" />
    </Button>
  );

  return <div>{isLiked ? <LikedButton /> : <UnlikedButton />}</div>;
}

export default LikeButton;
