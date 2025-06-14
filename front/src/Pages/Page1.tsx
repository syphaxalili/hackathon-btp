import { useAtom } from "jotai";
import React from "react";
import { userAtom } from "../components/Atom/UserAtom";

const Page1 = () => {
  const [user] = useAtom(userAtom);

  return (
    <h1>
      Bienvenue sur Accueil 1, {user.id} and {user.email} !
    </h1>
  );
};

export default Page1;
