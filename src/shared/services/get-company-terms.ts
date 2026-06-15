import { endpoints } from "../data";
import type { CompanyTerms } from "../types/terms";
import fetchErrorMessage from "../utils/fetch-error-message";
import { authenticatedFetch } from "./authenticated-fetch";

type GetCompanyTermsParams = {
  signal?: AbortSignal;
};

export const getCompanyTerms = async (
  params: GetCompanyTermsParams = {},
): Promise<CompanyTerms> => {
  const { signal } = params;
  const res = await authenticatedFetch(endpoints.COMPANY_TERMS, { signal });

  if (!res.ok) {
    const message = await fetchErrorMessage(
      res,
      "No se pudieron obtener los términos y condiciones",
    );
    throw new Error(message);
  }

  return (await res.json()) as CompanyTerms;
};
