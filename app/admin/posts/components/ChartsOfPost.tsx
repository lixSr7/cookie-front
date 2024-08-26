import {
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@nextui-org/react";

import { PieChart as PieIcon } from "@geist-ui/icons";
import { UserWithPosts as typeUser } from "@/types/Post";
import { getPostAnalytics } from "@/services/Posts";

export default function ChartsOfPost({ user }: { user: typeUser }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <div>
      <Tooltip content="Charts of Posts">
        <Button onPress={onOpen}>
          <PieIcon className=" w-5 h-5 opacity-65" />
        </Button>
      </Tooltip>
      <Modal backdrop="blur" isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                graphs of user posts {user.username}
              </ModalHeader>
              <ModalBody>
                <Charts userId={user.id} />
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
                <Button color="primary" onPress={onClose}>
                  Action
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

function Charts({ userId }: { userId: string }) {
  return <div></div>;
}
