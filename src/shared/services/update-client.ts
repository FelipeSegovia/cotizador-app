import { endpoints } from "../data";
import type { Client, UpdateClientDto } from "../types/client";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const updateClient = async (
  id: string,
  payload: UpdateClientDto,
): Promise<Client> => {
  const res = await authenticatedFetch(endpoints.CLIENT_BY_ID(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(
      await fetchErrorMessage(res, "Error al actualizar cliente"),
    );
  }

  return (await res.json()) as Client;
};
