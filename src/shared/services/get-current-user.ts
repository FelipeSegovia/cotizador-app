import { endpoints } from "../data";
import type { User } from "../types/auth";

type GetCurrentUserParams = {
  signal?: AbortSignal;
};

const getCurrentUser = async (
  token: string,
  params: GetCurrentUserParams = {},
): Promise<User> => {
  const { signal } = params;
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL_API}${endpoints.GET_CURRENT_USER}`,
    {
      method: "GET",
      signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("No autorizado");
  }

  const data = (await response.json()) as { user: User };
  return data.user;
};

export default getCurrentUser;
