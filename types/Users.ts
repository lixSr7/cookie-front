export type userToken = {
  id: string;
  role: 'user' | 'admin' | 'moderator';
  image?: string;
  username: string;
  fullname: string;
  iat: number;
};
