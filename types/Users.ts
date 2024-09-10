export type Role = {
  _id: string;
  name: string;
};

export type Image = {
  public_id: string;
  secure_url: string;
};

export type User = {
  _id: string;
  username: string;
  email: string;
  code?: string;
  role: Role;
  status: "active" | "inactive";
  fullname: string;
  image?: Image;
  sesion?: string;
  gender: "male" | "female" | "not binary";
  phone_number?: string;
  description?: string;
  chats: string[];
  followers: string[];
  following: string[];
  friends: string[];
  posts: string[];
  likes: string[];
  savedPosts: string[];
};

export type userProfile = {
  id: string;
  username: string;
  fullname: string;
  email: string;
  image: Image;
};

export type userToken = {
  id: string;
  role: "user" | "admin" | "moderator";
  image?: Image;
  username: string;
  fullname: string;
  iat: number;
};
