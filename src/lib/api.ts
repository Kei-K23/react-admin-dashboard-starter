import axiosInstance from "../lib/axios";

export interface ApiResponse<T> {
  data: T;
  message?: string;
  status: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
}

// Generic HTTP methods
export const apiClient = {
  get: <T>(url: string, params?: Record<string, string>) =>
    axiosInstance.get<ApiResponse<T>>(url, { params }),

  post: <T>(url: string, data?: Record<string, string>) =>
    axiosInstance.post<ApiResponse<T>>(url, data),

  put: <T>(url: string, data?: Record<string, string>) =>
    axiosInstance.put<ApiResponse<T>>(url, data),

  patch: <T>(url: string, data?: Record<string, string>) =>
    axiosInstance.patch<ApiResponse<T>>(url, data),

  delete: <T>(url: string) => axiosInstance.delete<ApiResponse<T>>(url),
};

export default apiClient;
