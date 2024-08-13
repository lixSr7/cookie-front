import { Image } from "./Users";

type reportPost = {
  type: string;
  userId: string;
  postId: string;
  reason: string;
  createdAt: string;
};
type reportComment = {
  type: string;
  userId: string;
  postId: string;
  commentId: string;
  reason: string;
  createdAt: string;
};
type PostUser = {
  _id: string;
  username: string;
  fullname: string;
  image: Image;
};
type CommentUser = {
  _id: string;
  username: string;
  fullname: string;
  image: Image;
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
  image?: Image;
  reports: reportComment[];
};

export type Post = {
  _id: string;
  content: string;
  image: string;
  user: PostUser;
  reports: reportPost[];
  likes: Like[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
};


export type UserWithPosts = {
  id: string;
  username: string;
  email?: string;
  role: string;
  status: string;
  fullname?: string;
  image?: string;
  posts: Post[];
};