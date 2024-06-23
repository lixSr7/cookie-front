type User = {
  userId: string;
  name: string;
  nickName: string;
  image: string;
  _id: string;
};

export type Like = {
  user: User;
  _id: string;
};

export type Comment = {
  content: string;
  userId:string;
  _id: string;
  date: string;
  emoji?: 'happy'|'ungry'|'sad'|'none';
};

export type Post = {
  _id: string;
  content: string;
  image: string;
  userId:string;
  likes: Like[];
  comments: Comment[];
  createdAt: string; // Puedes usar Date para representar fechas.
  updatedAt: string; // Puedes usar Date para representar fechas.
};
