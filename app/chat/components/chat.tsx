import React, { useState, useEffect } from "react";
import { Avatar, Badge } from "@nextui-org/react";
import { MdOutlineDelete } from "react-icons/md";
import axios from "axios";
import socket from "@/app/config/socketConfig";
import { jwtDecode } from "jwt-decode";

interface ChatProps {
  chatData: {
    id: string;
    name: string;
    messages: { content: string }[];
    users: string[];
  };
  userId: string;
  onDeleteChat: (chatId: string) => void;
}

interface Message {
  content: string;
}

const Chat: React.FC<ChatProps> = ({ chatData, userId, onDeleteChat }) => {
  const { id, name, messages, users } = chatData;

  const token = localStorage.getItem("token");
  if (!token) {
    console.error("No token found");
    return null;
  }

  const decodedToken: any = jwtDecode(token);
  const username = decodedToken.username;

  const otherUserId = users.find((user) => user !== userId) || "";

  const [lastMessage, setLastMessage] = useState<string>(() => {
    return messages.length > 0 ? messages[messages.length - 1].content : "";
  });

  const [unreadMessages, setUnreadMessages] = useState<number>(0);

  useEffect(() => {
    const socketInstance = socket;

    const handleNewMessage = (message: Message, chatId: string) => {
      if (chatId === id) {
        setUnreadMessages((prevCount) => prevCount + 1);
        setLastMessage(message.content);
      }
    };

    socketInstance.on("newMessage", handleNewMessage);

    return () => {
      socketInstance.off("newMessage", handleNewMessage);
    };
  }, [id]);

  const deleteChat = async () => {
    const confirmed = window.confirm("Are you sure you want to delete this chat?");
    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      await axios.delete(`https://rest-api-cookie-u-c-p.onrender.com/api/chat/${id}`, {
        headers: {
          "x-access-token": token,
        },
      });

      console.log("Chat deleted successfully");
      onDeleteChat(id);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  const names = name.split(",");
  const otherUserName = names.find((n) => n.trim() !== username.trim()) || "";

  return (
    <div className="flex bg-white dark:bg-zinc-800 dark:hover:bg-zinc-600 dark:hover:transition-transform-background p-3 rounded-md shadow w-full max-w-[300px] gap-4 justify-between hover:bg-slate-200 transition-transform-background">
      <div className="flex items-center gap-4 w-full">
        <Badge
          content={unreadMessages > 0 ? unreadMessages : ""}
          color="danger"
          shape="circle"
          showOutline={false}
        >
          <Avatar
            isBordered
            radius="full"
            src={`https://i.pravatar.cc/150?u=${otherUserId}`}
            color="danger"
          />
        </Badge>
        <div className="flex flex-col">
          <h3 className="text-lg text-black dark:text-white">
            {otherUserName}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
            {unreadMessages > 0 ? lastMessage : ""}
          </p>
        </div>
      </div>
      <button
        onClick={deleteChat}
        className="text-red-600 hover:text-red-800"
      >
        <MdOutlineDelete size={24} />
      </button>
    </div>
  );
};

export default Chat;