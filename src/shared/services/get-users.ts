import { endpoints } from "../data";
import type { User } from "../types/auth";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const getUsers = async (signal?: AbortSignal): Promise<User[]> => {
  const res = await authenticatedFetch(endpoints.USERS, { signal });

  if (!res.ok) {
    throw new Error(await fetchErrorMessage(res, "Error al obtener usuarios"));
  }

  return (await res.json()) as User[];
};
