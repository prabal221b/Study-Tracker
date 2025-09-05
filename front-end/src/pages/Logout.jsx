import { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function Logout() {
  useEffect(() => {
    sessionStorage.removeItem("accessToken");
  }, []);

  return <Navigate to="/auth" replace />;
}