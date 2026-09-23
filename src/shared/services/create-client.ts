import { endpoints } from "../data";
import type { Client, CreateClientDto } from "../types/client";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const createClient = async (
  payload: CreateClientDto,
): Promise<Client> => {
  const res = await authenticatedFetch(endpoints.CLIENTS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await fetchErrorMessage(res, "Error al crear cliente"));
  }

  return (await res.json()) as Client;
};
