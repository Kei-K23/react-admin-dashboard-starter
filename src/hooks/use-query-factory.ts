import type { ApiError, ApiResponse } from "@/lib/api";
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
  type QueryKey,
} from "@tanstack/react-query";

// Generic query hook factory
export const createQueryHook = <TData, TError = ApiError>(
  key: QueryKey,
  fetcher: () => Promise<ApiResponse<TData>>,
  options?: Omit<
    UseQueryOptions<ApiResponse<TData>, TError, TData>,
    "queryKey" | "queryFn" | "select"
  >
) => {
  return (): UseQueryResult<TData, TError> => {
    const result = useQuery<ApiResponse<TData>, TError, TData>({
      queryKey: key,
      queryFn: fetcher,
      select: (response) => response.data,
      ...options,
    });

    return result;
  };
};

// Paginated query hook factory
export const createPaginatedQueryHook = <TData, TError = ApiError>(
  key: QueryKey,
  fetcher: (params: Record<string, string>) => Promise<ApiResponse<TData[]>>,
  options?: Omit<
    UseQueryOptions<ApiResponse<TData[]>, TError, TData[]>,
    "queryKey" | "queryFn" | "select"
  >
) => {
  return (params?: Record<string, string>): UseQueryResult<TData[], TError> => {
    const queryKey = [...key, params];

    const result = useQuery<ApiResponse<TData[]>, TError, TData[]>({
      queryKey,
      queryFn: () => fetcher(params || {}),
      select: (response) => response.data ?? [],
      ...options,
    });

    return result;
  };
};
