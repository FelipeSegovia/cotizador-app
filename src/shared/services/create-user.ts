import { endpoints } from "../data";
import type { CreateUserDto, User } from "../types/auth";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const createUser = async (payload: CreateUserDto): Promise<User> => {
  const res = await authenticatedFetch(endpoints.USERS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await fetchErrorMessage(res, "Error al crear usuario"));
  }

  return (await res.json()) as User;
};
