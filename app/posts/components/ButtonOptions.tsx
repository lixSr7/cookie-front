import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import CommentModal from "./CommentModal";
import { userToken } from "@/types/Users";
import { Like as typeLike } from "@/types/Post";
import { jwtDecode } from "jwt-decode";

import LikeButton from "./LikeButton";
import SaveButton from "./SaveButton";
import ShareButton from "./ShareButton";
/**
 * Componente principal que maneja las opciones de botones para un post.
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.postId - ID del post.
 * @param {typeLike[]} props.likes - Lista de likes asociados al post.
 * @returns {JSX.Element} - Elemento de las opciones de botones.
 */
function ButtonOptions({
  postId,
  likes,
}: {
  postId: string;
  likes: typeLike[];
}) {
  const [userId, setUserId] = useState<string>("");
  const [isFavorite, setIsFavorite] = useState<boolean>(false);

  // Efecto para obtener el userId desde el token almacenado en localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decodeToken: userToken = jwtDecode(storedToken);
      setUserId(decodeToken.id);
    }
  }, []);

  // Maneja la acción de marcar o desmarcar como favorito
  const handleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // Maneja la acción de compartir
  const handleShare = () => {
    // Lógica para manejar la acción de compartir
    console.log("Share button clicked!");
    // Aquí podrías implementar la lógica específica de compartir
  };

  return (
    <div className="flex items-center justify-between w-full rounded-md">
      <div className="flex items-center gap-4">
        {/* Componente LikeButton para manejar el like */}
        <LikeButton postId={postId} likes={likes} />
        {/* Modal de comentarios */}
        <CommentModal postId={postId} />
        {/* Componente ShareButton para manejar el ícono de compartir */}
        <ShareButton onClick={handleShare} />
      </div>
      <div>
        {/* Componente SaveButton para manejar el botón de guardar */}
        <SaveButton  postId={postId} />
      </div>
    </div>
  );
}

export default ButtonOptions;
