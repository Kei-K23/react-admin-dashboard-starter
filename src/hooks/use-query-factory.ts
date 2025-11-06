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
    UseQueryOptions<ApiResponse<TData>, TError>,
    "queryKey" | "queryFn"
  >
) => {
  return (): UseQueryResult<TData, TError> => {
    const result = useQuery<ApiResponse<TData>, TError>({
      queryKey: key,
      queryFn: fetcher,
      ...options,
    });

    return {
      ...result,
      data: result.data?.data,
    } as UseQueryResult<TData, TError>;
  };
};

// Paginated query hook factory
export const createPaginatedQueryHook = <TData, TError = ApiError>(
  key: QueryKey,
  fetcher: (params: Record<string, string>) => Promise<ApiResponse<TData[]>>,
  options?: Omit<
    UseQueryOptions<ApiResponse<TData[]>, TError>,
    "queryKey" | "queryFn"
  >
) => {
  return (params?: Record<string, string>): UseQueryResult<TData[], TError> => {
    const queryKey = [...key, params];

    const result = useQuery<ApiResponse<TData[]>, TError>({
      queryKey,
      queryFn: () => fetcher(params || {}),
      ...options,
    });

    return {
      ...result,
      data: result.data?.data || [],
    } as UseQueryResult<TData[], TError>;
  };
};
