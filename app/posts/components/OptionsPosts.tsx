import React from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  cn,
  DropdownSection,
} from "@nextui-org/react";

import {
  Plus as AddNoteIcon,
  Copy as CopyDocumentIcon,
  Edit as EditDocumentIcon,
} from "@geist-ui/icons";
import { Archive as DeleteDocumentIcon } from "@geist-ui/icons";

import { ConfigIcon } from "@/components/Icons";
function OptionsPosts({
  postId,
  updatePosts,
}: {
  postId: string;
  updatePosts: () => void;
}) {
  return (
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
      <DropdownMenu variant="faded" aria-label="Dropdown menu with description">
        <DropdownSection title="Actions">
          <DropdownItem
            key="new"
            shortcut="⌘N"
            description="Create a new file"
            startContent={<AddNoteIcon />}
          >
            New file
          </DropdownItem>
          <DropdownItem
            key="copy"
            shortcut="⌘C"
            description="Copy the file link"
            startContent={<CopyDocumentIcon />}
          >
            Copy link
          </DropdownItem>
          <DropdownItem
            key="edit"
            shortcut="⌘⇧E"
            description="Allows you to edit the file"
            startContent={<EditDocumentIcon />}
          >
            Edit file
          </DropdownItem>
        </DropdownSection>
        <DropdownSection title="Danger zone">
          <DropdownItem
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
  );
}

export default OptionsPosts;
