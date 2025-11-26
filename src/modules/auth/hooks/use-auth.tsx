import { createMutationHook } from "@/hooks/use-mutation-factory";
import { createQueryHook } from "@/hooks/use-query-factory";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import Cookies from "js-cookie";
import { authService, type GetProfileResponse } from "../services/auth.service";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "@/common/constraints";

export const useLogin = createMutationHook(authService.login);

export const useProfile = createQueryHook<GetProfileResponse>(
  ["auth", "profile"],
  authService.getProfile as never,
  {
    staleTime: 1000 * 60 * 5,
    retry: (failureCount, error) => {
      const status = error.response.data.statusCode;
      if (status === 401) return false;
      return failureCount < 3;
    },
    enabled: Boolean(Cookies.get(ACCESS_TOKEN_KEY)),
  }
);

export const useLogout = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return () => {
    Cookies.remove(ACCESS_TOKEN_KEY, { path: "/" });
    Cookies.remove(REFRESH_TOKEN_KEY, { path: "/" });
    queryClient.clear();
    navigate("/auth/login", { replace: true });
  };
};

export const useAuthStatus = () => {
  const isAuthenticated = Boolean(Cookies.get(ACCESS_TOKEN_KEY));
  return { isAuthenticated };
};
