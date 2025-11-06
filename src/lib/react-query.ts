import { QueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import type { ApiError } from "./api";

// Error handler
const queryErrorHandler = (error: unknown) => {
  const axiosError = error as AxiosError<ApiError>;
  const message = axiosError.response?.data?.message || axiosError.message;

  // You can add toast notifications here
  console.error("Query Error:", message);
};

// Create query client with default options
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: (failureCount, error) => {
        const axiosError = error as AxiosError<ApiError>;
        if (
          axiosError.response?.status &&
          axiosError.response.status >= 400 &&
          axiosError.response.status < 500
        ) {
          return false; // Don't retry for client errors
        }
        return failureCount < 3; // Retry up to 3 times for other errors
      },
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes (cache time)
    },
    mutations: {
      onError: queryErrorHandler,
    },
  },
});
