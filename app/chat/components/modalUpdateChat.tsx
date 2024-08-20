import React, { useState, useEffect } from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Input,
  Avatar,
  Tooltip,
} from "@nextui-org/react";
import { MdOutlineEdit } from "react-icons/md";
import updateChat from "./updateChat";
import SearchUsers from "@/app/user/components/SearchUsers";

interface User {
  _id: string;
  username: string;
}

interface UpdateChatFormProps {
  chatId: string;
  token: string;
  onUpdate: () => void;
  onClose: () => void;
  initialName: string;
  initialUsers: User[];
}

const UpdateChatForm: React.FC<UpdateChatFormProps> = ({
  chatId,
  token,
  onUpdate,
  onClose,
  initialName,
  initialUsers,
}) => {
  const [name, setName] = useState<string>(initialName);
  const [selectedUsers, setSelectedUsers] = useState<User[]>(initialUsers);
  const [searchTerm, setSearchTerm] = useState<string>("");

  useEffect(() => {
    setName(initialName);
    setSelectedUsers(initialUsers);
  }, [initialName, initialUsers]);

  const hasChanges = () => {
    const nameChanged = name !== initialName;
    const usersChanged =
      selectedUsers.length !== initialUsers.length ||
      selectedUsers.some(
        (user) =>
          !initialUsers.some((initialUser) => initialUser._id === user._id),
      );

    return nameChanged || usersChanged;
  };

  const handleUpdate = async () => {
    if (!hasChanges()) {
      console.log("No changes detected. Update request not sent.");
      return;
    }

    try {
      await updateChat(
        chatId,
        { 
          name,
          addUsers: selectedUsers
            .filter(
              (user) =>
                !initialUsers.some(
                  (initialUser) => initialUser._id === user._id,
                ),
            )
            .map((user) => user._id),
          removeUsers: initialUsers
            .filter(
              (user) =>
                !selectedUsers.some(
                  (selectedUser) => selectedUser._id === user._id,
                ),
            )
            .map((user) => user._id),
        },
        token
      );
      onUpdate();
      onClose();
    } catch (error) {
      console.error("Failed to update chat:", error);
    }
  };

  const handleUserSelect = (user: User) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.some((selectedUser) => selectedUser._id === user._id)
        ? prevSelected.filter((selectedUser) => selectedUser._id !== user._id)
        : [...prevSelected, user]
    );
  };

  return (
    <Modal isOpen={true} placement="top-center" onOpenChange={onClose}>
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">Update Chat</ModalHeader>
        <ModalBody>
          <Input
            label="Chat Name"
            placeholder="Enter the new chat name"
            value={name}
            variant="bordered"
            onChange={(e) => setName(e.target.value)}
          />
          <SearchUsers
            searchTerm={searchTerm}
            selectedUsers={selectedUsers}
            setSearchTerm={setSearchTerm}
            onUserSelect={handleUserSelect}
          />
          <div className="flex flex-wrap mt-4 gap-2">
            {selectedUsers.map(user => (
              <Tooltip key={user._id} content={user.username} placement="bottom">
                <Avatar>
                  {user.username.charAt(0)}
                </Avatar>
              </Tooltip>
            ))}
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="flat" onPress={onClose}>
            Close
          </Button>
          <Button color="primary" onPress={handleUpdate}>
            <MdOutlineEdit /> Update Chat
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default UpdateChatForm;
