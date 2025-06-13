import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAtom } from "jotai";
import { userAtom } from "./components/Atom/UserAtom";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import NotFound from "./components/Atom/NotFound";
import Unauthorized from "./components/Atom/Unauthorized";
import MainLayout from "./layouts/MainLayout";
import Page1 from "./Pages/Page1";
import Page2 from "./Pages/Page2";
import { PrivateRoute } from "./components/Atom/PrivateRoute";
import { apiUrl } from "./config";

function App() {
  const [, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  // Fonction getDataUser mémorisée avec useCallback
  const getDataUser = useCallback(async () => {
    const token = Cookies.get("token");

    if (!token) {
      setUser({
        id: 0,
        email: "",
        user_type: "",
      });
      return;
    }

    try {
      const response = await fetch(`${apiUrl}/auth/me`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      console.log("data", data);

      if (response.ok && data.user) {
        setUser({
          id: data.user.id, // data.user.id (corrigé)
          email: data.user.email, // data.user.email (corrigé)
          user_type: data.user.user_type, // data.user.user_type (corrigé)
        });
      } else {
        setUser({
          id: 0,
          email: "",
          user_type: "",
        });
      }
    } catch (error) {
      console.error("Erreur lors de la récupération utilisateur :", error);
      setUser({
        id: 0,
        email: "",
        user_type: "",
      });
      navigate("/unauthorized");
    }
  }, [navigate, setUser]);

  // Exécution au montage (et au refresh)
  useEffect(() => {
    getDataUser();
  }, [getDataUser]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route
        path="/dashbord/acceuil1"
        element={
          <PrivateRoute
            conditionsEvery={[{ field: "user_type", allowedValues: ["AD"] }]}
            component={Page1}
          />
        }
      />
      <Route
        path="/dashbord/acceuil2"
        element={
          <PrivateRoute
            conditionsEvery={[{ field: "user_type", allowedValues: ["AD"] }]}
            component={Page2}
          />
        }
      />
      <Route path="/dashbord" element={<MainLayout />}>
        <Route index element={<Page1 />} />
      </Route>
    </Routes>
  );
}

export default App;
