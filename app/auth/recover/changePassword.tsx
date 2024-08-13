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

export function ChangePassword({
  isOpen: isOpen,
  onOpenChange,
  token2,
}: {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  token2: string;
}) {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleChangePassword = async () => {
    try {
      const response = await fetch(
        "https://rest-api-cookie-u-c.onrender.com/api/auth/changePassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "reset-pass-token": token2,
          },
          body: JSON.stringify({
            password,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        setMessage(data.message);
        onOpenChange(false);
      } else {
        console.error("Error al cambiar la contraseña:", await response.text());
        throw new Error("Error al cambiar la contraseña");
      }
    } catch (error) {
      console.error("Error al cambiar la contraseña:", error);
    }
  };

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Change Password
              </ModalHeader>
              <ModalBody>
                <Input
                  required
                  placeholder="Enter your new password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  required
                  placeholder="Confirm your new password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  {" "}
                  Close{" "}
                </Button>
                <Button color="primary" onClick={handleChangePassword}>
                  {" "}
                  Change Password{" "}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
