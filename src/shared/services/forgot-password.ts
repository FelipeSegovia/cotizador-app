import { endpoints } from "../data";
import type { ForgotPasswordDto } from "../types/auth";
import { fetchErrorMessage, getApiBaseUrl } from "../utils";

export const forgotPassword = async (
  body: ForgotPasswordDto,
): Promise<{ message: string }> => {
  const response = await fetch(
    `${getApiBaseUrl()}${endpoints.FORGOT_PASSWORD}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const message = await fetchErrorMessage(
      response,
      "No se pudo enviar el código de recuperación",
    );
    throw new Error(message);
  }

  return (await response.json()) as { message: string };
};
