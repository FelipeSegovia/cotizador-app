import { endpoints } from "../data";
import type { Company, CompanyWriteDto } from "../types/company";
import fetchErrorMessage from "../utils/fetch-error-message";
import { stripRutForApi } from "../utils";
import { authenticatedFetch } from "./authenticated-fetch";

export const saveCompany = async (
  body: CompanyWriteDto,
): Promise<Company> => {
  const payload: CompanyWriteDto = {
    ...body,
    name: body.name.trim(),
    rut: stripRutForApi(body.rut),
    address: body.address?.trim() ?? "",
    city: body.city?.trim() ?? "",
    contact: body.contact?.trim() ?? "",
  };

  const res = await authenticatedFetch(endpoints.COMPANY, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const message = await fetchErrorMessage(
      res,
      "No se pudieron guardar los datos de la empresa",
    );
    throw new Error(message);
  }

  return (await res.json()) as Company;
};
