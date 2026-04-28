import type { CreateQuotationDto, Quotation } from "../types/quotation";

const resolveErrorMessage = async (
  response: Response,
  fallbackMessage: string,
) => {
  try {
    const data = (await response.json()) as { message?: string };
    return data.message ?? fallbackMessage;
  } catch {
    return fallbackMessage;
  }
};

export const createQuotation = async (
  payload: CreateQuotationDto,
): Promise<Quotation> => {
  const response = await fetch(import.meta.env.VITE_BASE_URL_MOCK, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await resolveErrorMessage(
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
    `${import.meta.env.VITE_BASE_URL_MOCK}/${quotationId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    },
  );

  if (!response.ok) {
    const message = await resolveErrorMessage(
      response,
      "No se pudo actualizar la cotizacion",
    );
    throw new Error(message);
  }

  return (await response.json()) as Quotation;
};
