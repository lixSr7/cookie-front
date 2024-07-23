'use client';

import {  Card, CardBody, CardFooter, CardHeader, Avatar, } from "@nextui-org/react";

import PostImage from "./PostImage";
import ButtonOptions from "./ButtonOptions";
import DeletePost from "./DeletePost";
import ShowMore from "./ShowMore";

import { formatTimeDifference } from "@/utils/formatedDate";
import { Post as IPost } from "@/types/Post";
import { userToken } from "@/types/Users";

import { jwtDecode } from "jwt-decode";

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
            <Avatar isBordered size="md" color="danger" src={post.user.image.secure_url || ""} />
            <div className="flex flex-col">
              <strong>{post.user.fullname}</strong>
              <span className="text-sm text-blue-500">
                @{post.user.username || post.user.username}
              </span>
            </div>
          </div>
          <div className="flex items-center justify-end gap-2">
            <ShowMore />
            {(decodeToken.id === post.user._id ||
              decodeToken.role === "admin") && (
                <DeletePost updatePosts={updatePosts} postId={post._id} />
              )}
          </div>
        </CardHeader>
        <CardBody className="flex flex-col items-center justify-center w-full">
          <p className="w-full mb-3 text-sm text-zinc-700 dark:text-white dark:text-opacity-60 ">
            {post.content}
          </p>
          {post.image && (
            <PostImage src={post.image} alt={post.content} date={formatTimeDifference(post.createdAt)} />
          )}
        </CardBody>
        <CardFooter className="flex flex-col gap-4">
          <ButtonOptions postId={post._id} likes={post.likes} />
        </CardFooter>
      </Card>
    </article>
  );
}
