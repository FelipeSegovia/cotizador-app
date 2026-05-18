import type {
  ManualQuotationStatusTransition,
  Quotation,
  UpdateQuotationStatusDto,
} from "../types/quotation";
import { fetchErrorMessage } from "../utils";
import { quotationFetch } from "./quotation-fetch";

/**
 * Actualiza el estado de una cotización.
 *
 * Reglas de negocio (validadas en el backend):
 * - Solo cotizaciones en estado `sent` pueden cambiar de estado manualmente.
 * - Si la cotización está `sent` pero su `validUntil` ya pasó, el backend
 *   responde 409 (Conflict) y persiste la transición automática a `expired`.
 */
export const updateQuotationStatus = async (
  quotationId: string,
  status: ManualQuotationStatusTransition,
): Promise<Quotation> => {
  const body: UpdateQuotationStatusDto = { status };

  const response = await quotationFetch(`/${quotationId}/status`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const message = await fetchErrorMessage(
      response,
      "No se pudo actualizar el estado de la cotizacion",
    );
    throw new Error(message);
  }

  return (await response.json()) as Quotation;
};
