import type { CreateQuotationDto, Quotation } from "../types/quotation";
import { fetchErrorMessage } from "../utils";
import { quotationFetch } from "./quotation-fetch";

export const createQuotation = async (
  payload: CreateQuotationDto,
): Promise<Quotation> => {
  const response = await quotationFetch("", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await fetchErrorMessage(
      response,
      "No se pudo guardar la cotizacion",
    );
    throw new Error(message);
  }

  return (await response.json()) as Quotation;
};

export const updateQuotation = async (
  quotationId: string,
  payload: CreateQuotationDto,
): Promise<Quotation> => {
  const response = await quotationFetch(`/${quotationId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await fetchErrorMessage(
      response,
      "No se pudo actualizar la cotizacion",
    );
    throw new Error(message);
  }

  return (await response.json()) as Quotation;
};
