import { endpoints } from "../data";
import type { CreateInvitationDto, Invitation } from "../types/auth";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const getInvitations = async (
  signal?: AbortSignal,
  companyId?: string,
): Promise<Invitation[]> => {
  const url = companyId
    ? `${endpoints.INVITATIONS}?companyId=${encodeURIComponent(companyId)}`
    : endpoints.INVITATIONS;

  const res = await authenticatedFetch(url, { signal });

  if (!res.ok) {
    throw new Error(
      await fetchErrorMessage(res, "Error al obtener invitaciones"),
    );
  }

  return (await res.json()) as Invitation[];
};

export const createInvitation = async (
  payload: CreateInvitationDto,
): Promise<Invitation> => {
  const res = await authenticatedFetch(endpoints.INVITATIONS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(
      await fetchErrorMessage(res, "Error al enviar la invitación"),
    );
  }

  return (await res.json()) as Invitation;
};

export const revokeInvitation = async (id: string): Promise<void> => {
  const res = await authenticatedFetch(endpoints.INVITATION_BY_ID(id), {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(
      await fetchErrorMessage(res, "Error al revocar la invitación"),
    );
  }
};
