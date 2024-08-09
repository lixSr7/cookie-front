import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";
import { MessageCircle as MessageIcon } from "@geist-ui/icons";
import { useEffect, useState } from "react";

import CreateComment from "./CreateComment";
import Comments from "./ListComments";

import { Comment as CommentType } from "@/types/Post";
import { getAllComments } from "@/services/Posts";

function CommentModal({ postId }: { postId: string }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [comments, setComments] = useState<CommentType[]>([]);

  useEffect(() => {
    allComments();
  }, []);

  const allComments = async () => {
    try {
      const commentsData = await getAllComments(postId).then((commentsData) => {
        setComments(commentsData.reverse());
      });
    } catch (error) {
      console.error("Error fetching Comments:", error);
    }
  };

  return (
    <>
      <button onClick={onOpen}>
        <MessageIcon className="w-6 h-6 cursor-pointer opacity-60" />
      </button>
      <Modal
        backdrop="blur"
        isOpen={isOpen}
        motionProps={{
          variants: {
            enter: {
              y: 0,
              opacity: 1,
              transition: {
                duration: 0.3,
                ease: "easeOut",
              },
            },
            exit: {
              y: -20,
              opacity: 0,
              transition: {
                duration: 0.2,
                ease: "easeIn",
              },
            },
          },
        }}
        size="lg"
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Comments
              </ModalHeader>
              <ModalBody>
                <Comments
                  comments={comments}
                  postId={postId}
                  updateComments={allComments}
                />
              </ModalBody>
              <ModalFooter className="flex items-center justify-between">
                <CreateComment postId={postId} updateComment={allComments} />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CommentModal;
