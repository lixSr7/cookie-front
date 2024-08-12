import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  cn,
  DropdownSection,
  Modal,
  ModalHeader,
  ModalBody,
  useDisclosure,
  ModalContent,
  Spinner,
} from "@nextui-org/react";

import {
  Plus as AddNoteIcon,
  Copy as CopyDocumentIcon,
  Edit as EditDocumentIcon,
} from "@geist-ui/icons";
import { Archive as DeleteDocumentIcon } from "@geist-ui/icons";

import { ConfigIcon } from "@/components/Icons";

import { useState } from "react";
import { toast } from "sonner";
import { deletePost } from "@/services/Posts";
import AnalyticsPosts from "./AnalyticsPosts";

const ACTIONS: { [key: string]: string } = {
  ANALYTICS: "ANALYTICS",
  COPY: "COPY",
  REPORT: "REPORT",
  DELETE: "DELETE",
};

const FormReport = () => {
  return <div>FormReport</div>;
};

const Actions = ({
  action,
  postId,
  updatePosts,
  onClose,
}: {
  action: string;
  postId: string;
  updatePosts: () => void;
  onClose: () => void;
}) => {
  const [isSending, setIsSending] = useState(false);

  const handleDeletePost = async (onClose: () => void) => {
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

  switch (action) {
    case ACTIONS.DELETE:
      return (
        <Button
          color="danger"
          isDisabled={isSending}
          isLoading={isSending}
          onClick={() => handleDeletePost(onClose)}
        >
          Delete
        </Button>
      );
    case ACTIONS.COPY:
      return <Button>Copy link</Button>;
    case ACTIONS.ANALYTICS:
      return <AnalyticsPosts />;
    case ACTIONS.REPORT:
      return <FormReport />;
    default:
      return null;
  }
};

function OptionsPosts({
  postId,
  updatePosts,
}: {
  postId: string;
  updatePosts: () => void;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [action, setaction] = useState("");
  const [isSending, setIsSending] = useState(false);

  return (
    <>
      <Dropdown
        showArrow
        classNames={{
          base: "before:bg-default-200",
          content:
            "py-1 px-1 border border-default-200 bg-gradient-to-br from-white to-default-200 dark:from-default-50 dark:to-black",
        }}
      >
        <DropdownTrigger>
          <Button isIconOnly variant="bordered">
            <ConfigIcon className="w-6 h-6 opacity-60" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu
          variant="faded"
          aria-label="Dropdown menu with description"
        >
          <DropdownSection title="Actions">
            <DropdownItem
              onClick={() => {
                setaction(ACTIONS.ANALYTICS);
                onOpen();
              }}
              key="new"
              shortcut="⌘N"
              description="Create a new file"
              startContent={<AddNoteIcon />}
            >
              Analitics
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setaction(ACTIONS.COPY);
                onOpen();
              }}
              key="copy"
              shortcut="⌘C"
              description="Copy the file link"
              startContent={<CopyDocumentIcon />}
            >
              Copy link
            </DropdownItem>
          </DropdownSection>
          <DropdownSection title="Danger zone">
            <DropdownItem
              onClick={() => {
                setaction(ACTIONS.REPORT);
                onOpen();
              }}
              key="report"
              shortcut="⌘⇧E"
              description="Report the post"
              startContent={<EditDocumentIcon />}
            >
              Report
            </DropdownItem>
            <DropdownItem
              onClick={() => {
                setaction(ACTIONS.DELETE);
                onOpen();
              }}
              key="Delete post"
              className="text-danger"
              color="danger"
              shortcut="⌘⇧D"
              description="Permanently delete the post"
              startContent={
                <DeleteDocumentIcon className={cn("", "text-danger")} />
              }
            >
              Delete
            </DropdownItem>
          </DropdownSection>
        </DropdownMenu>
      </Dropdown>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 m-auto">
                {action === ACTIONS.REPORT
                  ? "Report post"
                  : action === ACTIONS.DELETE
                  ? "Do you want to delete this post?"
                  : action === ACTIONS.COPY
                  ? "Copy link"
                  : "Analitics"}
              </ModalHeader>
              <ModalBody>
                {isSending ? (
                  <Spinner
                    className="w-full h-full flex items-center justify-center"
                    color="primary"
                    label="Deleting..."
                    labelColor="primary"
                  />
                ) : (
                  <div className="grid w-full h-full min-h-52 place-content-center">
                    <Actions
                      action={action}
                      postId={postId}
                      updatePosts={updatePosts}
                      onClose={onClose}
                    />
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default OptionsPosts;
