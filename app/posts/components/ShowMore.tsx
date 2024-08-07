import { Eye } from "@geist-ui/icons";
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Tabs,
  Tab,
  CardBody,
  Card,
} from "@nextui-org/react";

export default function ShowMore() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      <Button
        isIconOnly
        aria-label="Options of Post"
        variant="ghost"
        onPress={onOpen}
      >
        <Eye className="w-5 h-5 opacity-65" />
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
                More data will be here
              </ModalHeader>
              <ModalBody className="grid w-full h-full min-h-52 place-content-center">
                <div className="flex flex-col w-full">
                  <Tabs aria-label="Options">
                    <Tab key="photos" title="Photos">
                      <Card>
                        <CardBody>
                          Lorem ipsum dolor sit amet, consectetur adipiscing
                          elit, sed do eiusmod tempor incididunt ut labore et
                          dolore magna aliqua. Ut enim ad minim veniam, quis
                          nostrud exercitation ullamco laboris nisi ut aliquip
                          ex ea commodo consequat.
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab key="music" title="Music">
                      <Card>
                        <CardBody>
                          Ut enim ad minim veniam, quis nostrud exercitation
                          ullamco laboris nisi ut aliquip ex ea commodo
                          consequat. Duis aute irure dolor in reprehenderit in
                          voluptate velit esse cillum dolore eu fugiat nulla
                          pariatur.
                        </CardBody>
                      </Card>
                    </Tab>
                    <Tab key="videos" title="Videos">
                      <Card>
                        <CardBody>
                          Excepteur sint occaecat cupidatat non proident, sunt
                          in culpa qui officia deserunt mollit anim id est
                          laborum.
                        </CardBody>
                      </Card>
                    </Tab>
                  </Tabs>
                </div>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="primary"
                  onPress={() => {
                    onClose();
                  }}
                >
                  Close
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
