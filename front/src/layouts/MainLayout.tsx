import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/SideNavbar";

const MainLayout: React.FC = () => {
  return (
    <div style={{ display: "flex" }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: "1rem" }}>
        <Outlet /> {/* Affiche la page courante ici */}
      </main>
    </div>
  );
};

export default MainLayout;
