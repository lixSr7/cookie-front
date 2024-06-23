"use client"
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from '@nextui-org/react';
import React, { useState } from 'react';
import { ChangePassword } from "../changePassword/page";
import { useDisclosure } from "@nextui-org/react";

export function ValidateCodeSend({ isOpen, onOpenChange, token }) {
    const { isOpen: isChangePasswordOpen, onOpen: onChangePasswordOpen, onOpenChange: onChangePasswordOpenChange } = useDisclosure();
    const [code, setCode] = useState('');
    const [token2, setToken2] = useState('');

    const handleValidateCode = async () => {
        try {
            const response = await fetch('https://co-api-vjvb.onrender.com/api/auth/validate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'reset-pass-token': token
                },
                body: JSON.stringify({
                    code: code
                }),
            });

            if (response.ok) {
                const data = await response.json();
                setToken2(data.token);
                alert('código validado correctamente');
                onOpenChange(false);
                onChangePasswordOpen();
            } else {
                console.error("Error al validar el código de recuperación:", await response.text());
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
                            <ModalHeader className="flex flex-col gap-1">Validate Code</ModalHeader>
                            <ModalBody>
                                <Input type="text" placeholder="Enter code sent by email" value={code} onChange={(e) => setCode(e.target.value)} required />
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}> Close </Button>
                                <Button onClick={handleValidateCode} color="primary"> Validate Code </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <ChangePassword isOpen={isChangePasswordOpen} onOpenChange={onChangePasswordOpenChange} token2={token2} />
        </>
    );
}
