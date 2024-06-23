import { createComment } from "@/services/Posts";
import { Button, Input, Select, SelectItem, Avatar } from "@nextui-org/react";
import { Send as SendIcon, Emoji as EmojiIcon } from "@geist-ui/icons";
import { useState } from "react";
import { useAuthStore } from "@/app/context/useAuthSrored";
import { userToken } from "@/interfaces/Users";
import { emojis } from "@/app/consts/emojis";
import { toast } from "sonner";

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
  const { user } = useAuthStore();

  const userDefault: userToken = {
    fullname: "Alexis Gonzalez",
    username: "DJ Zass",
    image:
      "https://industriamusical.com/wp-content/uploads/2022/09/Bizarrap.jpg",
    role: "user",
    id: "1",
    iat: 0,
  };

  const userData = user ? user : userDefault;

  const handleCreate = async () => {
    try {
      setIsSending(true);
      await createComment(postId, content, emoji);
      setContent("");
      setEmoji("none");
      updateComment();
      toast.success('success creating comment')
    } catch (error) {
      console.log(error);
      toast.error('Error creating comment')
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
        placeholder="emoji"
        startContent={<EmojiIcon />}
        defaultSelectedKeys={["none", "happy", "sad", "ungry"]}
        className="w-20 "
        onChange={handleSelectionEmoji}
      >
        {emojis.map((emoji) => (
          <SelectItem
            key={emoji.name}
            value={emoji.name}
            className="flex flex-col items-center justify-center "
          >
            {!(emoji.name === "none") && (
              <Avatar
                size="sm"
                alt={`Emoji cookie social network ${emoji.name}`}
                src={emoji.svg}
              />
            )}
            {emoji.name}
          </SelectItem>
        ))}
      </Select>
      <div className="flex items-center justify-between w-full h-full gap-5">
        <Input
          id="content"
          disabled={isSending}
          type="text"
          placeholder="What are you thinking today?"
          labelPlacement="outside"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <Button
          onClick={handleCreate}
          isLoading={isSending}
          color="primary"
          variant="shadow"
          size="sm"
        >
          <SendIcon className="rotate-45 " />
        </Button>
      </div>
    </div>
  );
}

export default CreateComment;
