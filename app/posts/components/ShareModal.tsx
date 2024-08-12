import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Button,
  Textarea,
} from "@nextui-org/react";

import ShareButton from "./ShareButton";

function ShareModal() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <ShareButton onClick={onOpen} />
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Share Post
              </ModalHeader>
              <ModalBody>
                <Textarea
                  label="Content"
                  placeholder="Enter your Content"
                  className="w-full"
                />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default ShareModal;
