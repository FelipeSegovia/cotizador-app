import type { Quotation } from "../types/quotation";

interface GetQuotationsParams {
  signal?: AbortSignal;
}

export const getQuotations = async (
  params: GetQuotationsParams = {},
): Promise<Quotation[]> => {
  const { signal } = params;
  const res = await fetch("/api/quotations", { signal });

  if (!res.ok) {
    throw new Error("Error al obtener las cotizaciones");
  }

  return (await res.json()) as Quotation[];
};
