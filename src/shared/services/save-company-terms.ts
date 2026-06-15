import { endpoints } from "../data";
import type { CompanyTerms, CompanyTermsWriteDto } from "../types/terms";
import fetchErrorMessage from "../utils/fetch-error-message";
import { authenticatedFetch } from "./authenticated-fetch";

export const saveCompanyTerms = async (
  body: CompanyTermsWriteDto,
): Promise<CompanyTerms> => {
  const res = await authenticatedFetch(endpoints.COMPANY_TERMS, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const message = await fetchErrorMessage(
      res,
      "No se pudieron guardar los términos y condiciones",
    );
    throw new Error(message);
  }

  return (await res.json()) as CompanyTerms;
};
