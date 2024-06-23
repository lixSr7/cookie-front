'use client'; 
import React, { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import { ValidateCodeSend } from "./validateCode/page";
import { useDisclosure } from "@nextui-org/react";

interface RecoverProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export default function RECOVER({ isOpen, onOpenChange }: RecoverProps) {
  const {
    isOpen: isValidateOpen,
    onOpen: onValidateOpen,
    onOpenChange: onValidateOpenChange,
  } = useDisclosure();
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const handleSendCode = async () => {
    try {
      const response = await fetch(
        "https://co-api-vjvb.onrender.com/api/auth/recover",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setToken(data.token);
        onOpenChange(false);
        onValidateOpen();
      } else {
        console.error(
          "Error al enviar el código de recuperación:",
          await response.text()
        );
        throw new Error("Error al enviar el código de recuperación");
      }
    } catch (error) {
      console.error("Error al enviar el código de recuperación:", error);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Recover password
              </ModalHeader>
              <ModalBody>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button onClick={handleSendCode} color="primary">
                  Send Code
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ValidateCodeSend
        isOpen={isValidateOpen}
        onOpenChange={onValidateOpenChange}
        token={token}
      />
    </>
  );
}
