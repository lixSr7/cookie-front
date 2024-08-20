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
import { toast } from "sonner";

import UploaderImagePost from "./UploaderImagePost";

import { createPost } from "@/services/Posts";
import socket from "@/app/config/socketConfig";

/**
 * Propiedades para el componente CreatePost.
 *
 * @typedef {Object} CreatePostProps
 * @property {() => void} updatePosts - Función para actualizar la lista de publicaciones.
 */
export function CreatePost({ updatePosts }: { updatePosts: () => void }) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isContentInvalid, setIsContentInvalid] = useState(false);
  const [errorContent, setErrorContent] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [token, setToken] = useState("");
  const [image, setImage] = useState<string | null>(null); //? Estado para la imagen
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
      resetForm();
    }
  }, [isOpen]);

  useEffect(() => {
    socket.connect();

    socket.on("userUpdate", async (data) => {
      await getMyProfile(token);
    });

    return () => {
      socket.off("userUpdate");
    };
  }, [token]);

  /**
   * Obtiene el perfil del usuario.
   *
   * @param {string} token - Token de autenticación del usuario.
   */
  const getMyProfile = async (token: string) => {
    try {
      const response = await fetch(
        "https://rest-api-cookie-u-c.onrender.com/api/profile",
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

  /**
   * Valida el contenido de la publicación.
   *
   * @param {string} content - Contenido de la publicación.
   * @param {boolean} imageIsEmpty - Indica si la imagen está vacía.
   * @returns {boolean} - `true` si el contenido es válido, `false` en caso contrario.
   */
  function validateContent(content: string, imageIsEmpty: boolean) {
    const ERROS_CONTENT = {
      empty: "El contenido no puede estar vacío",
      maxLength: "El contenido no puede ser mayor de 3000 caracteres",
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

  /**
   * Maneja el envío del formulario de creación de publicación.
   *
   * @param {string} content - Contenido de la publicación.
   * @param {File | null} [imageFile] - Archivo de imagen opcional.
   * @param {() => void} [onClose] - Función opcional para cerrar el modal.
   */
  const handleSubmit = async (
    content: string,
    imageFile?: File | null,
    onClose?: () => void
  ) => {
    const imageIsEmpty = !image; // Determina si la imagen está vacía

    if (validateContent(content, imageIsEmpty)) {
      try {
        setIsSending(true);
        await createPost(content, imageFile, token);
        updatePosts();
        toast.success("Publicación creada exitosamente");
      } catch (error) {
        console.error("Error en handleSubmit:", error);
        toast.error("Error al crear la publicación");
      } finally {
        setIsSending(false);
        onClose?.();
      }
    }
  };

  /**
   * Restablece el formulario de creación de publicación.
   */
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
          className="w-full py-3 pl-4 font-semibold text-left rounded-md bg-slate-200 dark:bg-zinc-800 dark:text-zinc-200"
          onClick={onOpen}
        >
          Create the best idea
        </button>
        <Modal
          backdrop="blur"
          isDismissable={false}
          isOpen={isOpen}
          placement="center"
          onOpenChange={onOpenChange}
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

                  handleSubmit(content, imageFile, onClose);
                }}
              >
                <ModalHeader className="flex flex-col gap-1">
                  Create the best idea
                </ModalHeader>
                <ModalBody>
                  {isSending ? (
                    <Spinner
                      className="w-full h-full flex items-center justify-center"
                      color="primary"
                      label="Cargando..."
                      labelColor="primary"
                    />
                  ) : (
                    <>
                      <Textarea
                        className="max-w-s"
                        errorMessage={errorContent}
                        isInvalid={isContentInvalid}
                        label="What do you have in mind?"
                        maxLength={3000}
                        name="Content"
                        placeholder="Hi, I am cookie"
                        variant="faded"
                      />

                      <UploaderImagePost image={image} setImage={setImage} />
                    </>
                  )}
                </ModalBody>
                <ModalFooter className="flex flex-col ">
                  <div className="flex justify-end gap-4">
                    {isSending || (
                      <Button className="bg-[#dd2525]" type="submit">
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
