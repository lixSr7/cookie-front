// SaveButton.tsx

import React, { useState, useEffect } from "react";
import { Button } from "@nextui-org/react";
import { Star as StarIcon } from "@geist-ui/icons";
import { savePost, unsavePost, getSavedPosts } from "@/services/Posts";

/**
 * Componente para manejar el botón de guardar (anteriormente Favorito).
 * @returns {JSX.Element} - Elemento del botón de guardar.
 */
function SaveButton({ postId }: { postId: string }): JSX.Element {
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // Efecto para determinar si el post está guardado al cargar el componente
  useEffect(() => {
    const checkSavedStatus = async () => {
      try {
        const savedPosts = await getSavedPosts();
        const isPostSaved = savedPosts.includes(postId);
        setIsSaved(isPostSaved);
      } catch (error) {
        console.error("Error checking saved status:", error);
      }
    };

    checkSavedStatus();
  }, [postId]);

  // Maneja la acción de guardar o desguardar
  const handleSave = async () => {
    try {
      if (isSaved) {
        await unsavePost(postId);
      } else {
        await savePost(postId);
      }
      setIsSaved(!isSaved); // Actualiza el estado después de la operación
    } catch (error) {
      console.error("Error saving/unsaving post:", error);
    }
  };

  return (
    <Button
      onClick={handleSave}
      isIconOnly
      color={isSaved ? "warning" : "default"}
      variant="shadow"
    >
      <StarIcon
        className={`w-5 h-5 cursor-pointer ${
          isSaved ? "fill-white" : "opacity-60"
        }`}
      />
    </Button>
  );
}

export default SaveButton;
