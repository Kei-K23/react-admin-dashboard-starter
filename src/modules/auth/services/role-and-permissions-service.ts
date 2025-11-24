import type { BaseResponse } from "@/common/interfaces/base-response";
import apiClient from "@/lib/api";
import z from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(5).optional(),
  permissionIds: z.array(z.string()).nonempty(),
});

export type CreateRoleDto = z.infer<typeof createRoleSchema>;

export interface GetAllRolesResponse extends BaseResponse {
  data: Role[];
}

export interface GetAllPermissionsResponse extends BaseResponse {
  data: PermissionClass[];
}

export interface Role {
  id: string;
  name: string;
  description: string;
  rolePermissions: RolePermission[];
  createdAt: Date;
  updatedAt: Date;
}

export interface RolePermission {
  id: string;
  roleId: string;
  permissionId: string;
  permission: PermissionClass;
}

export interface PermissionClass {
  id: string;
  module: string;
  permission: PermissionEnum;
}

export enum PermissionEnum {
  Create = "CREATE",
  Delete = "DELETE",
  Read = "READ",
  Update = "UPDATE",
}

export const roleAndPermissionsService = {
  getAllRoles: () => apiClient.get<GetAllRolesResponse>("/roles"),
  getAllPermissions: () =>
    apiClient.get<GetAllPermissionsResponse>("/roles/permissions"),
  createRole: (data: CreateRoleDto) => apiClient.post("/roles", data),
};
