import { Button, Input, Avatar } from "@nextui-org/react";
import { Send as SendIcon } from "@geist-ui/icons";
import { useState } from "react";
import { toast } from "sonner";

import { userToken } from "@/types/Users";
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

  const handleCreate = async () => {
    if (content.trim() === "") {
      toast.error("Comment content cannot be empty");
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
        toast.success("Success creating comment");
      } else {
        throw new Error("Failed to create comment");
      }
    } catch (error) {
      toast.error("Error creating comment");
    } finally {
      setIsSending(false);
    }
  };

  const handleEmojiClick = (emojiName: string) => {
    setEmoji((prevEmoji) => (prevEmoji === emojiName ? "none" : emojiName));
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
                aria-label={`Select ${emojiItem.name} emoji`}
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
          placeholder="What are you thinking today?"
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
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
