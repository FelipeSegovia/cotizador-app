import { endpoints } from "../data";
import type { Company, CompanyWriteDto } from "../types/company";
import fetchErrorMessage from "../utils/fetch-error-message";
import { stripRutForApi } from "../utils";
import { authenticatedFetch } from "./authenticated-fetch";

export const saveCompany = async (
  body: CompanyWriteDto,
  logoFile?: File | null,
): Promise<Company> => {
  const formData = new FormData();
  formData.append("name", body.name.trim());
  formData.append("rut", stripRutForApi(body.rut));
  formData.append("address", body.address?.trim() ?? "");
  formData.append("city", body.city?.trim() ?? "");
  formData.append("contact", body.contact?.trim() ?? "");

  if (logoFile) {
    formData.append("logo", logoFile);
  }

  const res = await authenticatedFetch(endpoints.COMPANY, {
    method: "PUT",
    body: formData,
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
