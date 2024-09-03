import {
  Button,
  Tooltip,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";

import { AlertCircle as AlertIcon } from "@geist-ui/icons";
import { getReportedPosts } from "@/services/Posts";
import { Post } from "@/types/Post";
import { useEffect, useState } from "react";
import CardPostReported from "./CardPostReported";

function ButtonReports() {
  const [isSending, setIsSending] = useState(false);
  const [data, setdata] = useState<Post[]>([]);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const fechData = () => {
    getReportedPosts()
      .then((data: Post[]) => {
        setdata(data);
        console.log(data);
      })
      .catch((error) => {
        console.error("Failed to fetch posts:", error);
      });
  };

  useEffect(() => {
    fechData();
  }, []);

  return (
    <div>
      <Button onPress={onOpen} color="danger" startContent={<AlertIcon />}>
        Reports
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 m-auto">
                Reports
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
                    <CardPostReported />
                  </div>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
}

export default ButtonReports;
