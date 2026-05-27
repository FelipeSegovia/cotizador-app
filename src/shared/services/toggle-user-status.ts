import { endpoints } from "../data";
import type { User } from "../types/auth";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const toggleUserStatus = async (id: string): Promise<User> => {
  const res = await authenticatedFetch(endpoints.USER_TOGGLE_STATUS(id), {
    method: "PATCH",
  });

  if (!res.ok) {
    throw new Error(
      await fetchErrorMessage(res, "Error al cambiar estado del usuario"),
    );
  }

  return (await res.json()) as User;
};
