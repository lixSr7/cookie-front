"use client";
import {
  Heart as HeartIcon,
  Share2 as ShareIcon,
  Star as StarIcon,
} from "@geist-ui/icons";
import { useState } from "react";
import { Button } from "@nextui-org/react";
import CommentModal from "./CommentModal";

function ButtonOptions({ postId }: { postId: string }) {
  const [isFavorite, setisFavorite] = useState(false);
  const [isLiked, setisLiked] = useState(false);

  const handleFavorite = () => {
    setisFavorite(!isFavorite);
  };
  const handleLike = () => {
    setisLiked(!isLiked);
    console.log(isLiked);
  };

  return (
    <div className="flex items-center justify-between w-full rounded-md">
      <div className="flex items-center gap-4">
        <Button
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
        </Button>
        <CommentModal postId={postId} />
        <ShareIcon className="w-6 h-6 cursor-pointer opacity-60" />
      </div>
      <div>
        <Button
          onClick={handleFavorite}
          isIconOnly
          color={isFavorite ? "warning" : "default"}
          variant="shadow"
        >
          <StarIcon
            className={`w-5 h-5 cursor-pointer ${
              isFavorite ? "fill-white" : "opacity-60"
            }`}
          />
        </Button>
      </div>
    </div>
  );
}

export default ButtonOptions;
