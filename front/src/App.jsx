import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Pages publiques
import Home from "./components/Home/Home";
import NotFound from "./components/Atom/NotFound";
import Unauthorized from "./components/Atom/Unauthorized";

// Layout principal (dashboard)
import MainLayout from "./components/SideNavbar/MainLayout";

// Pages du dashboard
import Page1 from "./components/Pages/Page1";
import Page2 from "./components/Pages/Pages2";

// CRUD Chantiers
import SitesList from "./components/Pages/ManageSites/SitesList";
import SiteEdit  from "./components/Pages/ManageSites/SiteEdit";

// Sécurité
import { PrivateRoute } from "./components/Atom/PrivateRoute";

function App() {
  return (
    <Routes>
      {/* ----------------------- */}
      {/*      PUBLIC ROUTES      */}
      {/* ----------------------- */}
      <Route path="/" element={<Home />} />
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="*" element={<NotFound />} />

      {/* ----------------------- */}
      {/*     DASHBOARD LAYOUT    */}
      {/* ----------------------- */}
      <Route path="/dashbord" element={<MainLayout />}>
        {/* Accueil par défaut */}
        <Route index element={<Page1 />} />

        {/* Exemple de route conditionnelle */}
        <Route
          path="acceuil1"
          element={
            <PrivateRoute
              conditionsEvery={[{ field: "user_type", allowedValues: ["AD"] }]}
              component={Page1}
            />
          }
        />
        <Route
          path="acceuil2"
          element={
            <PrivateRoute
              conditionsEvery={[{ field: "user_type", allowedValues: ["AD"] }]}
              component={Page2}
            />
          }
        />

        {/* ----------------------- */}
        {/*     CRUD CHANTIERS      */}
        {/* ----------------------- */}
        <Route
          path="chantiers"
          element={
            <PrivateRoute
              conditionsEvery={[{ field: "user_type", allowedValues: ["AD", "CDC"] }]}
              component={SitesList}
            />
          }
        />
        <Route
          path="chantier/:id"
          element={
            <PrivateRoute
              conditionsEvery={[{ field: "user_type", allowedValues: ["AD", "CDC"] }]}
              component={SiteEdit}
            />
          }
        />

        {/* Fallback : toute autre route renvoie à l'accueil du dashboard */}
        <Route path="*" element={<Navigate to="/dashbord" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
