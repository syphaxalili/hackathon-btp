import { useEffect, useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useAtom } from "jotai";
import { userAtom } from "./Atom/UserAtom";
import { Routes, Route } from "react-router-dom";
import Home from "./Pages/Home";
import NotFound from "./components/NotFound";
import Unauthorized from "./components/Unauthorized";
import MainLayout from "./layouts/MainLayout";
import WorkersList from "./Pages/ManageWorkers/WorkersList";
import SkillsManagement from "./Pages/SkillsManagement";
import { PrivateRoute } from "./Atom/PrivateRoute";
import { apiUrl } from "./config";
import WorkerInvitation from "./Pages/ManageWorkers/WorkerInvitation";
import Logout from "./Pages/ManageAccount/Logout";
import UpdateUserData from "./Pages/ManageAccount/UserDataUpdate";
import WorkerSeeMore from "./Pages/ManageWorkers/WorkerSeeMore";
import StakeHolderList from "./Pages/ManageStakeHolders/StakeHolderList";
import StakeHolderCreateNew from "./Pages/ManageStakeHolders/StakeHolderCreateNew";
import StakeHolderUpdateById from "./Pages/ManageStakeHolders/StakeHolderUpdateById";
import SiteCreate from "./Pages/ManageSite/SiteCreate";
import SiteGetAll from "./Pages/ManageSite/SiteGetAll";
import DashboardKpi from "./Pages/DashboardKpi";
import SiteGetById from "./Pages/ManageSite/SiteGetById";

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

  const getDataUser = useCallback(async () => {
    if (!token) {
      setUser({
        id: 0,
        email: "",
        user_type: "",
        first_name: "",
        last_name: "",
      });
      setLoading(false);
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
          first_name: data.data.user.first_name,
          last_name: data.data.user.last_name,
        });
      } else {
        setUser({
          id: 0,
          email: "",
          user_type: "",
          first_name: "",
          last_name: "",
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
      <Route path="/dashbord" element={<MainLayout />}>
        <Route index element={<DashboardKpi />} />
        <Route path="/dashbord/chantiers" element={<SiteGetAll />} />
        <Route path="/dashbord/site/:id" element={<SiteGetById />} />
        <Route
          path="/dashbord/site/new"
          element={
            <PrivateRoute
              conditionsEvery={[
                { field: "user_type", allowedValues: ["AD", "CDC"] },
              ]}
              component={SiteCreate}
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
        <Route path="/dashbord/worker/:id" element={<WorkerSeeMore />} />
        <Route path="/dashbord/stakeholder" element={<StakeHolderList />} />
        <Route
          path="/dashbord/stakeholder/new"
          element={
            <PrivateRoute
              conditionsEvery={[{ field: "user_type", allowedValues: ["AD"] }]}
              component={StakeHolderCreateNew}
            />
          }
        />
        <Route
          path="/dashbord/stakeholder/:id"
          element={<StakeHolderUpdateById />}
        />
        <Route path="/dashbord/user/account" element={<UpdateUserData />} />
        <Route
          path="/dashbord/skills"
          element={
            <PrivateRoute
              conditionsEvery={[{ field: "user_type", allowedValues: ["AD"] }]}
              component={SkillsManagement}
            />
          }
        />
      </Route>
      <Route path="/logout" element={<Logout />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
