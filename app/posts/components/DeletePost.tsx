import { useState } from "react";
import { deletePost } from "@/services/Posts";
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

function DeletePost({
  updatePosts,
  postId,
}: {
  updatePosts: () => void;
  postId: string;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isSending, setIsSending] = useState(false); // State for loading

  const handleDelete = async (onClose: () => void) => {
    setIsSending(true); // Set loading to true
    try {
      await deletePost(postId);
      updatePosts();
      toast.success("Post deleted successfully");
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Post could not be deleted");
    } finally {
      setIsSending(false); // Set loading to false
      onClose();
    }
  };

  return (
    <>
      <Button
        onPress={onOpen}
        isIconOnly
        variant="ghost"
        aria-label="Options of Post"
      >
        <TrashIcon className="w-5 h-5 opacity-65" />
      </Button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        isDismissable={false}
        isKeyboardDismissDisabled={true}
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
                    label="Deleting..."
                    color="primary"
                    labelColor="primary"
                    className="w-full h-full flex items-center justify-center"
                  />
                ) : (
                  <Button
                    onClick={() => handleDelete(onClose)}
                    color="danger"
                    variant="shadow"
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
