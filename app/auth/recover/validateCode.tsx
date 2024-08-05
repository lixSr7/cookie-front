"use client";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@nextui-org/react";
import React, { useState } from "react";
import { ChangePassword } from "../recover/changePassword";
import { useDisclosure } from "@nextui-org/react";


interface ValidateCodeSendProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  token: string;
}

export function ValidateCodeSend({
  isOpen,
  onOpenChange,
  token,
}: ValidateCodeSendProps) {
  const {
    isOpen: isChangePasswordOpen,
    onOpen: onChangePasswordOpen,
    onOpenChange: onChangePasswordOpenChange,
  } = useDisclosure();
  const [code, setCode] = useState<string>("");
  const [token2, setToken2] = useState<string>("");

  const handleValidateCode = async () => {
    try {
      const response = await fetch(
        "https://cookie-rest-api-8fnl.onrender.com/api/auth/validate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "reset-pass-token": token,
          },
          body: JSON.stringify({ code }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setToken2(data.token);
        alert("Código validado correctamente");
        onOpenChange(false);
        onChangePasswordOpen();
      } else {
        console.error(
          "Error al validar el código de recuperación:",
          await response.text()
        );
        throw new Error("Error al validar el código de recuperación");
      }
    } catch (error) {
      console.error("Error al validar el código de recuperación:", error);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Validate Code
              </ModalHeader>
              <ModalBody>
                <Input type="text" placeholder="Enter code sent by email" value={code} onChange={(e) => setCode(e.target.value)} required />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button onClick={handleValidateCode} color="primary">
                  Validate Code
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
      <ChangePassword isOpen={isChangePasswordOpen} onOpenChange={onChangePasswordOpenChange} token2={token2} />
    </>
  );
}
