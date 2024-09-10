import React, { useEffect, useState } from "react";
import {
  Card,
  CardFooter,
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@nextui-org/react";
import { jwtDecode } from "jwt-decode";
import { IoIosArrowDown } from "react-icons/io";

import deleteMessage from "./deleteMessage";

import socket from "@/app/config/socketConfig";

export interface MessageProps {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
  mediaUrl?: {
    public_id: string;
    secure_url: string;
  };
  chatId: string;
}

interface DecodedToken {
  id: string;
}

const formatTime = (date: string | number | Date) => {
  const dateObj = new Date(date);
  const hours = dateObj.getHours().toString().padStart(2, "0");
  const minutes = dateObj.getMinutes().toString().padStart(2, "0");

  return `${hours}:${minutes}`;
};

const Message: React.FC<MessageProps> = ({
  id: messageId,
  sender,
  content,
  createdAt,
  mediaUrl,
  chatId,
}) => {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decodedToken = jwtDecode<DecodedToken>(storedToken);

      setId(decodedToken.id);
    }
  }, []);

  const isSender = sender === id;
  const formattedTime = formatTime(createdAt);

  const handleDelete = async () => {
    if (window.confirm("¿Seguro que deseas eliminar el mensaje?")) {
      const token = localStorage.getItem("token") || "";

      try {
        await deleteMessage(messageId, chatId, token);
        socket.emit("deleteMessage", messageId, chatId);
      } catch (error) {
        console.error("Error deleting message:", error);
      }
    }
  };

  const TextAndImageMessage = () => (
    <div className="relative p-5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">
      {mediaUrl && (
        <div className="flex justify-center">
          <Image
            alt="Message media"
            height="auto"
            src={mediaUrl.secure_url}
            style={{ maxHeight: "200px" }}
            width={300}
          />
        </div>
      )}
      {content && (
        <p
          className={`${mediaUrl ? "mt-2" : ""} p-3 mb-2 rounded-md ${
            isSender
              ? "bg-danger-500 text-white dark:text-black"
              : "bg-gray-200 dark:text-black"
          }`}
        >
          {content}
        </p>
      )}
      <p className="text-xs text-gray-500">{formattedTime}</p>
      {isSender && (
        <div className="absolute top-0 right-0 mt-2 mr-2">
          <Dropdown>
            <DropdownTrigger>
              <button className="">
                <IoIosArrowDown />
              </button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Static Actions">
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                onClick={handleDelete}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </div>
      )}
    </div>
  );

  return (
    <div className={`flex ${isSender ? "justify-end" : "justify-start"}`}>
      <Card className="max-w-xs mx-2 my-2">
        <TextAndImageMessage />
        {mediaUrl && (
          <CardFooter>
            <a
              className="text-blue-500 hover:underline"
              href={mediaUrl.secure_url}
              target="_blank"
              rel="noopener noreferrer"
            >
              View full image
            </a>
          </CardFooter>
        )}
      </Card>
    </div>
  );
};

export default Message;
