import { Image as UserImage } from "./Users";

type mediaUrl = {
  public_id: string;
  secure_url: string;
};

type PostUser = {
  _id: string;
  username: string;
  fullname: string;
  image: UserImage;
};
type CommentUser = {
  _id: string;
  username: string;
  fullname: string;
  image: string;
};

export type Like = {
  _id: string;
  userId: string;
  createdAt: string;
};

export type Comment = {
  content: string;
  user: CommentUser;
  _id: string;
  date: string;
  emoji?: "happy" | "ungry" | "sad" | "none";
  createdAt: string;
};

export type Post = {
  _id: string;
  content: string;
  image: string;
  user: PostUser;
  likes: Like[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
};
