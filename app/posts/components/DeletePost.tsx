import { useState } from "react";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { Trash2 as TrashIcon } from "@geist-ui/icons";
import { toast } from "sonner";

import { deletePost } from "@/services/Posts";

function DeletePost({
  updatePosts,
  postId,
}: {
  updatePosts: () => void;
  postId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSending, setIsSending] = useState(false);

  const handleDelete = async (onClose: () => void) => {
    setIsSending(true);
    try {
      await deletePost(postId);
      updatePosts();
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Post could not be deleted");
    } finally {
      setIsSending(false);
      onClose();
    }
  };

  return (
    <>
      <Button
        isIconOnly
        aria-label="Options of Post"
        variant="ghost"
        onPress={onOpen}
      >
        <TrashIcon className="w-5 h-5 opacity-65" />
      </Button>
      <Modal
        isDismissable={false}
        isKeyboardDismissDisabled={true}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col items-center gap-1">
                Do you want to delete this post?
              </ModalHeader>
              <ModalBody className="grid w-full h-full min-h-52 place-content-center">
                {isSending ? (
                  <Spinner
                    className="w-full h-full flex items-center justify-center"
                    color="primary"
                    label="Deleting..."
                    labelColor="primary"
                  />
                ) : (
                  <Button
                    color="danger"
                    variant="shadow"
                    onClick={() => handleDelete(onClose)}
                  >
                    Delete
                  </Button>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeletePost;
