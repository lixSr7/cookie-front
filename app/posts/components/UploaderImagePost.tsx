// UploaderImagePost.tsx
import { UploadCloud as CloudIcon } from "@geist-ui/icons";
import { useState, ChangeEvent } from "react";

interface UploaderImagePostProps {
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
  image: string | null;
}

const UploaderImagePost: React.FC<UploaderImagePostProps> = ({ setImage, image }) => {
  const [error, setError] = useState<string | null>(null);
  const [borderColor, setBorderColor] = useState<string>("border-blue-500");
  const [iconColor, setIconColor] = useState<string>("stroke-blue-500");

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);
        setImage(imageUrl); // Use the passed setImage function
        setError(null);
        setBorderColor("border-blue-500");
        setIconColor("stroke-blue-500");
      } else {
        setImage(null);
        setError("Por favor, selecciona una imagen válida.");
        setBorderColor("border-red-500");
        setIconColor("stroke-red-500");
      }
    }
  };

  return (
    <article>
      <label
        htmlFor="imageInput"
        className={`flex flex-col items-center justify-center overflow-hidden border-2 ${borderColor} border-dashed cursor-pointer rounded-xl h-60`}
      >
        <input
          id="imageInput"
          name="Image"
          onChange={handleImageChange}
          type="file"
          accept="image/*"
          className="hidden inputImageCreatePost"
        />
        {image ? (
          <img
            className="object-cover w-full h-full"
            src={image}
            alt="Imagen de Publicacion"
          />
        ) : (
          <>
            <CloudIcon className={`w-20 h-20 ${iconColor}`} />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </>
        )}
      </label>
    </article>
  );
};

export default UploaderImagePost;
