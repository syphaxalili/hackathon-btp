import { atom } from "jotai";

export type User = {
  id: number;
  email: string;
  user_type: string;
};
export const userAtom = atom<User>({
  id: 0,
  email: "",
  user_type: "",
});
