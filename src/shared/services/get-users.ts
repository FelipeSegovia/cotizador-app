import { endpoints } from "../data";
import type { User } from "../types/auth";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const getUsers = async (
  signal?: AbortSignal,
  companyId?: string,
): Promise<User[]> => {
  const url = companyId
    ? `${endpoints.USERS}?companyId=${encodeURIComponent(companyId)}`
    : endpoints.USERS;

  const res = await authenticatedFetch(url, { signal });

  if (!res.ok) {
    throw new Error(await fetchErrorMessage(res, "Error al obtener usuarios"));
  }

  return (await res.json()) as User[];
};
