import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const AuthLayout = ({ children }) => {
  const users = useSelector((state) => state.users);
  const isAuthenticated = users?.isAuthenticated || false;
  const token = !!localStorage.getItem("accessToken");

  if (isAuthenticated === undefined || !token) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default AuthLayout;
