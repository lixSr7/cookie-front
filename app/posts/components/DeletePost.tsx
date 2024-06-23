import { deletePost } from "@/services/Posts";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
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
  const handleDelete = async (onClose: () => void) => {
    await deletePost(postId)
      .then(() => {
        updatePosts();
        toast.success("post deleted success");
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
        toast.error("post could not be deleted");
      });
    onClose();
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
                <Button
                  onClick={() => {
                    handleDelete(onClose);
                  }}
                  color="danger"
                  variant="shadow"
                >
                  Delete
                </Button>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeletePost;
