import { endpoints } from "../data";
import type { Company } from "../types/company";
import fetchErrorMessage from "../utils/fetch-error-message";
import { authenticatedFetch } from "./authenticated-fetch";

type GetCompanyParams = {
  signal?: AbortSignal;
};

export const getCompany = async (
  params: GetCompanyParams = {},
): Promise<Company | null> => {
  const { signal } = params;
  const res = await authenticatedFetch(endpoints.COMPANY, { signal });

  if (res.status === 404) {
    return null;
  }

  if (!res.ok) {
    const message = await fetchErrorMessage(
      res,
      "No se pudieron obtener los datos de la empresa",
    );
    throw new Error(message);
  }

  return (await res.json()) as Company;
};
