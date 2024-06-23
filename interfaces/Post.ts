type User = {
  _id: string;
  username: string;
  fullname: string;
  image: string;
};

export type Like = {
  _id: string;
  user: User;
  createdAt: string;
};

export type Comment = {
  content: string;
  user: User;
  _id: string;
  date: string;
  emoji?: "happy" | "ungry" | "sad" | "none";
  createdAt: string;
};

export type Post = {
  _id: string;
  content: string;
  image: string;
  user: User;
  likes: Like[];
  comments: Comment[];
  createdAt: string; // Puedes usar Date para representar fechas.
  updatedAt: string; // Puedes usar Date para representar fechas.
};
