import { Button, Input, Select, SelectItem, Avatar } from "@nextui-org/react";
import { Send as SendIcon, Emoji as EmojiIcon } from "@geist-ui/icons";
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

  const userDefault: userToken = {
    fullname: "Alexis Gonzalez",
    username: "DJ Zass",
    role: "user",
    id: "1",
    iat: 0,
  };

  const handleCreate = async () => {
    try {
      setIsSending(true);
      await createComment(postId, content, emoji);
      setContent("");
      setEmoji("none");
      updateComment();
      toast.success("success creating comment");
    } catch (error) {
      // console.log(error);
      toast.error("Error creating comment");
    } finally {
      setIsSending(false);
    }
  };
  const handleSelectionEmoji = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setEmoji(e.target.value);
  };

  return (
    <div className="flex flex-col items-start justify-between w-full h-full gap-5">
      <Select
        className="w-20 "
        defaultSelectedKeys={["none", "happy", "sad", "ungry"]}
        placeholder="emoji"
        startContent={<EmojiIcon />}
        onChange={handleSelectionEmoji}
      >
        {emojis.map((emoji) => (
          <SelectItem
            key={emoji.name}
            className="flex flex-col items-center justify-center "
            value={emoji.name}
          >
            {!(emoji.name === "none") && (
              <Avatar
                alt={`Emoji cookie social network ${emoji.name}`}
                size="sm"
                src={emoji.svg}
              />
            )}
            {emoji.name}
          </SelectItem>
        ))}
      </Select>
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
          <SendIcon className="rotate-45 " />
        </Button>
      </div>
    </div>
  );
}

export default CreateComment;
