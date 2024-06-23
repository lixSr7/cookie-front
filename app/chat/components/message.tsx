import React, { useEffect, useState } from "react";
import { Image, Spinner } from "@nextui-org/react";
import { jwtDecode } from "jwt-decode";

export interface MessageProps {
  id: string;
  sender: string;
  content: string;
  createdAt: string;
  mediaUrl?: {
    public_id: string;
    secure_url: string;
  };
}

interface DecodedToken {
  id: string;
}

const formatDate = (date: string | number | Date) => {
  const dateObj = new Date(date);
  const day = dateObj.getDate().toString().padStart(2, "0");
  const month = (dateObj.getMonth() + 1).toString().padStart(2, "0");
  const year = dateObj.getFullYear();
  return `${day}/${month}/${year}`;
};

const Message: React.FC<MessageProps> = ({ sender, content, createdAt, mediaUrl }) => {
  const [id, setId] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      const decodedToken = jwtDecode<DecodedToken>(storedToken);
      setId(decodedToken.id);
    }
  }, []);

  const isSender = sender === id;
  const formattedDate = formatDate(createdAt);

  return (
    <div className={`${isSender ? "justify-end" : "justify-start"} p-3 mb-2 w-full flex`}>
      <div
        className={`${
          isSender ? "bg-danger-500 text-white" : "bg-gray-300 dark:bg-zinc-700"
        } p-4 rounded-md`}
      >
        {mediaUrl && (
          <div className="mt-2 mb-2 max-h-[200px]">  
            <Image
              width={300}
              height="auto"
              alt="Message media"
              src={mediaUrl.secure_url}
              style={{ maxHeight: "200px" }}  
            />
          </div>
        )}
        <p>{content}</p>
        <p
          className={`${
            isSender ? "text-white" : "dark:text-zinc-400"
          } text-sm text-opacity-45 flex justify-end`}
        >
          {formattedDate}
        </p>
      </div>
    </div>
  );
};

export default Message;