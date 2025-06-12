import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Box,
  Divider,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useNavigate, useLocation } from "react-router-dom";
import { useAtom } from "jotai";
import { User, userAtom } from "../Atom/UserAtom";

const drawerWidth = 240;

const navItems = [
  { label: "Dashbord", icon: <DashboardIcon />, path: "/dashbord" },
  { label: "Chantier", icon: <HomeIcon />, path: "/dashbord/acceuil2" },
  { label: "Mes ouvriers", icon: <PeopleIcon />, path: "/acceuil-3" },
  { label: "Mes sous traitant", icon: <SettingsIcon />, path: "/acceuil-3" },
  { label: "Mon compte", icon: <AccountCircleIcon />, path: "/acceuil-3" },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const [user] = useAtom<User>(userAtom); // Assuming you have a userAtom defined in your state management

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleLogout = () => {
    console.log("Déconnexion...");
    navigate("/login");
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        },
      }}
    >
      <Box>
        <List>
          {navItems.map((item) => {
            const selected = location.pathname === item.path;
            return (
              <ListItem
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                sx={{
                  cursor: "pointer",
                  color: selected ? "#fff" : "inherit",
                  background: selected ? "#1976d2" : "transparent",
                  borderRadius: selected ? "8px" : 0,
                  border: selected ? "2px solid #fff" : "none",
                  mx: 1,
                  my: 0.5,
                  "&:hover": {
                    background: "#1565c0",
                    color: "#fff",
                  },
                }}
              >
                <ListItemIcon sx={{ color: selected ? "#fff" : "inherit" }}>
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            );
          })}
        </List>
        <Divider />
        {user && user.user_type === "admin" && (
          <ListItem onClick={handleLogout} sx={{ cursor: "pointer" }}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Ma route privée" />
          </ListItem>
        )}
      </Box>

      <Box sx={{ p: 2 }}>
        <ListItem onClick={handleLogout} sx={{ cursor: "pointer" }}>
          <ListItemIcon>
            <LogoutIcon />
          </ListItemIcon>
          <ListItemText primary="Se déconnecter" />
        </ListItem>
      </Box>
    </Drawer>
  );
}
