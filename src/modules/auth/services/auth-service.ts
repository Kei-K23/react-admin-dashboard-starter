import type { BaseResponse } from "@/common/interfaces/base-response";
import apiClient from "@/lib/api";
import z from "zod";
import type { Role } from "./role-and-permissions-service";

export const loginSchema = z.object({
  email: z.email().min(3).max(50),
  password: z.string().min(6).max(18),
});

export type LoginDto = z.infer<typeof loginSchema>;

export interface LoginResponse extends BaseResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    accessTokenExpiresAt: string;
    refreshTokenExpiresAt: string;
    user: {
      id: string;
    };
  };
}

export interface RefreshResponse extends BaseResponse {
  data: {
    accessToken: string;
    accessTokenExpiresAt: string;
    user: {
      id: string;
    };
  };
}

export interface GetProfileResponse extends BaseResponse {
  data: UserWithRole;
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

export const authService = {
  getProfile: () => apiClient.get<GetProfileResponse>("/auth/profile"),
  login: (data: LoginDto) => apiClient.post<LoginResponse>("/auth/login", data),
  refresh: (refreshToken: string) =>
    apiClient.post<RefreshResponse>("/auth/refresh", { refreshToken }),
};
