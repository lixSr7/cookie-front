import { Button, Input, Avatar } from "@nextui-org/react";
import { Send as SendIcon } from "@geist-ui/icons";
import { useState } from "react";
import { toast } from "sonner";

import { emojis } from "@/app/consts/emojis";
import { createComment } from "@/services/Posts";
import UploaderImageComment from "./UploaderImageComment";

function CreateComment({
  updateComment,
  postId,
}: {
  updateComment: () => void;
  postId: string;
}) {
  const [content, setContent] = useState("");
  const [emoji, setEmoji] = useState("none");
  const [image, setImage] = useState<File | undefined>(undefined);
  const [isSending, setIsSending] = useState(false);

  const handleCreate = async () => {
    if (content.trim() === "" && !image) {
      toast.error("El contenido del comentario no puede estar vacío");
      return;
    }

    try {
      setIsSending(true);
      const response = await createComment(postId, content, emoji, image);
      if (response) {
        setContent("");
        setEmoji("none");
        setImage(undefined);
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

  const handleEmojiClick = (emojiName: string) => {
    setEmoji((prevEmoji) => (prevEmoji === emojiName ? "none" : emojiName));
  };

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
