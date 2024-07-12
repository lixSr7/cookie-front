"use client";

// Componets
import { UploadCloud as CloudIcon } from "@geist-ui/icons";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
  Avatar,
  Textarea,
  Spinner,
} from "@nextui-org/react";
import { useState, ChangeEvent, useEffect } from "react";
import { createPost } from "@/services/Posts";
import { useAuthStore } from "@/app/context/useAuthSrored";
import { userToken } from "@/types/Users";
import { toast } from "sonner";

const UploaderImagePost = () => {
  const [image, setImage] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string>("Not Select file");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setImage(URL.createObjectURL(file));
      // console.log(image);
    }
  };

  return (
    <article>
      <label
        htmlFor="imageInput"
        className="flex flex-col items-center justify-center overflow-hidden border-2 border-blue-500 border-dashed cursor-pointer rounded-xl h-60"
      >
        {image ? (
          <img
            className="object-cover w-full h-full"
            src={image}
            alt="Imagen de Publicacion"
          />
        ) : (
          <CloudIcon className="w-20 h-20 stroke-blue-500" />
        )}
        <input
          id="imageInput"
          name="Image"
          onChange={handleImageChange}
          type="file"
          accept="image/*"
          className="hidden inputImageCreatePost"
        />
      </label>
    </article>
  );
};

export function CreatePost({ updatePosts }: { updatePosts: () => void }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isContentInvalid, setIsContentInvalid] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const handleSubmit = async (content: string, imageFile?: File | null) => {
    try {
      setIsSending(true);
      await createPost(content, imageFile, token);
      updatePosts();
      toast.success('success creating post')
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      toast.error('Error creating comment')
    } finally {
      setIsSending(false);
    }
  };

  return (
    <article className="w-full px-4 max-w-[750px] gap-4 flex flex-col">
      <div className="flex gap-4 justify-between items-center bg-white py-4 px-6 rounded-md basis-[100%] border-2 dark:bg-zinc-900 dark:border-zinc-800">
        <Avatar
          isBordered
          color="danger"
          src="https://www.los40.do/wp-content/uploads/2023/10/16880295953133-e1696339269651-300x300.jpeg"
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

                  const imageInput = document.querySelector(
                    ".inputImageCreatePost"
                  ) as HTMLInputElement;
                  const imageFile = imageInput.files?.[0];

                  handleSubmit(content, imageFile);
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
                    />
                  ) : (
                    <>
                      <Textarea
                        name="Content"
                        required
                        variant="faded"
                        label="¿Que estas pensando?"
                        placeholder="Hi, I am cookie"
                        className="max-w-s"
                        maxLength={250}
                        isInvalid={isContentInvalid}
                        errorMessage="El campo no puede estar vacio"
                      />

                      <UploaderImagePost />
                    </>
                  )}
                </ModalBody>
                <ModalFooter className="flex flex-col ">
                  <div className="flex justify-end gap-4">
                    <Button color="primary" type="submit">
                      Submit
                    </Button>
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
