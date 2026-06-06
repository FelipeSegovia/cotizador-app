import { endpoints } from "../data";
import type { ResetPasswordDto } from "../types/auth";
import { fetchErrorMessage, getApiBaseUrl } from "../utils";

export const resetPassword = async (
  body: ResetPasswordDto,
): Promise<{ message: string }> => {
  const response = await fetch(
    `${getApiBaseUrl()}${endpoints.RESET_PASSWORD}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const message = await fetchErrorMessage(
      response,
      "No se pudo restablecer la contraseña",
    );
    throw new Error(message);
  }

  return (await response.json()) as { message: string };
};
