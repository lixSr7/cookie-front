"use client";

import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Avatar,
} from "@nextui-org/react";

import PostImage from "./PostImage";
import PostFooter from "./PostFooter";

import { formatTimeDifference } from "@/utils/formatedDate";
import { Post as IPost } from "@/types/Post";
import OptionsPosts from "./OptionsPosts";

export default function PostCard({
  post,
  updatePosts,
}: {
  post: IPost;
  updatePosts: () => void;
}): JSX.Element | null {
  if (!post.user) {
    return null;
  }

  const originalUser = post.originalUser; // Usuario que creó el post original
  const displayUser = originalUser || post.user; // Prioridad al usuario original si existe

  return (
    <article className="block w-full max-w-3xl p-4 m-auto rounded-lg">
      <Card className="block w-full">
        <CardHeader className="flex justify-between gap-3 p-4">
          <div className="flex items-center gap-3">
            <Avatar
              isBordered
              size="md"
              src={displayUser.image?.secure_url || ""}
            />
            <div className="flex flex-col">
              <strong>{displayUser.fullname}</strong>
              <span className="text-sm text-blue-500">
                @{displayUser.username}
              </span>
              {originalUser && (
                <span className="text-xs text-gray-500">
                  Originally posted by {post.user.fullname}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <OptionsPosts postId={post._id} updatePosts={updatePosts} />
          </div>
        </CardHeader>
        <CardBody className="flex flex-col items-center justify-center w-full">
          <p className="w-full mb-3 text-sm text-zinc-700 dark:text-white dark:text-opacity-60  whitespace-pre-line ">
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
          <PostFooter
            updatePosts={updatePosts}
            likes={post.likes}
            postId={post._id}
          />
        </CardFooter>
      </Card>
    </article>
  );
}
