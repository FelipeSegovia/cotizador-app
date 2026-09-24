import { endpoints } from "../data";
import type { AcceptInvitationDto } from "../types/auth";
import { getApiBaseUrl } from "../utils";
import { fetchErrorMessage } from "../utils";

export const acceptInvitation = async (
  payload: AcceptInvitationDto,
): Promise<{ message: string }> => {
  const res = await fetch(`${getApiBaseUrl()}${endpoints.ACCEPT_INVITATION}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(
      await fetchErrorMessage(res, "Error al aceptar la invitación"),
    );
  }

  return (await res.json()) as { message: string };
};
