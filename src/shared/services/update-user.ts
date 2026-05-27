import { endpoints } from "../data";
import type { UpdateUserDto, User } from "../types/auth";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const updateUser = async (
  id: string,
  payload: UpdateUserDto,
): Promise<User> => {
  const res = await authenticatedFetch(endpoints.USER_BY_ID(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await fetchErrorMessage(res, "Error al actualizar usuario"));
  }

  return (await res.json()) as User;
};
