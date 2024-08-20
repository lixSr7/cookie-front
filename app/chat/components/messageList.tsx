import React, { useState, useEffect, useRef } from "react";
import { Spinner } from "@nextui-org/react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

import Message from "./message";

import socket from "@/app/config/socketConfig";

interface DecodedToken {
  id: string;
}

interface IMessage {
  _id: string;
  chatId: string;
  sender: string;
  content: string;
  createdAt: string;
  mediaUrl?: {
    public_id: string;
    secure_url: string;
  };
}

interface MessagesProps {
  selectedChat: string | null;
}

const Messages: React.FC<MessagesProps> = ({ selectedChat }) => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [id, setId] = useState<string>("");
  const [chatId, setChatId] = useState<string>("");
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const [windowWidth, setWindowWidth] = useState<number>(window.innerWidth);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      setToken(storedToken);
      const decodedToken = jwtDecode<DecodedToken>(storedToken);

      setId(decodedToken.id);
    }
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const joinChat = async () => {
      if (!selectedChat || !token) return;

      try {
        setLoading(true);
        const response = await axios.post(
          `https://rest-api-cookie-u-c.onrender.com/api/chat/${selectedChat}`,
          {},
          {
            headers: {
              "x-access-token": token,
            },
          },
        );

        setMessages(response.data.chat.messages);
        setChatId(response.data.chat._id);
        socket.emit("joinRoom", selectedChat);
        scrollToBottom();
      } catch (error: any) {
        console.error(
          "Failed to join chat:",
          error.response?.data || error.message,
        );
      } finally {
        setLoading(false);
      }
    };

    joinChat();
  }, [selectedChat, token]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message: IMessage) => {
      if (message.chatId === selectedChat) {
        setMessages((prevMessages) => [...prevMessages, message]);
        scrollToBottom();
      }
    };

    const handleDeleteMessage = (messageId: string, chatId: string) => {
      if (chatId === selectedChat) {
        setMessages((prevMessages) =>
          prevMessages.filter((message) => message._id !== messageId),
        );
      }
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageDeleted", handleDeleteMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDeleted", handleDeleteMessage);
    };
  }, [selectedChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);

    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Hoy";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Ayer";
    } else {
      const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      };

      return date.toLocaleDateString(undefined, options);
    }
  };

  return (
    <article
      className={`flex-grow w-full h-full max-h-[480px] min-h-[400px] flex flex-col ${windowWidth <= 768 ? "overflow-y-auto" : ""}`}
    >
      {loading ? (
        <div className="grid place-content-center w-full h-full">
          <Spinner className="flex m-auto" color="danger" label="Loading..." />
        </div>
      ) : selectedChat ? (
        <div
          ref={messagesContainerRef}
          className="h-full flex-grow w-full"
          style={{ overflowY: windowWidth <= 768 ? "auto" : "hidden" }}
        >
          {messages.map((message, index) => {
            const showDate =
              index === 0 ||
              new Date(message.createdAt).toLocaleDateString() !==
                new Date(messages[index - 1]?.createdAt).toLocaleDateString();

            return (
              <React.Fragment key={message._id}>
                {showDate && (
                  <div className="text-center text-gray-500 my-2">
                    <p>{formatDate(message.createdAt)}</p>
                  </div>
                )}
                <Message
                  chatId={chatId}
                  content={message.content}
                  createdAt={message.createdAt}
                  id={message._id}
                  mediaUrl={message.mediaUrl}
                  sender={message.sender}
                />
              </React.Fragment>
            );
          })}
          <div ref={messagesEndRef} />
        </div>
      ) : (
        <div className="text-gray-500 flex justify-center items-center w-full h-full">
          <p>No user selected</p>
        </div>
      )}
    </article>
  );
};

export default Messages;
