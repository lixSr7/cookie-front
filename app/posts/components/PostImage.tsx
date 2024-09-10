import { Card, CardFooter, Image } from "@nextui-org/react";

type IPostImage = {
  src: string;
  alt?: string;
  date: string;
};

/**
 * Componente que representa una imagen en una tarjeta de publicación.
 * Muestra la imagen con una superposición de pie de página que indica la fecha de la publicación.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {string} props.src - La URL de la imagen que se mostrará.
 * @param {string} [props.alt] - Texto alternativo para la imagen (opcional).
 * @param {string} props.date - La fecha asociada a la imagen, que se muestra en el pie de página.
 *
 * @returns {JSX.Element} - El componente PostImage renderizado.
 */
function PostImage({ src, alt, date }: IPostImage): JSX.Element {
  return (
    <Card isFooterBlurred className="border-none" radius="lg">
      <Image alt={alt} className="object-cover w-full max-h-96" src={src} />
      <CardFooter className="absolute z-10 justify-center w-40 ml-1 overflow-hidden before:bg-white/10 border-white/20 border-1 before:rounded-xl rounded-large bottom-1 shadow-small">
        <p className="font-bold text-tiny text-white/80">{date}</p>
      </CardFooter>
    </Card>
  );
}

export default PostImage;
