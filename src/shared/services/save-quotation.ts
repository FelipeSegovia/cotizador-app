import { endpoints } from "../data";
import type { CreateQuotationDto, Quotation } from "../types/quotation";
import { fetchErrorMessage } from "../utils";

export const createQuotation = async (
  payload: CreateQuotationDto,
): Promise<Quotation> => {
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL_API}${endpoints.QUOTATIONS}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

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
  const response = await fetch(
    `${import.meta.env.VITE_BASE_URL_API}${endpoints.QUOTATIONS}/${quotationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const message = await fetchErrorMessage(
      response,
      "No se pudo actualizar la cotizacion",
    );
    throw new Error(message);
  }

  return (await response.json()) as Quotation;
};
