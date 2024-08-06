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
  const [showImageError, setShowImageError] = useState<boolean>(false);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (showWarning || showImageError) {
      timer = setTimeout(() => {
        setShowWarning(false);
        setShowImageError(false);
      }, 5000);
    }

    return () => clearTimeout(timer);
  }, [showWarning, showImageError]);

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
        `https://cookie-rest-api-8fnl.onrender.com/api/chat/messages/${chatId}/messages`,
        formData,
        {
          headers: {
            "x-access-token": token,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      setMessage("");
      setSelectedImage(null);
      setImagePreview(null);

      if (response) {
        // console.log("Message sent successfully");
      } else {
        console.error("Failed to send message:", response);
      }
    } catch (error: any) {
      console.error(
        "Error sending message:",
        error.response?.data || error.message,
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
      const validImageTypes = ["image/jpeg", "image/png", "image/gif"];

      if (!validImageTypes.includes(file.type)) {
        setShowImageError(true);

        return;
      }

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
            <Avatar
              isBordered
              aria-label="Selected Image Preview"
              radius="lg"
              src={imagePreview}
            />
          </div>
        )}
        <Input
          className="flex-grow h-[50px]"
          color={showWarning ? "danger" : "default"}
          id="messageInput"
          label="Enter your message"
          type="text"
          value={message}
          variant="bordered"
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
        />
        <Button
          className="w-full max-w-[20px] flex-shrink-0 h-[50px]"
          color="danger"
          disabled={isSending || (!message.trim() && !selectedImage)}
          variant="ghost"
          onClick={sendMessage}
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
              <form className="cursor-pointer">
                <label htmlFor="imageInput">
                  .
                  <BiImageAdd className="text-2xl" />
                </label>
                <input
                  accept="image/*"
                  id="imageInput"
                  style={{ display: "none" }}
                  type="file"
                  onChange={handleImageChange}
                />
              </form>
            </Tooltip>
          )}
        </div>
      </div>
      {showWarning && (
        <p className="text-[#dd2525] p-2">
          Please enter a message or add an image.
        </p>
      )}
      {showImageError && (
        <p className="text-[#dd2525] p-2">
          Invalid file type. Please upload an image.
        </p>
      )}
    </div>
  );
};

export default CreateMessage;
