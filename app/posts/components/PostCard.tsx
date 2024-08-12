"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Avatar,
} from "@nextui-org/react";
import { jwtDecode } from "jwt-decode";

import PostImage from "./PostImage";
import PostFooter from "./PostFooter";

import { formatTimeDifference } from "@/utils/formatedDate";
import { Post as IPost } from "@/types/Post";
import { userToken } from "@/types/Users";
import OptionsPosts from "./OptionsPosts";

/**
 * Componente que representa una tarjeta de publicación.
 * Muestra el contenido de la publicación, la imagen asociada (si la hay),
 * y proporciona opciones para eliminar la publicación si el usuario es el propietario
 * o un administrador.
 *
 * @param {Object} props - Las propiedades del componente.
 * @param {IPost} props.post - Los datos de la publicación que se muestra en la tarjeta.
 * @param {Function} props.updatePosts - Función para actualizar la lista de publicaciones.
 * @param {string} props.token - Token JWT del usuario para la autenticación y autorización.
 *
 * @returns {JSX.Element | null} - El componente PostCard renderizado o null si no hay usuario en la publicación.
 */
export default function PostCard({
  post,
  updatePosts,
  token,
}: {
  post: IPost;
  updatePosts: () => void;
  token: string;
}) {
  const decodeToken: userToken = jwtDecode(token);

  if (!post.user) {
    return null;
  }

  return (
    <article className="block w-full max-w-3xl p-4 m-auto rounded-lg">
      <Card className="block w-full">
        <CardHeader className="flex justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <Avatar
              isBordered
              size="md"
              src={post.user.image?.secure_url || ""}
            />
            <div className="flex flex-col">
              <strong>{post.user.fullname}</strong>
              <span className="text-sm text-blue-500">
                @{post.user.username || post.user.username}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <OptionsPosts postId={post._id} updatePosts={updatePosts} />
          </div>
        </CardHeader>
        <CardBody className="flex flex-col items-center justify-center w-full">
          <p className="w-full mb-3 text-sm text-zinc-700 dark:text-white dark:text-opacity-60 ">
            {post.content}
          </p>
          {post.image && (
            <PostImage
              alt={post.content}
              date={formatTimeDifference(post.createdAt)}
              src={post.image}
            />
          )}
        </CardBody>
        <CardFooter className="flex flex-col gap-4">
          <PostFooter likes={post.likes} postId={post._id} />
        </CardFooter>
      </Card>
    </article>
  );
}
