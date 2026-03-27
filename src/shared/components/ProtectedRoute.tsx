import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "../stores/authStore";
import { LoadingSpinner } from "./LoadingSpinner";

interface ProtectedRouteProps {
  allowedRole?: "customer" | "admin";
  redirectTo?: string;
}

export function ProtectedRoute({
  allowedRole,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const { session, profile, isInitialized } = useAuthStore();

  if (!isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to={redirectTo} replace />;
  }

  if (allowedRole && profile?.role !== allowedRole) {
    // Redirect admin trying to access customer routes and vice versa
    const fallback = profile?.role === "admin" ? "/admin" : "/";
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
}
