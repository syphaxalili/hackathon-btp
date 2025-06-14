import { useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Logout = () => {
  const navigate = useNavigate();

  const handleLogout = useCallback(() => {
    Cookies.remove("token");
    window.location.reload();
  }, []);

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);
};

export default Logout;
