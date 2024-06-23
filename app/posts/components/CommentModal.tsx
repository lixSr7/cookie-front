import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  button,
  Input,
} from "@nextui-org/react";
import { Send as SendIcon, MessageCircle as MessageIcon } from "@geist-ui/icons";
import CreateComment from "./CreateComment";
import ListComments from "./ListComments";
import { useEffect, useState } from "react";
import { Comment as CommentType } from "@/interfaces/Post";
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
        size="lg"
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
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
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Comments
              </ModalHeader>
              <ModalBody>
                <ListComments updateComments={allComments} postId={postId} comments={comments} />
              </ModalBody>
              <ModalFooter className="flex items-center justify-between">
                <CreateComment updateComment={allComments} postId={postId} />
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default CommentModal;
