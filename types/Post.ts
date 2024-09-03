import { Image } from "./Users";

export type ReportPost = {
  _id: string;
  type: string;
  userId: string;
  postId: string;
  reason: string;
  createdAt: string;
};

type ReportComment = {
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
  emoji?: "happy" | "angry" | "sad" | "none";
  createdAt: string;
  image?: Image;
  reports: ReportComment[];
  repostId?: string; // Agregado en el backend
  originalPostId?: string; // Agregado en el backend
};

export type Post = {
  _id: string;
  content: string;
  image: string;
  user: PostUser;
  reports: ReportPost[];
  likes: Like[];
  comments: Comment[];
  createdAt: string;
  updatedAt: string;
  repostId?: string; // Agregado en el backend
  originalPostId?: string; // Agregado en el backend
  originalUser?: PostUser;
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
