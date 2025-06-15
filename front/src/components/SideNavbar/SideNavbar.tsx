import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Divider
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import PeopleIcon from "@mui/icons-material/People";
import BusinessIcon from "@mui/icons-material/Business";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const drawerWidth = 240;

const SideNavbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: drawerWidth,
          boxSizing: "border-box"
        }
      }}
    >
      <Toolbar />
      <Divider />
      <List>
        <ListItem
          button
          selected={location.pathname === "/dashbord"}
          onClick={() => handleNavigation("/dashbord")}
        >
          <ListItemIcon><HomeIcon /></ListItemIcon>
          <ListItemText primary="Accueil" />
        </ListItem>

        <ListItem
          button
          selected={location.pathname.startsWith("/dashbord/ouvriers")}
          onClick={() => handleNavigation("/dashbord/ouvriers")}
        >
          <ListItemIcon><PeopleIcon /></ListItemIcon>
          <ListItemText primary="Ouvriers" />
        </ListItem>

        <ListItem
          button
          selected={location.pathname.startsWith("/dashbord/chantiers")}
          onClick={() => handleNavigation("/dashbord/chantiers")}
        >
          <ListItemIcon><BusinessIcon /></ListItemIcon>
          <ListItemText primary="Chantiers" />
        </ListItem>

        <ListItem
          button
          selected={location.pathname.startsWith("/dashbord/settings")}
          onClick={() => handleNavigation("/dashbord/settings")}
        >
          <ListItemIcon><SettingsIcon /></ListItemIcon>
          <ListItemText primary="Paramètres" />
        </ListItem>
      </List>

      <Divider />

      <List>
        <ListItem button onClick={() => {/* logout ici */}}>
          <ListItemIcon><LogoutIcon /></ListItemIcon>
          <ListItemText primary="Déconnexion" />
        </ListItem>
      </List>
    </Drawer>
  );
};

export default SideNavbar;
