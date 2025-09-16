import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useContext(AuthContext);

  // Agar user authenticated nahi hai to login page pe redirect kar do
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Agar login hai to children render karo
  return children;
};

export default ProtectedRoute;
