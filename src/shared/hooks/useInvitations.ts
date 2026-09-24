import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createInvitation,
  getInvitations,
  revokeInvitation,
} from "../services";
import type { CreateInvitationDto } from "../types/auth";
import useAuthStore from "../store/useAuthStore";
import { can } from "../utils";

export const useInvitations = (companyId?: string) => {
  const canFetch = useAuthStore((s) => s.getIsAuthenticated());
  const role = useAuthStore((s) => s.user?.role);

  return useQuery({
    queryKey: ["invitations", companyId ?? "all"],
    queryFn: ({ signal }) => getInvitations(signal, companyId),
    enabled: canFetch && can(role, "inviteUsers"),
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateInvitationDto) => createInvitation(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};

export const useRevokeInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => revokeInvitation(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};
