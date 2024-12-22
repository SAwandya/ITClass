import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { authToken } = useAuth();

  return authToken ? children : <Navigate to="/signin" replace />;
};

export default ProtectedRoute;
