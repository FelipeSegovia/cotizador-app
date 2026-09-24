import { endpoints } from "../data";
import type { Client, CreateClientActivityDto } from "../types/client";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const createClientActivity = async (
  id: string,
  payload: CreateClientActivityDto,
): Promise<Client> => {
  const res = await authenticatedFetch(endpoints.CLIENT_ACTIVITIES(id), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(
      await fetchErrorMessage(res, "Error al agregar actividad"),
    );
  }

  return (await res.json()) as Client;
};
