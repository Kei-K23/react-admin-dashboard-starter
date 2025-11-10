import { Navigate } from "react-router";
import { PermissionEnum } from "../services/auth-services";
import { useProfile, hasPermission } from "../hooks/use-auth";
import type { ReactNode } from "react";

interface Props {
  module: string;
  permission: PermissionEnum;
  children: ReactNode;
}

export default function PermissionGuard({
  module,
  permission,
  children,
}: Props) {
  const { data: user, isLoading, isError } = useProfile();

  if (isLoading) {
    return (
      <div className="p-6 text-center text-sm text-muted-foreground">
        Loading…
      </div>
    );
  }

  if (isError || !hasPermission(user?.data, module, permission)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
