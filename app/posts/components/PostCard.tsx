import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  User,
} from "@nextui-org/react";
import PostImage from "./PostImage";
import ButtonOptions from "./ButtonOptions";
import { formatTimeDifference } from "@/utils/formatedDate";
import { Post as IPost } from "@/interfaces/Post";
import { Trash2 as TrashIcon } from "@geist-ui/icons";
import { useState } from "react";
import DeletePost from "./DeletePost";

export default function PostCard({
  post,
  updatePosts,
}: {
  post: IPost;
  updatePosts: () => void;
}) {
  const [isFollow, setisFollow] = useState(false);

  const handleFollow = () => {
    setisFollow(!isFollow);
  };


  return (
    <article className="block w-full max-w-3xl p-4 m-auto rounded-lg">
      <Card className="block w-full">
        <CardHeader className="flex justify-between gap-3 p-4">
          <User
            name={post.userId}
            description={`@${post.userId}`}
            avatarProps={{
              isBordered: true,
              color: "danger",
            }}
          />
          <div className="flex items-center justify-end gap-2">
            <Button
              color={isFollow ? "danger" : "primary"}
              onClick={handleFollow}
              variant={isFollow ? "bordered" : "solid"}
              size="sm"
            >
              {isFollow ? "Unfollow" : "Follow"}
            </Button>
            <DeletePost updatePosts={updatePosts} postId={post._id} />
          </div>
        </CardHeader>
        <CardBody className="flex flex-col items-center justify-center w-full">
          <p className="w-full mb-3 text-sm text-zinc-700 dark:text-white dark:text-opacity-60 ">
            {post.content}
          </p>
          {post.image && (
            <PostImage
              src={post.image}
              alt={post.content}
              date={formatTimeDifference(post.createdAt)}
            />
          )}
        </CardBody>
        <CardFooter className="flex justify-between gap-4">
          <ButtonOptions postId={post._id} />
        </CardFooter>
      </Card>
    </article>
  );
}
