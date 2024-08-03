import { useDisclosure } from "@nextui-org/react";
import { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner,
  Textarea,
} from "@nextui-org/react";
import { createPost } from "@/services/Posts";
import { toast } from "sonner";
import UploaderImagePost from "./UploaderImagePost";
import socket from "@/app/config/socketConfig";

export function CreatePost({ updatePosts }: { updatePosts: () => void }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isContentInvalid, setIsContentInvalid] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [token, setToken] = useState("");
  const [image, setImage] = useState<string | null>(null); // State for image
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      getMyProfile(storedToken);
    }
  }, []);

  useEffect(() => {
    if (!isOpen) {
      resetForm(); // Reset the form when modal is closed
    }
  }, [isOpen]);

  useEffect(() => {
    socket.connect();

    socket.on('userUpdate', async (data) => {
      await getMyProfile(token);
    });

    return () => {
      socket.off('userUpdate');
    };
  }, [token]);

  const getMyProfile = async (token: string) => {
    try {
      const response = await fetch(
        "https://cookie-rest-api-8fnl.onrender.com/api/profile",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-access-token": token,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUser(data);
      } else {
        console.error("Error:", await response.text());
      }
    } catch (error) {
      console.error("Error al obtener el perfil:", error);
    }
  };

  function validateContent(content: string, imageIsEmpty: boolean) {
    const ERROS_CONTENT = {
      empty: "The content cannot be empty",
      maxLength: "The content cannot be longer than 3000 characters",
    };

    if (content.trim() === "" && imageIsEmpty) {
      setIsContentInvalid(true);
      setErrorContent(ERROS_CONTENT.empty);
      console.error("Error:", ERROS_CONTENT.empty);
      return false;
    } else if (content.trim().length > 3000) {
      setIsContentInvalid(true);
      setErrorContent(ERROS_CONTENT.maxLength);
      console.error("Error:", ERROS_CONTENT.maxLength);
      return false;
    }
    return true;
  }

  const handleSubmit = async (
    content: string,
    imageFile?: File | null,
    onClose?: () => void
  ) => {
    const imageIsEmpty = !image; // Determine if image is empty
    if (validateContent(content, imageIsEmpty)) {
      try {
        setIsSending(true);
        await createPost(content, imageFile, token);
        updatePosts();
        toast.success("Success creating post");
      } catch (error) {
        console.error("Error in handleSubmit:", error);
        toast.error("Error creating post");
      } finally {
        setIsSending(false);
        onClose?.();
      }
    }
  };

  const resetForm = () => {
    setImage(null);
    setIsContentInvalid(false);
    setErrorContent("");
  };

  return (
    <article className="w-full px-4 max-w-[750px] gap-4 flex flex-col">
      <div className="flex gap-4 justify-between items-center bg-white py-4 px-6 rounded-md basis-[100%] border-2 dark:bg-zinc-900 dark:border-zinc-800">
        <Avatar
          isBordered
          color="danger"
          src={user?.image?.secure_url || "https://via.placeholder.com/150"}
        />

        <button
          onClick={onOpen}
          className="w-full py-3 pl-4 font-semibold text-left rounded-md bg-slate-200 dark:bg-zinc-800 dark:text-zinc-200"
        >
          Create the best idea
        </button>
        <Modal
          isOpen={isOpen}
          placement="center"
          onOpenChange={onOpenChange}
          isDismissable={false}
          backdrop="blur"
        >
          <ModalContent>
            {(onClose) => (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const contentInput = e.currentTarget.elements.namedItem(
                    "Content"
                  ) as HTMLTextAreaElement;
                  const content = contentInput.value;

                  // console.log("content:", content);

                  const imageInput = document.querySelector(
                    ".inputImageCreatePost"
                  ) as HTMLInputElement;
                  const imageFile = imageInput.files?.[0];

                  handleSubmit(content, imageFile, onClose);
                }}
              >
                <ModalHeader className="flex flex-col gap-1">
                  Create Posts
                </ModalHeader>
                <ModalBody>
                  {isSending ? (
                    <Spinner
                      label="Loading..."
                      color="primary"
                      labelColor="primary"
                      className="w-full h-full flex items-center justify-center"
                    />
                  ) : (
                    <>
                      <Textarea
                        name="Content"
                        variant="faded"
                        label="What's on your mind?"
                        placeholder="Hi, I am cookie"
                        className="max-w-s"
                        maxLength={3000}
                        isInvalid={isContentInvalid}
                        errorMessage={errorContent}
                      />

                      <UploaderImagePost setImage={setImage} image={image} />
                    </>
                  )}
                </ModalBody>
                <ModalFooter className="flex flex-col ">
                  <div className="flex justify-end gap-4">
                    {isSending || (
                      <Button color="primary" type="submit">
                        Submit
                      </Button>
                    )}
                  </div>
                </ModalFooter>
              </form>
            )}
          </ModalContent>
        </Modal>
      </div>
    </article>
  );
}
