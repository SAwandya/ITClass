import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { role, loading } = useAuth();

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-gray-100 bg-opacity-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-blue-500 border-opacity-75"></div>
      </div>
    );
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />; // Redirect unauthorized users
  }

  return children;
};

export default ProtectedRoute;
