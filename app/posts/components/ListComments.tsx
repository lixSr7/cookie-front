import {
  Avatar,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  ScrollShadow,
  Button,
} from "@nextui-org/react";
import { Comment as CommentType } from "@/interfaces/Post";
import { deleteComment } from "@/services/Posts";
import { Trash2 as TrashIcon } from "@geist-ui/icons";
import { emojis } from "@/app/consts/emojis";

import { formatTimeDifference } from "@/utils/formatedDate";

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
            <div className="flex items-center gap-3">
              <Avatar
                isBordered
                size="md"
                color="danger"
                src={comment.user.image || ""}
              />
              <div className="flex flex-col">
                <strong>{comment.user.username}</strong>
                <span className="text-sm text-blue-500">
                  @{comment.user.fullname || comment.user.username}
                </span>
              </div>
            </div>
            <div className="flex gap-2 ">
              <Button
                isIconOnly
                aria-label="Options of Post"
                variant="ghost"
                onClick={handleDelete}
              >
                <TrashIcon className=" stroke-zinc-500" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardBody className="flex flex-col justify-center w-full gap-2">
          {comment.content}
          {comment.emoji !== "none" ? (
            <div className="flex items-center justify-center w-full">
              <img className="w-10 m-auto" src={emojiURI} alt="" />
            </div>
          ) : null}
          <strong className="font-bold text-md text-slate-500">
            {formatTimeDifference(comment.createdAt)}
          </strong>
        </CardBody>
      </Card>
    </div>
  );
};

export default ListComments;
