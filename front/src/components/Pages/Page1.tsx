import { useAtom } from "jotai";
import React from "react";
import { userAtom } from "../Atom/UserAtom";

const Page1: React.FC = () => {
  const [user] = useAtom(userAtom);

  return (
    <h1>
      Bienvenue sur Accueil 1, {user.id} and {user.email} !
    </h1>
  );
};

export default Page1;
