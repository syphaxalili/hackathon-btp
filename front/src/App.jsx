import { useEffect, useCallback, useState } from "react";
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
import WorkersList from "./Pages/ManageWorkers/WorkersList";
import { PrivateRoute } from "./components/Atom/PrivateRoute";
import { apiUrl } from "./config";
import WorkerInvitation from "./Pages/ManageWorkers/WorkerInvitation";
import Logout from "./Pages/ManageAccount/Logout";

function App() {
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id > 0 && window.location.pathname === "/") {
      navigate("/dashbord");
    }
  }, [user, navigate]);

  // Fonction getDataUser mémorisée avec useCallback
  const getDataUser = useCallback(async () => {
    if (!token) {
      setUser({
        id: 0,
        email: "",
        user_type: "",
      });
      setLoading(false); // fin du chargement
      navigate("/");
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

      if (response.ok && data.data && data.data.user) {
        setUser({
          id: data.data.user.id,
          email: data.data.user.email,
          user_type: data.data.user.user_type,
        });
      } else {
        setUser({
          id: 0,
          email: "",
          user_type: "",
        });
        navigate("/");
      }
    } catch (error) {
      console.error("Erreur lors de la récupération utilisateur :", error);
      setUser({
        id: 0,
        email: "",
        user_type: "",
      });
      navigate("/unauthorized");
    } finally {
      // Pour s'assurer que le chargement dure au moins 3 secondes
      setTimeout(() => {
        setLoading(false);
      }, 500);
    }
  }, [token, setUser, navigate]);

  useEffect(() => {
    getDataUser();
  }, [getDataUser]);

  if (loading) {
    return (
      <div
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          fontSize: "24px",
          fontWeight: "bold",
        }}
      >
        Chargement...
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="*" element={<NotFound />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/logout" element={<Logout />} />

      <Route path="/dashbord" element={<MainLayout />}>
        <Route index element={<Page1 />} />
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
        <Route path="/dashbord/ouvriers" element={<WorkersList />} />
        <Route
          path="/dashbord/invite/user"
          element={
            <PrivateRoute
              conditionsEvery={[{ field: "user_type", allowedValues: ["AD"] }]}
              component={WorkerInvitation}
            />
          }
        />
      </Route>
    </Routes>
  );
}

export default App;
