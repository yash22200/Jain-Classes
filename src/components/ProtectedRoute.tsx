import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

interface Props {
  children: React.ReactElement;
  role?: "student" | "admin";
}

const ProtectedRoute: React.FC<Props> = ({ children, role }) => {
  const { user, isLoading } = useAuth();

  // Don't redirect while the auth session is still being validated
  if (isLoading) {
    return (
      <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        fontSize: "1rem",
        color: "#888",
      }}>
        Loading...
      </div>
    );
  }

  if (!user) {
    // Not logged in — redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    // Wrong role — redirect to the correct dashboard for their actual role
    // This prevents a student from accessing /admin and vice versa
    if (user.role === "admin") {
      return <Navigate to="/admin" replace />;
    }
    return <Navigate to="/student" replace />;
  }

  return children;
};

export default ProtectedRoute;
