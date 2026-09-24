import { endpoints } from "../data";
import type { Company, CompanyWriteDto } from "../types/company";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const getCompanies = async (signal?: AbortSignal): Promise<Company[]> => {
  const res = await authenticatedFetch(endpoints.COMPANIES, { signal });

  if (!res.ok) {
    throw new Error(
      await fetchErrorMessage(res, "Error al obtener empresas"),
    );
  }

  return (await res.json()) as Company[];
};

export const createCompany = async (
  payload: CompanyWriteDto,
): Promise<Company> => {
  const res = await authenticatedFetch(endpoints.COMPANIES, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: payload.name,
      rut: payload.rut,
      address: payload.address || null,
      city: payload.city || null,
      contact: payload.contact || null,
    }),
  });

  if (!res.ok) {
    throw new Error(await fetchErrorMessage(res, "Error al crear la empresa"));
  }

  return (await res.json()) as Company;
};
