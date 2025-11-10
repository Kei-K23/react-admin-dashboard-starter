import { Navigate, Outlet } from "react-router";
import { useAuthStatus, useProfile } from "../hooks/use-auth";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuthStatus();
  const { isLoading, isError } = useProfile();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" replace />;
  }

  if (isLoading) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (isError) {
    return <Navigate to="/auth/login" replace />;
  }

  return <Outlet />;
}
