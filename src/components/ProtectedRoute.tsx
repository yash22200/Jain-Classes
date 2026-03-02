import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/MockAuthContext";

interface Props {
  children: React.ReactElement;
  role?: "student" | "admin";
}

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const { user } = useAuth();

  if (!user) {
    // not logged in
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // wrong role
    return <Navigate to="/" replace />; // could redirect to home or unauthorized page
  }

  return children;
};

export default ProtectedRoute;
