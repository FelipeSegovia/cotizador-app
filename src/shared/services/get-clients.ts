import { endpoints } from "../data";
import type { Client } from "../types/client";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const getClients = async (signal?: AbortSignal): Promise<Client[]> => {
  const res = await authenticatedFetch(endpoints.CLIENTS, { signal });

  if (!res.ok) {
    throw new Error(await fetchErrorMessage(res, "Error al obtener clientes"));
  }

  return (await res.json()) as Client[];
};
