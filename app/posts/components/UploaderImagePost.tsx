import { UploadCloud as CloudIcon } from "@geist-ui/icons";
import { useState, ChangeEvent } from "react";

/**
 * Propiedades para el componente UploaderImagePost.
 *
 * @typedef {Object} UploaderImagePostProps
 * @property {React.Dispatch<React.SetStateAction<string | null>>} setImage - Función para actualizar el estado de la imagen.
 * @property {string | null} image - URL de la imagen seleccionada o `null` si no hay imagen.
 */
interface UploaderImagePostProps {
  setImage: React.Dispatch<React.SetStateAction<string | null>>;
  image: string | null;
}

/**
 * Componente para cargar una imagen de publicación.
 *
 * Permite al usuario seleccionar una imagen desde su dispositivo. Muestra un ícono de carga si no hay imagen seleccionada.
 * Muestra la imagen seleccionada o un mensaje de error si el archivo seleccionado no es una imagen válida.
 *
 * @param {UploaderImagePostProps} props - Propiedades del componente.
 * @param {React.Dispatch<React.SetStateAction<string | null>>} props.setImage - Función para actualizar el estado de la imagen.
 * @param {string | null} props.image - URL de la imagen seleccionada o `null` si no hay imagen.
 * @returns {JSX.Element} - El componente UploaderImagePost renderizado.
 */
const UploaderImagePost: React.FC<UploaderImagePostProps> = ({
  setImage,
  image,
}) => {
  const [error, setError] = useState<string | null>(null);

  /**
   * Maneja el cambio en la selección de archivos.
   *
   * Valida que el archivo seleccionado sea una imagen y actualiza el estado con la URL de la imagen.
   * Muestra un mensaje de error si el archivo no es una imagen válida.
   *
   * @param {ChangeEvent<HTMLInputElement>} e - Evento de cambio en el input de archivo.
   */
  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      if (file.type.startsWith("image/")) {
        const imageUrl = URL.createObjectURL(file);

        setImage(imageUrl); // Usa la función setImage pasada como propiedad
        setError(null);
      } else {
        setImage(null);
        setError("Por favor, selecciona una imagen válida.");
      }
    }
  };

  return (
    <article>
      <label
        className={`flex flex-col items-center justify-center overflow-hidden border-2 border-dashed cursor-pointer rounded-xl h-60`}
        htmlFor="imageInput"
      >
        <input
          accept="image/*"
          className="hidden inputImageCreatePost"
          id="imageInput"
          name="Image"
          type="file"
          onChange={handleImageChange}
        />
        {image ? (
          <img
            alt="Imagen de Publicacion"
            className="object-cover w-full h-full"
            src={image}
          />
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
