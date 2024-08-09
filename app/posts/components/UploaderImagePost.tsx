// UploaderImagePost.tsx
import { UploadCloud as CloudIcon } from "@geist-ui/icons";
import { useState, ChangeEvent } from "react";

interface UploaderImagePostProps {
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
  image: string | null;
}

const UploaderImagePost: React.FC<UploaderImagePostProps> = ({
  setImage,
  image,
}) => {
  const [error, setError] = useState<string | null>(null);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);

        setImage(imageUrl); // Use the passed setImage function
        setError(null);
      } else {
        setImage(null);
        setError("Por favor, selecciona una imagen válida.");
      }
    }
  };

  return (
    <article>
      <label className={`flex flex-col items-center justify-center overflow-hidden border-2 border-dashed cursor-pointer rounded-xl h-60`} htmlFor="imageInput" >
        <input accept="image/*" className="hidden inputImageCreatePost" id="imageInput" name="Image" type="file" onChange={handleImageChange} />
        {image ? (
          <img alt="Imagen de Publicacion" className="object-cover w-full h-full" src={image} />
        ) : (
          <>
            <CloudIcon className={`w-20 h-20 stroke-[#dd2525]`} />
            {error && <p className="text-red-500 mt-2">{error}</p>}
          </>
        )}
      </label>
    </article>
  );
};

export default UploaderImagePost;
