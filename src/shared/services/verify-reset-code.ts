import { endpoints } from "../data";
import type { VerifyResetCodeDto } from "../types/auth";
import { fetchErrorMessage, getApiBaseUrl } from "../utils";

export const verifyResetCode = async (
  body: VerifyResetCodeDto,
): Promise<{ message: string }> => {
  const response = await fetch(
    `${getApiBaseUrl()}${endpoints.VERIFY_RESET_CODE}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    },
  );

  if (!response.ok) {
    const message = await fetchErrorMessage(
      response,
      "El código de verificación es inválido",
    );
    throw new Error(message);
  }

  return (await response.json()) as { message: string };
};
