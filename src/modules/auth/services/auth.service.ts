import type { BaseResponse } from "@/common/interfaces/base-response";
import apiClient from "@/lib/api";
import z from "zod";
import type { UserWithRole } from "./user.service";

export const loginSchema = z.object({
  email: z.string().email().min(3).max(50),
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

export const authService = {
  getProfile: () => apiClient.get<GetProfileResponse>("/auth/profile"),
  login: (data: LoginDto) => apiClient.post<LoginResponse>("/auth/login", data),
  refresh: (refreshToken: string) =>
    apiClient.post<RefreshResponse>("/auth/refresh", { refreshToken }),
};
