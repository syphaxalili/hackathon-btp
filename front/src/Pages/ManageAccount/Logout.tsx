import { useEffect, useCallback } from "react";
import Cookies from "js-cookie";

const Logout = () => {
  const handleLogout = useCallback(() => {
    Cookies.remove("token");
    window.location.reload();
  }, []);

  useEffect(() => {
    handleLogout();
  }, [handleLogout]);
};

export default Logout;
