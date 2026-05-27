import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  changeCurrentUserPassword,
  createUser,
  resendProvisionalPassword,
  toggleUserStatus,
  updateUser,
} from "../services";
import type {
  ChangePasswordDto,
  CreateUserDto,
  UpdateUserDto,
  User,
} from "../types/auth";
import useAuthStore from "../store/useAuthStore";

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateUserDto) => createUser(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserDto }) =>
      updateUser(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useToggleUserStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => toggleUserStatus(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useResendProvisionalPassword = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => resendProvisionalPassword(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useChangeCurrentUserPassword = () => {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((s) => s.setUser);

  return useMutation({
    mutationFn: (payload: ChangePasswordDto) =>
      changeCurrentUserPassword(payload),
    onSuccess: (user: User) => {
      queryClient.setQueryData(["currentUser"], user);
      setUser(user);
    },
  });
};
