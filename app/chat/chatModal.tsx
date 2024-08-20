import React, { useEffect, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalBody,
  ScrollShadow,
  Input,
} from "@nextui-org/react";
import { CiSearch } from "react-icons/ci";
import { TbArrowBackUp } from "react-icons/tb";

import ChatList from "./components/chatList";
import CreateChat from "./components/createChat";
import Messages from "./components/messageList";
import CreateMessage from "./components/createMessage";
import useWindowWidth from "./hooks/useWindowWidth";
import useAuth from "./hooks/useAuth";

interface PageChatProps {
  isOpen: boolean;
  onClose: () => void;
}

const PageChat: React.FC<PageChatProps> = ({ isOpen, onClose }) => {
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"chatList" | "messages">("chatList");
  const idChat = selectedChat || "1234";
  const [searchTerm, setSearchTerm] = useState<string>("");
  const id = useAuth();
  const windowWidth = useWindowWidth();

  useEffect(() => {
    if (windowWidth <= 789) {
      setViewMode("chatList");
    } else {
      setViewMode("messages");
    }
  }, [windowWidth]);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  if (!isOpen) {
    return null;
  }

  return (
    <Modal
      className="bg-gray-100 dark:bg-zinc-800"
      isOpen={isOpen}
      size="5xl"
      onOpenChange={onClose}
    >
      <ModalContent className=" flex w-full h-full max-h-[600px]">
        <ModalBody>
          <article className="">
            {windowWidth <= 789 ? (
              <>
                {viewMode === "chatList" && (
                  <section className="flex flex-col w-full h-full bg-white dark:bg-zinc-800 shadow-lg rounded-md p-4">
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
                  <section className="flex flex-col w-full h-full bg-white dark:bg-zinc-800 shadow-lg rounded-md p-4">
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
                <section className="">
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
                <section className="">
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
            {windowWidth <= 789 && viewMode === "messages" && (
              <div className="absolute p-2 bg-gray-300 dark:bg-zinc-800 rounded-lg cursor-pointer top-6 left-6 hover:bg-gray-400">
                <TbArrowBackUp
                  className="text-gray-600 transition-colors rounded-lg hover:text-gray-800"
                  onClick={() => setViewMode("chatList")}
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
