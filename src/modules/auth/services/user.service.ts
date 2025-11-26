import type { BaseResponse } from "@/common/interfaces/base-response";
import apiClient from "@/lib/api";
import z from "zod";
import type { Role } from "./role-and-permissions.service";

export const createUserSchema = z.object({
  fullName: z.string().min(3).max(200),
  password: z.string().min(6).max(18),
  phone: z.string().min(6).max(18),
  roleId: z.uuid(),
  email: z.email().min(5).max(50),
  // Accept a browser File for profile image in create flow
  // Optional: backend can handle absence of image
  profileImage: z.any().optional(),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export const updateUserSchema = z.object({
  fullName: z.string().min(3).max(200),
  password: z.string().min(6).max(18).optional(),
  phone: z.string().min(6).max(18).optional(),
  roleId: z.uuid().optional(),
  email: z.email().min(5).max(50).optional(),
  profileImage: z.any().optional(),
});

export type UpdateUserDto = z.infer<typeof updateUserSchema>;

export interface GetAllUsersResponse extends BaseResponse {
  data: UserWithRole[];
}

export interface GetUserResponse extends BaseResponse {
  data: UserWithRole;
}

export interface UserDeletedResponse extends BaseResponse {
  data: null;
}

export interface UserWithRole {
  id: string;
  email: string;
  fullName: string;
  phone: string;
  isBanned: boolean;
  profileImageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date;
  twoFactorEnabled: boolean;
  roleId: string;
  role: Role;
}

export const userService = {
  getAllUsers: () => apiClient.get<GetAllUsersResponse>("/users"),
  getUserById: (params: { id: string }) =>
    apiClient.get<GetUserResponse>(`/users/${params.id}`),
  createUser: (data: FormData) =>
    apiClient.post("/users", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateUser: (payload: UpdateUserDto & { id: string }) => {
    const { id, ...data } = payload;
    return apiClient.patch<GetUserResponse>(`/users/${id}`, data);
  },
  deleteUser: (id: string) =>
    apiClient.delete<UserDeletedResponse>(`/users/${id}`),
};
