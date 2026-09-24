import { endpoints } from "../data";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const deleteClient = async (id: string): Promise<void> => {
  const res = await authenticatedFetch(endpoints.CLIENT_BY_ID(id), {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(await fetchErrorMessage(res, "Error al eliminar cliente"));
  }
};
