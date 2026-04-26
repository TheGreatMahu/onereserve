import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../App";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <LoadingSpinner fullScreen />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <Outlet />;
}