"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { ScrollShadow, Skeleton } from "@nextui-org/react";

import Chat from "./chat";

import socket from "@/app/config/socketConfig";

interface Message {
  content: string;
}

interface ChatData {
  _id: string;
  name: string;
  messages: Message[];
  users: string[];
}

interface ChatListProps {
  onSelectChat: (chatId: string) => void;
  searchTerm: string;
}

interface DecodedToken {
  id: string;
}

const ChatList: React.FC<ChatListProps> = ({ onSelectChat, searchTerm }) => {
  const [token, setToken] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [chats, setChats] = useState<ChatData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode<DecodedToken>(storedToken);

      setId(decodedToken.id);
    }
  }, []);

  useEffect(() => {
    if (id) {
      fetchChats();
    }
  }, [id]);

  useEffect(() => {
    socket.on("newChat", (newChat: ChatData) => {
      setChats((prevChats) => [...prevChats, newChat]);
    });

    socket.on("chatDeleted", (deletedChatId: string) => {
      setChats((prevChats) =>
        prevChats.filter((chat) => chat._id !== deletedChatId)
      );
    });

    return () => {
      socket.off("newChat");
      socket.off("chatDeleted");
    };
  }, []);

  async function fetchChats() {
    if (!token) return;

    try {
      const response = await axios.get(
        "https://rest-api-cookie-u-c.onrender.com/api/chat/",
        {
          headers: {
            "x-access-token": token,
          },
        }
      );

      setChats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Failed to fetch chats:", error);
      setLoading(false);
    }
  }

  const handleDeleteChat = (chatId: string) => {
    setChats((prevChats) => prevChats.filter((chat) => chat._id !== chatId));
  };

  const handleSelectChat = (chatId: string) => {
    setSelectedChatId(chatId);
    onSelectChat(chatId);
  };

  const filteredChats = chats.filter((chat) =>
    chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full min-w-[250px] mt-3 text-white h-full md:h-screen sm:h-screen overflow-hidden">
      <ScrollShadow
        hideScrollBar
        className="w-full h-full overflow-y-auto flex flex-col m-auto"
      >
        {loading ? (
          <SkeletonChatList />
        ) : (
          filteredChats.map((chat) => (
            <div
              key={chat._id}
              className={`cursor-pointer ${
                selectedChatId === chat._id ? "" : ""
              } 0 p-2 rounded-lg`}
              role="button"
              tabIndex={0}
              onClick={() => handleSelectChat(chat._id)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleSelectChat(chat._id);
                }
              }}
            >
              <Chat
                chatData={{ ...chat, id: chat._id }}
                userId={id}
                onDeleteChat={handleDeleteChat}
              />
            </div>
          ))
        )}
      </ScrollShadow>
    </div>
  );
};

const SkeletonChatList = () => {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4, 5, 6].map((index) => (
        <Skeleton key={index} className="h-[80px] w-full rounded-lg" />
      ))}
    </div>
  );
};

export default ChatList;
