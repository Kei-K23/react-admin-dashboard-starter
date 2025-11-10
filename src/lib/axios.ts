import {
  ACCESS_TOKEN_KEY,
  BASE_URL,
  REFRESH_TOKEN_KEY,
} from "@/common/constraints";
import axios from "axios";
import Cookies from "js-cookie";

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = Cookies.get(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor with refresh flow
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const originalRequest = error.config;
    const isLoginRoute = window.location.pathname.startsWith("/auth/login");
    const isLoginRequest =
      typeof originalRequest?.url === "string" &&
      originalRequest.url.includes("/auth/login");
    const isRefreshRequest =
      typeof originalRequest?.url === "string" &&
      originalRequest.url.includes("/auth/refresh");

    if (status === 401) {
      const refreshToken = Cookies.get(REFRESH_TOKEN_KEY);

      // Don't attempt refresh for login failure or if no refresh token
      if (!refreshToken || isLoginRequest || isRefreshRequest) {
        Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
        Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
        if (!isLoginRoute) {
          window.location.href = "/auth/login";
        }
        return Promise.reject(error);
      }

      // Ensure a single refresh inflight and queue retries
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = axios
          .post(
            `${BASE_URL}/auth/refresh`,
            { refreshToken },
            { headers: { "Content-Type": "application/json" } }
          )
          .then((res) => {
            const newAccessToken: string = res.data?.data?.accessToken;
            Cookies.set(ACCESS_TOKEN_KEY, newAccessToken, { path: "/" });
            return newAccessToken;
          })
          .catch((refreshError) => {
            Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
            Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
            if (!isLoginRoute) {
              window.location.href = "/auth/login";
            }
            throw refreshError;
          })
          .finally(() => {
            isRefreshing = false;
          });
      }

      return (refreshPromise as Promise<string>)
        .then((token) => {
          // Retry original request with new access token
          originalRequest.headers = originalRequest.headers || {};
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return axiosInstance(originalRequest);
        })
        .catch(() => Promise.reject(error));
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
