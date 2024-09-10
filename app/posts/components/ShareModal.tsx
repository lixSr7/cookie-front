"use client";

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
import { useState } from "react";
import { toast } from "sonner";
import ShareButton from "./ShareButton";
import { repostPost } from "@/services/Posts";

function ShareModal({
  originalPostId,
  updatePosts,
}: {
  originalPostId: string;
  updatePosts: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRepost = async (onClose: () => void) => {
    setIsLoading(true);
    try {
      const response = await repostPost(originalPostId, content);
      console.log("Repost successful:", response);
      toast.success("Repost successful!");
      setContent("");
      updatePosts();
      onClose();
    } catch (error) {
      console.error("Error reposting post:", error);
      toast.error("Failed to repost.");
    } finally {
      setIsLoading(false);
    }
  };

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
                  placeholder="Enter your content"
                  className="w-full"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                />
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  onClick={() => {
                    handleRepost(onClose);
                  }}
                  isLoading={isLoading}
                >
                  Repost
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
