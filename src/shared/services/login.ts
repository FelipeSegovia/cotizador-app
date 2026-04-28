import { endpoints } from "../data";
import type { AuthResponse } from "../types/auth";
import { fetchErrorMessage } from "../utils";

const login = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL_API}${endpoints.LOGIN}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    },
  );

  if (!response.ok) {
    const message = await fetchErrorMessage(response, "Login fallido");
    throw new Error(message);
  }

  return (await response.json()) as AuthResponse;
};

export default login;
