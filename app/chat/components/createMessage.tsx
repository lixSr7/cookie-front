import React, { useState, useEffect } from "react";
import { Input, Button, Avatar, Spinner, Tooltip } from "@nextui-org/react";
import { BiImageAdd } from "react-icons/bi";
import { LuImageMinus } from "react-icons/lu";
import { GoPaperAirplane } from "react-icons/go";
import axios from "axios";

interface CreateMessageProps {
  chatId: string;
  userId: string;
}

const CreateMessage: React.FC<CreateMessageProps> = ({ chatId }) => {
  const [message, setMessage] = useState<string>("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [showWarning, setShowWarning] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showWarning) {
      timer = setTimeout(() => {
        setShowWarning(false);
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [showWarning]);

  const sendMessage = async () => {
    if (!message.trim() && !selectedImage) {
      setShowWarning(true);
      return;
    }

    setIsSending(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        setIsSending(false);
        return;
      }

      const formData = new FormData();
      formData.append("content", message);
      if (selectedImage) {
        formData.append("image", selectedImage);
      }

      const response = await axios.post(
        `https://rest-api-cookie-u-c-p.onrender.com/api/chat/messages/${chatId}/messages`,
        formData,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // console.log("Message sent:", response.data);
      setMessage("");
      setSelectedImage(null);
      setImagePreview(null);
    } catch (error: any) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message
      );
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !isSending) {
      e.preventDefault();
      sendMessage();
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
  };

  return (
    <div className="mt-auto">
      <div className="w-full flex md:flex-row gap-4 p-2">
        {imagePreview && (
          <div className="p-2">
            <Avatar isBordered radius="lg" src={imagePreview} />
          </div>
        )}
        <Input
          id="messageInput"
          type="text"
          variant="bordered"
          label="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          className="flex-grow h-[50px]"
          color={showWarning ? "danger" : "default"}
        />
        <Button
          color="danger"
          variant="ghost"
          className="w-full max-w-[20px] flex-shrink-0 h-[50px]"
          onClick={sendMessage}
          disabled={isSending || (!message.trim() && !selectedImage)}
        >
          {isSending ? <Spinner size="sm" /> : <GoPaperAirplane />}
        </Button>
        <div className="flex items-center">
          {selectedImage ? (
            <Tooltip content="Remove Image">
              <div>
                <LuImageMinus
                  className="text-2xl cursor-pointer"
                  onClick={removeImage}
                />
              </div>
            </Tooltip>
          ) : (
            <Tooltip content="Add Image">
              <label htmlFor="imageInput">
                <div>
                  <BiImageAdd className="text-2xl cursor-pointer" />
                </div>
              </label>
            </Tooltip>
          )}
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </div>
      </div>
      {showWarning && (
        <p className="text-[#dd2525] p-2">Please enter a message or add an image.</p>
      )}
    </div>
  );
};

export default CreateMessage;