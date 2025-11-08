import { createMutationHook } from "@/hooks/use-mutation-factory";
import { authService } from "../services/auth-services";

export const useLogin = createMutationHook(authService.login);
