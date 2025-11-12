import { Navigate } from "react-router";
import { useProfile } from "../hooks/use-auth";
import type { ReactNode } from "react";
import type { PermissionEnum } from "../services/role-and-permissions-service";
import { hasPermission } from "../hooks/use-role-and-permissions";

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
