import type { BaseResponse } from "@/common/interfaces/base-response";
import apiClient from "@/lib/api";
import z from "zod";

export const loginSchema = z.object({
  email: z.email().min(3).max(50),
  password: z.string().min(6).max(18),
});

export type LoginDto = z.infer<typeof loginSchema>;

export interface LoginResponse extends BaseResponse {
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      fullName: string;
    };
  };
}

export const authService = {
  login: (data: LoginDto) => apiClient.post<LoginResponse>("/auth/login", data),
};
