import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  Input,
  ScrollShadow,
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import { TbArrowBackUp } from "react-icons/tb";
import { jwtDecode } from "jwt-decode";

import CreateChat from "./components/createChat";
import ChatList from "./components/chatList";
import Messages from "./components/messageList";
import CreateMessage from "./components/createMessage";

interface PageChatProps {
  isOpen: boolean;
  onClose: () => void;
}

interface DecodedToken {
  id: string;
}

const PageChat: React.FC<PageChatProps> = ({ isOpen, onClose }) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"chatList" | "messages">("chatList");
  const idChat = selectedChat || "1234";
  const [id, setId] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [windowWidth, setWindowWidth] = useState<number>(0);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decodedToken = jwtDecode<DecodedToken>(storedToken);

      setId(decodedToken.id);
    }
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  useEffect(() => {
    if (windowWidth <= 789) {
      setViewMode("chatList");
    } else {
      setViewMode("messages");
    }
  }, [windowWidth]);

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={onClose}
      size="5xl"
      className="bg-gray-100 dark:bg-zinc-800"
    >
      <ModalContent
        className={`${
          windowWidth <= 789
            ? "flex items-center justify-center min-h-screen"
            : ""
        }`}
      >
        <ModalBody>
          <article className="flex p-4 h-full max-h-[500px] dark:bg-zinc-800 relative ">
            {windowWidth <= 789 ? (
              <>
                {viewMode === "chatList" && (
                  <section
                    className="flex flex-col w-full h-full max-h-[750px] min-h-[700px]
                  
                  bg-white dark:bg-zinc-800 shadow-lg rounded-md p-4">
                    <div className="flex justify-center gap-2 mb-4 dark:bg-zinc-800">
                      <Input
                        labelPlacement="outside"
                        placeholder="Type to search..."
                        radius="lg"
                        startContent={
                          <CiSearch className="flex-shrink-0 text-2xl pointer-events-none text-default-400" />
                        }
                        value={searchTerm}
                        onChange={handleSearchChange}
                      />
                      <CreateChat />
                    </div>

                    <ChatList
                      searchTerm={searchTerm}
                      onSelectChat={(chatId) => {
                        setSelectedChat(chatId);
                        setViewMode("messages");
                      }}
                    />
                  </section>
                )}
                {viewMode === "messages" && (
                  <section className="flex flex-col w-full h-full max-h-[450px] bg-white dark:bg-zinc-800 shadow-lg rounded-md p-4">
                    <ScrollShadow hideScrollBar className="w-full h-full mb-4">
                      <div className="flex-grow overflow-y-auto">
                        <Messages selectedChat={selectedChat} />
                      </div>
                    </ScrollShadow>
                    <div className="w-full">
                      <CreateMessage chatId={idChat} userId={id} />
                    </div>
                  </section>
                )}
              </>
            ) : (
              <>
                <section className="flex flex-col w-full max-w-[300px] h-full max-h-[450px] min-h-[400px] bg-white dark:bg-zinc-800 shadow-lg rounded-md p-4">
                  <div className="flex justify-center gap-2 mb-4">
                    <Input
                      labelPlacement="outside"
                      placeholder="Chat to search..."
                      radius="lg"
                      startContent={
                        <CiSearch className="flex-shrink-0 text-2xl pointer-events-none text-default-400" />
                      }
                      value={searchTerm}
                      onChange={handleSearchChange}
                    />
                    <CreateChat />
                  </div>
                  <ScrollShadow
                    hideScrollBar
                    className="flex flex-col justify-center w-full h-full m-auto overflow-y-auto"
                  >
                    <ChatList
                      searchTerm={searchTerm}
                      onSelectChat={(chatId) => {
                        setSelectedChat(chatId);
                        setViewMode("messages");
                      }}
                    />
                  </ScrollShadow>
                </section>
                <section className="flex flex-col flex-grow h-full max-h-[450px] bg-white dark:bg-zinc-800 shadow-lg rounded-md p-4 ml-2">
                  <ScrollShadow hideScrollBar className="w-full h-full mb-4">
                    <div className="flex-grow overflow-y-auto">
                      <Messages selectedChat={selectedChat} />
                    </div>
                  </ScrollShadow>
                  <div className="w-full">
                    <CreateMessage chatId={idChat} userId={id} />
                  </div>
                </section>
              </>
            )}
            {windowWidth <= 500 && viewMode === "messages" && (
              <div className="absolute p-2 bg-gray-300 dark:bg-zinc-800 rounded-lg cursor-pointer top-6 left-6 hover:bg-gray-400">
                <TbArrowBackUp
                  onClick={() => setViewMode("chatList")}
                  className="text-gray-600 transition-colors rounded-lg hover:text-gray-800"
                />
              </div>
            )}
          </article>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PageChat;
