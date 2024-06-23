import { create } from "zustand";
import { userToken } from "@/app/interfaces/Users";

type State = {
  isAuthenticated: boolean;
  token: string | null;
  user: userToken | null;
  login: (user: userToken, token: string) => void;
  logout: () => void;
};

export const useAuthStore = create<State>((set) => ({
  isAuthenticated: false,
  token: null,
  user: null,
  login: (user, token) => set({ isAuthenticated: true, user, token }),
  logout: () => set({ isAuthenticated: false, user: null, token: null }),
}));
