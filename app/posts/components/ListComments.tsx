import { getAllComments } from "@/services/Posts";
import { use, useEffect, useState } from "react";
import {
  User,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ScrollShadow,
  Button,
} from "@nextui-org/react";
import { Comment as CommentType } from "@/interfaces/Post";
import { deleteComment } from "@/services/Posts";
import { useAuthStore } from "@/app/context/useAuthSrored";
import { Trash2 as TrashIcon } from "@geist-ui/icons";
import { emojis } from "@/app/consts/emojis";

function ListComments({
  comments,
  postId,
  updateComments,
}: {
  comments: CommentType[];
  postId: string;
  updateComments: () => void;
}) {
  console.log(comments);
  return (
    <ScrollShadow
      hideScrollBar
      className="w-full h-full max-h-[25em] flex flex-col justify-start items-center p-4 gap-4"
    >
      {comments.length > 0 ? (
        comments.map((comment) => (
          <Item
            key={comment._id}
            comment={comment}
            id={comment._id}
            postId={postId}
            updateComments={updateComments}
          />
        ))
      ) : (
        <div className="grid w-full h-full place-content-center">
          <img
            className="m-auto w-36"
            src="https://res.cloudinary.com/dtbedhbr4/image/upload/f_auto,q_auto/v1/Cookie%20Post/k6x8sxuzomlzc6gjihm0"
            alt=""
          />
          <span className="text-sm text-center opacity-60">
            Create the first comment ¿No?
          </span>
        </div>
      )}
    </ScrollShadow>
  );
}

const Item = ({
  comment,
  postId,
  id,
  updateComments,
}: {
  comment: CommentType;
  postId: string;
  id: string;
  updateComments: () => void;
}) => {
  // const [isLiked, setisLiked] = useState(false);

  // const handleLike = () => {
  //   setisLiked(!isLiked);
  //   console.log(isLiked);
  // };
  const { user } = useAuthStore();
  let emojiURI = emojis.find((emoji) => emoji.name === comment.emoji)?.svg;
  console.log(emojiURI);
  const handleDelete = async () => {
    await deleteComment(postId, id);
    updateComments();
  };
  return (
    <div key={comment._id} className="w-full">
      <Card className=" dark:bg-zinc-800">
        <CardHeader className="flex items-center">
          <div className="flex items-center justify-between w-full ">
            <User
              name={comment.userId}
              avatarProps={{
                isBordered: true,
                color: "danger",
              }}
            />
            <div className="flex gap-2 ">
              <Button
                isIconOnly
                aria-label="Options of Post"
                variant="ghost"
                onClick={handleDelete}
              >
                <TrashIcon className=" stroke-zinc-500" />
              </Button>
              {/* <Button
                onClick={handleLike}
                isIconOnly
                color={isLiked ? "danger" : "default"}
                aria-label="Like"
              >
                <HeartIcon
                  className={`w-6 h-6 cursor-pointer ${
                    isLiked ? "fill-white" : "opacity-60"
                  }`}
                />
              </Button> */}
            </div>
          </div>
        </CardHeader>

        <CardBody>{comment.content}</CardBody>
      </Card>
      {(comment.emoji !== "none" && comment.emoji) && (
        <>
          <img src={emojiURI} className="w-20 h-20" alt={emojiURI} />
        </>
      )}
    </div>
  );
};

export default ListComments;
