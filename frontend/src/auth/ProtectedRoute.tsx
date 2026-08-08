import { Center, Loader } from "@mantine/core";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function ProtectedRoute() {
  const { user, isCheckingSession } = useAuth();
  if (isCheckingSession) return <Center h="100vh"><Loader /></Center>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
