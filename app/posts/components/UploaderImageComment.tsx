"use client";
import { UploadCloud as CloudIcon } from "@geist-ui/icons";
import { useState, ChangeEvent } from "react";

interface UploaderImageCommentProps {
  setImage: React.Dispatch<React.SetStateAction<File | undefined>>;
  image: File | undefined;
}

/**
 * Componente para subir imágenes en los comentarios.
 *
 * @param {UploaderImageCommentProps} props - Props del componente.
 * @returns {JSX.Element} - Componente JSX.
 */
const UploaderImageComment: React.FC<UploaderImageCommentProps> = ({
  setImage,
  image,
}) => {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setImage(file); // Actualiza el archivo de imagen

        setPreviewUrl(imageUrl); // Genera la URL de previsualización
        setError(null);
      } else {
        setImage(undefined);
        setPreviewUrl(null);
        setError("Por favor, selecciona una imagen válida.");
      }
    }
  };

  return (
    <article>
      <label
        className="flex flex-col items-center justify-center overflow-hidden border-2 border-dashed cursor-pointer rounded-xl h-12 w-12"
        htmlFor="imageInputComment"
      >
        <input
          accept="image/*"
          className="hidden inputImageCreateComment"
          id="imageInputComment"
          name="Image"
          type="file"
          onChange={handleImageChange}
        />
        {previewUrl ? (
          <img
            alt="Previsualización de Imagen"
            className="object-cover w-full h-full"
            src={previewUrl}
          />
        ) : (
          <>
            <CloudIcon className="w-5 h-5 stroke-[#dd2525]" />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </>
        )}
      </label>
    </article>
  );
};

export default UploaderImageComment;
