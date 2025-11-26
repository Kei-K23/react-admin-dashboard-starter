import type { BaseResponse } from "@/common/interfaces/base-response";
import apiClient from "@/lib/api";
import z from "zod";

export const createRoleSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(5).optional(),
  permissionIds: z.array(z.string()).nonempty(),
});

export type CreateRoleDto = z.infer<typeof createRoleSchema>;

// Update role schema and DTO
export const updateRoleSchema = z.object({
  name: z.string().min(3).max(200),
  description: z.string().min(5).optional(),
  permissionIds: z.array(z.string()).nonempty(),
});

export type UpdateRoleDto = z.infer<typeof updateRoleSchema>;

export interface GetAllRolesResponse extends BaseResponse {
  data: Role[];
}

export interface GetRoleResponse extends BaseResponse {
  data: Role;
}

export interface GetAllPermissionsResponse extends BaseResponse {
  data: PermissionClass[];
}

export interface RoleDeletedResponse extends BaseResponse {
  data: null;
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
  getRoleById: (params: { id: string }) =>
    apiClient.get<GetRoleResponse>(`/roles/${params.id}`),
  getAllPermissions: () =>
    apiClient.get<GetAllPermissionsResponse>("/roles/permissions"),
  createRole: (data: CreateRoleDto) => apiClient.post("/roles", data),
  updateRole: (payload: UpdateRoleDto & { id: string }) => {
    const { id, ...data } = payload;
    return apiClient.patch<GetRoleResponse>(`/roles/${id}`, data);
  },
  deleteRole: (id: string) =>
    apiClient.delete<RoleDeletedResponse>(`/roles/${id}`),
};
