// App.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAtom } from "jotai";
import { userAtom } from "./components/Atom/UserAtom";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home/Home";
import NotFound from "./components/Atom/NotFound";
import Unauthorized from "./components/Atom/Unauthorized";
import MainLayout from "./components/SideNavbar/MainLayout";
import Page1 from "./components/Pages/Page1";
import Page2 from "./components/Pages/Page2"; // Correction ici
import { PrivateRoute } from "./components/Atom/PrivateRoute";

function App() {
  const [user, setUser] = useAtom(userAtom);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      setUser({ id: 0, email: "", user_type: "", first_name: "", last_name: "" });
      navigate("/");
      return;
    }

    if (!user?.id || user.id <= 0) {
      const fetchUser = async () => {
        try {
          const response = await fetch("http://localhost:5500/auth/me", {
            method: "GET",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });

          const data = await response.json();
          if (response.ok && data.user) {
            setUser({
              id: data.user.id,
              email: data.user.email,
              user_type: data.user.user_type,
              first_name: data.user.first_name,
              last_name: data.user.last_name,
            });
          } else {
            navigate("/");
          }
        } catch {
          navigate("/");
        }
      };

      fetchUser();
    }
  }, [user, navigate, setUser]); // Ajout des dépendances

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
