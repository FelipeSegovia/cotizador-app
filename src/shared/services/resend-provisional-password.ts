import { endpoints } from "../data";
import type { User } from "../types/auth";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

type ResendPasswordResponse = {
  message: string;
  user: User;
};

export const resendProvisionalPassword = async (
  id: string,
): Promise<ResendPasswordResponse> => {
  const res = await authenticatedFetch(endpoints.USER_RESEND_PASSWORD(id), {
    method: "POST",
  });

  if (!res.ok) {
    throw new Error(
      await fetchErrorMessage(res, "Error al reenviar contraseña provisional"),
    );
  }

  return (await res.json()) as ResendPasswordResponse;
};
