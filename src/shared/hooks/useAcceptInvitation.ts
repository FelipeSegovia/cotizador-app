import { useMutation } from "@tanstack/react-query";
import { acceptInvitation } from "../services";
import type { AcceptInvitationDto } from "../types/auth";

export const useAcceptInvitation = () => {
  return useMutation({
    mutationFn: (payload: AcceptInvitationDto) => acceptInvitation(payload),
  });
};
