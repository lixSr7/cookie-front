import React, { useEffect, useState } from "react";
import {
  Card,
  CardFooter,
  Image,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
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
        // console.log("Mensaje eliminado");
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

  const ImageOnlyMessage = () => (
    <Card
      isFooterBlurred
      className="border-none relative hover:bg-gray-100 dark:hover:bg-gray-700"
      radius="lg"
    >
      {mediaUrl && (
        <>
          <Image
            alt="Message media"
            className="object-cover"
            height={200}
            src={mediaUrl.secure_url}
            width={200}
          />
          <CardFooter className="justify-between before:bg-white/10 border-white/20 border-1 overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] shadow-small ml-1 z-10">
            <p className="text-tiny text-white/80">{formattedTime}</p>
          </CardFooter>
          {isSender && (
            <div className="absolute top-0 right-0 mt-2 mr-2">
              <Dropdown>
                <DropdownTrigger>
                  <Button>
                    <IoIosArrowDown />
                  </Button>
                </DropdownTrigger>
                <DropdownMenu aria-label="Static Actions">
                  <DropdownItem
                    key="delete"
                    className="text-danger"
                    color="danger"
                    onClick={handleDelete}
                  >
                    Delete message
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </div>
          )}
        </>
      )}
    </Card>
  );

  return (
    <div
      className={`${isSender ? "justify-end" : "justify-start"} p-3 mb-2 w-full flex`}
    >
      {content || mediaUrl ? <TextAndImageMessage /> : <ImageOnlyMessage />}
    </div>
  );
};

export default Message;
