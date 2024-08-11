import { Button, Input, Avatar } from "@nextui-org/react";
import { Send as SendIcon } from "@geist-ui/icons";
import { useState } from "react";
import { toast } from "sonner";

import { emojis } from "@/app/consts/emojis";
import { createComment } from "@/services/Posts";

function CreateComment({
  updateComment,
  postId,
}: {
  updateComment: () => void;
  postId: string;
}) {
  const [content, setContent] = useState("");
  const [emoji, setEmoji] = useState("none");
  const [isSending, setIsSending] = useState(false);

  /**
   * Maneja la creación del comentario. Envía el comentario y el emoji seleccionado a la API.
   */
  const handleCreate = async () => {
    if (content.trim() === "") {
      toast.error("El contenido del comentario no puede estar vacío");
      return;
    }

    try {
      setIsSending(true);
      // Solo se envía el emoji si no es "none"
      const response = await createComment(
        postId,
        content,
        emoji === "none" ? "" : emoji
      );
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
   * Maneja el clic en un emoji para seleccionarlo o deseleccionarlo.
   *
   * @param {string} emojiName - Nombre del emoji seleccionado.
   */
  const handleEmojiClick = (emojiName: string) => {
    setEmoji((prevEmoji) => (prevEmoji === emojiName ? "none" : emojiName));
  };

  /**
   * Maneja el evento de tecla presionada en el campo de entrada.
   * Si la tecla presionada es Enter, se envía el comentario.
   *
   * @param {React.KeyboardEvent<HTMLInputElement>} e - Evento de teclado.
   */
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Previene el comportamiento por defecto del Enter
      handleCreate();
    }
  };

  const selectedEmoji = emojis.find((e) => e.name === emoji);

  return (
    <div className="flex flex-col items-start justify-between w-full h-full gap-5">
      <div className="flex items-center gap-2">
        <div className="flex flex-wrap gap-2" style={{ height: "2.5em" }}>
          {emojis
            .filter((e) => e.name !== "none") // Filtrar el emoji "none"
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
          onKeyDown={handleKeyDown} // Añadir el manejador de eventos onKeyDown
        />
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
