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
import {jwtDecode} from "jwt-decode";
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
  const [groupImage, setGroupImage] = useState<File | null>(null); // Estado para la imagen

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

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setGroupImage(e.target.files[0]); // Guardar la imagen seleccionada en el estado
    }
  };

  const createChat = async () => {
    if (selectedUsers.length > 1 && !chatName) {
      alert("Please provide a name for the group chat.");
      return;
    }

    const usersToSend = [...selectedUsers.map((user) => user._id), id];

    // Usar FormData para enviar los datos correctamente
    const formData = new FormData();

    formData.append("name", selectedUsers.length > 1 ? chatName : "");
    formData.append("users", JSON.stringify(usersToSend)); // Serializar el array de usuarios

    // Agregar la imagen del grupo si se ha seleccionado
    if (groupImage) {
      formData.append("image", groupImage);
    }

    // Si se está creando un grupo (más de un usuario seleccionado)
    if (selectedUsers.length > 1) {
      const groupData = {
        participants: selectedUsers.map((user) => user._id), // IDs de los participantes
        admins: [id], // El usuario que crea el chat es el admin
      };

      formData.append("group", JSON.stringify(groupData)); // Enviar el grupo con admins y participants
    }

    try {
      const response = await fetch(
        "https://rest-api-cookie-u-c.onrender.com/api/chat/",
        {
          method: "POST",
          headers: {
            "x-access-token": localStorage.getItem("token") || "",
          },
          body: formData,
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
    setGroupImage(null); // Limpiar la imagen seleccionada
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
              <>
                <Input
                  required
                  label="Group Chat Name"
                  labelPlacement="outside"
                  placeholder="Group Chat Name"
                  radius="lg"
                  value={chatName}
                  onChange={(e) => setChatName(e.target.value)}
                />
                {/* Input para la imagen del grupo */}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="mt-4"
                />
              </>
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
