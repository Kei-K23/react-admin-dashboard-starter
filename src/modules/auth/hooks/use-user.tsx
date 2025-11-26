import { createQueryHook } from "@/hooks/use-query-factory";
import { createMutationHook } from "@/hooks/use-mutation-factory";
import {
  userService,
  type GetAllUsersResponse,
  type UserWithRole,
} from "../services/user.service";

export const useGetAllUsers = createQueryHook<GetAllUsersResponse>(
  ["users"],
  userService.getAllUsers as never
);

export const useGetUserById = (id: string) =>
  createQueryHook<UserWithRole>(
    ["users", "detail", id],
    userService.getUserById as never
  );

export const useCreateUser = createMutationHook(userService.createUser);

export const useDeleteUser = createMutationHook(userService.deleteUser, {
  invalidateQueries: [["users"]],
});

export const useUpdateUser = createMutationHook(userService.updateUser);
