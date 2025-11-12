import { createQueryHook } from "@/hooks/use-query-factory";
import { type UserWithRole } from "../services/auth-service";
import { createMutationHook } from "@/hooks/use-mutation-factory";
import {
  PermissionEnum,
  roleAndPermissionsService,
  type GetAllPermissionsResponse,
} from "../services/role-and-permissions-service";

export const useGetAllPermissions = createQueryHook<GetAllPermissionsResponse>(
  ["roles", "permissions"],
  roleAndPermissionsService.getAllPermissions as never
);

export const useCreateRole = createMutationHook(
  roleAndPermissionsService.createRole
);

export const hasPermission = (
  user: UserWithRole | undefined,
  module: string,
  permission: PermissionEnum
) => {
  if (!user?.role?.rolePermissions) return false;
  return user.role.rolePermissions.some(
    (rp) =>
      rp.permission.module === module && rp.permission.permission === permission
  );
};
