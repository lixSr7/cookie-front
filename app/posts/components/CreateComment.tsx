"use client";

import { Button, Input, Avatar } from "@nextui-org/react";
import { Send as SendIcon } from "@geist-ui/icons";
import { useState } from "react";
import { toast } from "sonner";

import { emojis } from "@/app/consts/emojis";
import { createComment } from "@/services/Posts";
import UploaderImageComment from "./UploaderImageComment";

/**
 * Componente para crear un nuevo comentario en una publicación.
 *
 * @param {Object} props - Propiedades del componente.
 * @param {Function} props.updateComment - Función para actualizar la lista de comentarios.
 * @param {string} props.postId - ID de la publicación a la que se añadirá el comentario.
 * @returns {JSX.Element} - El componente de creación de comentarios.
 */
function CreateComment({
  updateComment,
  postId,
}: {
  updateComment: () => void;
  postId: string;
}): JSX.Element {
  const [content, setContent] = useState<string>(""); // Estado para el contenido del comentario.
  const [emoji, setEmoji] = useState<string>("none"); // Estado para el emoji seleccionado.
  const [image, setImage] = useState<File | undefined>(undefined); // Estado para la imagen adjunta.
  const [isSending, setIsSending] = useState<boolean>(false); // Estado para manejar el estado de carga.

  /**
   * Maneja la creación del comentario, enviando la solicitud al servidor.
   *
   * @async
   * @function
   * @returns {Promise<void>} - No retorna nada.
   */
  const handleCreate = async () => {
    try {
      setIsSending(true);
      const response = await createComment(postId, content, emoji, image);
      if (response) {
        setContent("");
        setEmoji("none");
        updateComment();
        toast.success("Comentario creado con éxito");
      } else {
        throw new Error("Error al crear el comentario");
      }
    } catch (error) {
      toast.error("Error al crear el comentario");
    } finally {
      setIsSending(false);
    }
  };

  /**
   * Maneja el clic en un emoji, actualizando el emoji seleccionado.
   *
   * @param {string} emojiName - El nombre del emoji seleccionado.
   * @returns {void}
   */
  const handleEmojiClick = (emojiName: string) => {
    setEmoji((prevEmoji) => (prevEmoji === emojiName ? "none" : emojiName));
  };

  /**
   * Maneja el evento de presionar una tecla en el campo de entrada.
   * Si se presiona Enter, se crea el comentario.
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} e - El evento de teclado.
   * @returns {void}
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleCreate();
    }
  };

  return (
    <div className="flex flex-col items-start justify-between w-full h-full gap-6">
      <div className="flex items-center gap-2">
        <div className="flex flex-wrap gap-2" style={{ height: "2.5em" }}>
          {emojis
            .filter((e) => e.name !== "none")
            .map((emojiItem) => (
              <Button
                key={emojiItem.name}
                onClick={() => handleEmojiClick(emojiItem.name)}
                size="sm"
                className={`py-6 ${
                  emoji === emojiItem.name ? "bg-gray-200" : ""
                }`}
                aria-label={`Seleccionar emoji ${emojiItem.name}`}
              >
                <Avatar
                  alt={`Emoji ${emojiItem.name}`}
                  size="sm"
                  src={emojiItem.svg}
                />
              </Button>
            ))}
        </div>
      </div>
      <div className="flex items-center justify-between w-full h-full gap-5">
        <Input
          disabled={isSending}
          id="content"
          labelPlacement="outside"
          placeholder="¿Qué estás pensando hoy?"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <UploaderImageComment image={image} setImage={setImage} />
        <Button
          color="primary"
          isLoading={isSending}
          size="sm"
          variant="shadow"
          onClick={handleCreate}
        >
          <SendIcon className="rotate-45" />
        </Button>
      </div>
    </div>
  );
}

export default CreateComment;
