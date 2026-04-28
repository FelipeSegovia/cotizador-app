import { endpoints } from "../data";
import type { User } from "../types/auth";

const getCurrentUser = async (token: string): Promise<User> => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL_API}${endpoints.GET_CURRENT_USER}`,
    {
      method: "GET",
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
