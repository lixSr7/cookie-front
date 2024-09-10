import React, { useState, useEffect } from "react";
import {
  Button,
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem
} from "@nextui-org/react";
import { MdOutlineEdit, MdOutlineDelete } from "react-icons/md";
import { BsThreeDotsVertical } from "react-icons/bs";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import UpdateChatForm from "./modalUpdateChat";

import socket from "@/app/config/socketConfig";

interface ChatProps {
  chatData: {
    id: string;
    name: string;
    messages: { content: string }[];
    users: string[];
    group?: {
      image?: string; // Para chats grupales
    };
  };
  userId: string;
  onDeleteChat: (chatId: string) => void;
}

interface Message {
  content: string;
}

const Chat: React.FC<ChatProps> = ({ chatData, userId, onDeleteChat }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastMessage, setLastMessage] = useState<string>(() => {
    return chatData.messages.length > 0 ? chatData.messages[chatData.messages.length - 1].content : "";
  });
  const [unreadMessages, setUnreadMessages] = useState<number>(0);
  const [username, setUsername] = useState<string | null>(null);
  const [otherUserImage, setOtherUserImage] = useState<string>("");

  const token = localStorage.getItem("token");
  const { id, name, users, group } = chatData;

  useEffect(() => {
    if (!token) {
      console.error("No token found");
      return;
    }

    const decodedToken: any = jwtDecode(token);

    setUsername(decodedToken.username);

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
  }, [id, token]);

  useEffect(() => {
    const fetchOtherUserImage = async () => {
      const otherUserId = users.find((user) => user !== userId);

      if (otherUserId) {
        try {
          const response = await axios.get(
            `https://rest-api-cookie-u-c.onrender.com/api/users/${otherUserId}`,
            {
              headers: { "x-access-token": token },
            }
          );
          const userData = response.data;

          setOtherUserImage(
            userData.image?.secure_url ||
              `https://i.pravatar.cc/150?u=${otherUserId}`,
          );
        } catch (error) {
          console.error("Error fetching other user data:", error);
        }
      }
    };

    fetchOtherUserImage();
  }, [users, userId, token]);

  const deleteChat = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this chat?",
    );

    if (!confirmed) return;

    try {
      if (!token) {
        console.error("No token found");
        return;
      }

      await axios.delete(
        `https://rest-api-cookie-u-c.onrender.com/api/chat/${id}`,
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      onDeleteChat(id);
    } catch (error) {
      console.error("Failed to delete chat:", error);
    }
  };

  if (!username) {
    return null;
  }

  const names = name.split(",");
  const otherUserName = names.find((n) => n.trim() !== username.trim()) || "";

  // Determinar la imagen del chat
  const chatImage =
    group?.image || otherUserImage || `https://i.pravatar.cc/150?u=${userId}`;

  const isEditDisabled = users.length === 2;

  return (
    <div className="flex bg-white dark:bg-zinc-800 dark:hover:bg-zinc-600 dark:hover:transition-transform-background p-3 rounded-md shadow w-full max-w-[300px] justify-between hover:bg-slate-200 transition-transform-background">
      <div className="flex items-center gap-4 w-full">
        <Avatar isBordered color="danger" radius="full" src={chatImage} />
        <div className="flex flex-col">
          <h3 className="text-lg text-black dark:text-white">
            {otherUserName}
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm truncate">
            {unreadMessages > 0 ? lastMessage : ""}
          </p>
        </div>
      </div>
      <Dropdown>
        <DropdownTrigger>
          <Button aria-label="Actions" variant="bordered">
            <BsThreeDotsVertical size={24} />
          </Button>
        </DropdownTrigger>
        <DropdownMenu aria-label="Actions Menu" className="flex">
          <DropdownItem
            className="flex m-auto items-center justify-between"
            key="edit"
            isDisabled={isEditDisabled}
            onClick={() => !isEditDisabled && setIsModalOpen(true)}
          >
            <MdOutlineEdit className="mr-2" size={24} />
            Update
          </DropdownItem>
          <DropdownItem
            key="delete"
            color="danger"
            onClick={() => deleteChat()}
          >
            <MdOutlineDelete className="mr-2" size={24} />
            Delete
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      {isModalOpen && (
        <UpdateChatForm
          chatId={id}
          initialName={name}
          initialUsers={users.map((userId) => ({ _id: userId, username: "" }))}
          token={token || ""}
          onClose={() => setIsModalOpen(false)}
          onUpdate={() => {
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Chat;
