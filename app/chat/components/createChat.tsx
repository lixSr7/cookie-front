import React, { useState, useEffect } from "react";
import { IoChatboxEllipsesOutline } from "react-icons/io5";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
} from "@nextui-org/react";
import { jwtDecode } from "jwt-decode";

import SearchUsers from "@/app/user/components/SearchUsers";

interface User {
  _id: string;
  username: string;
  role: { _id: string; name: string };
}

interface DecodedToken {
  id: string;
}

const CreateChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const [id, setId] = useState<string>("");
  const [chatName, setChatName] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decodedToken = jwtDecode<DecodedToken>(storedToken);

      setId(decodedToken.id);
    }
  }, []);

  const handleUserSelect = (user: User) => {
    setSelectedUsers((prevUsers) => {
      const isSelected = prevUsers.some(
        (selectedUser) => selectedUser._id === user._id
      );

      if (isSelected) {
        return prevUsers.filter(
          (selectedUser) => selectedUser._id !== user._id
        );
      } else {
        return [...prevUsers, user];
      }
    });
  };

  const createChat = async () => {
    if (selectedUsers.length > 1 && !chatName) {
      alert("Please provide a name for the group chat.");

      return;
    }

    const usersToSend = [...selectedUsers.map((user) => user._id), id];

    try {
      const response = await fetch(
        "https://rest-api-cookie-u-c.onrender.com/api/chat/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": localStorage.getItem("token") || "",
          },
          body: JSON.stringify({
            name: selectedUsers.length > 1 ? chatName : "",
            users: usersToSend,
          }),
        }
      );

      if (response.ok) {
        clearFields();
      } else {
        const errorText = await response.text();

        console.error("Error al crear el chat:", errorText);
      }
    } catch (error) {
      console.error("Error al crear el chat:", error);
    }

    handleToggleModal();
  };

  const clearFields = () => {
    setSelectedUsers([]);
    setSearchTerm("");
    setChatName("");
  };

  const handleToggleModal = () => {
    setIsOpen(!isOpen);
    if (isOpen) clearFields();
  };

  return (
    <section>
      <button
        className="flex justify-center items-center w-12 h-10 hover:bg-neutral-300 dark:hover:bg-zinc-600 hover:transition-transform-background rounded-md cursor-pointer border-none outline-none"
        onClick={handleToggleModal}
      >
        <IoChatboxEllipsesOutline />
      </button>

      <Modal isOpen={isOpen} onClose={handleToggleModal}>
        <ModalContent>
          <ModalHeader className="flex flex-col gap-1">Create Chat</ModalHeader>
          <ModalBody>
            <SearchUsers
              searchTerm={searchTerm}
              selectedUsers={selectedUsers}
              setSearchTerm={setSearchTerm}
              onUserSelect={handleUserSelect}
            />
            {selectedUsers.length > 1 && (
              <Input
                required
                label="Group Chat Name"
                labelPlacement="outside"
                placeholder="Group Chat Name"
                radius="lg"
                value={chatName}
                onChange={(e) => setChatName(e.target.value)}
              />
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleToggleModal}>Close</Button>
            <Button onClick={createChat}>Create Chat</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </section>
  );
};

export default CreateChat;
