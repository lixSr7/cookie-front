import {
  Avatar,
  Card,
  CardHeader,
  CardBody,
  ScrollShadow,
  Button,
} from "@nextui-org/react";
import { Trash2 as TrashIcon } from "@geist-ui/icons";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

import { Comment as CommentType } from "@/types/Post";
import { deleteComment } from "@/services/Posts";
import { emojis } from "@/app/consts/emojis";
import { formatTimeDifference } from "@/utils/formatedDate";
import { userToken } from "@/types/Users";

function ListComments({
  comments,
  postId,
  updateComments,
}: {
  comments: CommentType[];
  postId: string;
  updateComments: () => void;
}) {
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const decodeToken: userToken = jwtDecode(storedToken);

      setUserId(decodeToken.id);
    }
  }, []);

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
            isMeComment={comment.user._id === userId}
            postId={postId}
            updateComments={updateComments}
          />
        ))
      ) : (
        <div className="grid w-full h-full place-content-center">
          <img
            alt=""
            className="m-auto w-36"
            src="https://res.cloudinary.com/dtbedhbr4/image/upload/f_auto,q_auto/v1/Cookie%20Post/k6x8sxuzomlzc6gjihm0"
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
  isMeComment = false,
  updateComments,
}: {
  comment: CommentType;
  postId: string;
  id: string;
  isMeComment?: boolean;
  updateComments: () => void;
}) => {
  let emojiURI = emojis.find((emoji) => emoji.name === comment.emoji)?.svg;

  const handleDelete = async () => {
    // console.log(comment);
    // console.log("Deleting comment with ID:", comment._id);
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
                color="danger"
                size="md"
                src={comment.user.image?.secure_url || ""}
              />
              <div className="flex flex-col">
                <strong>{comment.user.username}</strong>
                <span className="text-sm text-blue-500">
                  @{comment.user.fullname || comment.user.username}
                </span>
              </div>
            </div>
            <div className="flex gap-2 ">
              {isMeComment && (
                <Button
                  isIconOnly
                  aria-label="Options of Post"
                  variant="ghost"
                  onClick={handleDelete}
                >
                  <TrashIcon className=" stroke-zinc-500" />
                </Button>
              )}
            </div>
          </div>
        </CardHeader>

        <CardBody className="flex flex-col justify-center w-full gap-2">
          {comment.content}
          {comment.emoji !== "none" ? (
            <div className="flex items-center justify-center w-full">
              <img alt="" className=" w-24 m-auto" src={emojiURI} />
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
