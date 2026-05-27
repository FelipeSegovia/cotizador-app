import { endpoints } from "../data";
import type { ChangePasswordDto, User } from "../types/auth";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const changeCurrentUserPassword = async (
  payload: ChangePasswordDto,
): Promise<User> => {
  const res = await authenticatedFetch(endpoints.CHANGE_PASSWORD, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(
      await fetchErrorMessage(res, "Error al cambiar la contraseña"),
    );
  }

  return (await res.json()) as User;
};
