import { atom } from "jotai";

export type User = {
  id: number;
  email: string;
};
export const userAtom = atom<User>({
  id: 0,
  email: "",
});
