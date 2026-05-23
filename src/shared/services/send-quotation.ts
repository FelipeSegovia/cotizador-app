import type { Quotation } from "../types/quotation";
import { fetchErrorMessage } from "../utils";
import { quotationFetch } from "./quotation-fetch";

/**
 * Envía la cotización al cliente por correo y transiciona su estado de `draft` a `sent`.
 */
export const sendQuotation = async (quotationId: string): Promise<Quotation> => {
  const response = await quotationFetch(`/${quotationId}/send`, {
    method: "POST",
  });

  if (!response.ok) {
    const message = await fetchErrorMessage(
      response,
      "No se pudo enviar la cotización",
    );
    throw new Error(message);
  }

  return (await response.json()) as Quotation;
};
