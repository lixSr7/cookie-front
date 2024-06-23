import { create } from "zustand";

type hexadecimalColor = `#${string}`;

type typeThemeColor = {
  color: hexadecimalColor;
  setColor: (color: hexadecimalColor) => void;
};

export const useThemeColor = create<typeThemeColor>((set) => ({
  color: "#f31260",
  setColor: (color) => set({ color }),
}));
