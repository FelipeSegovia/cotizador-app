import type { Company } from "../../shared/types/company";
import { DEMO_COMPANY_ID } from "./users";

export const mockCompanies: Company[] = [
  {
    id: DEMO_COMPANY_ID,
    name: "QuoteFlow SpA",
    rut: "76.123.456-7",
    address: "Av. Providencia 1234",
    city: "Santiago",
    contact: "+56 2 2345 6789",
    logoUrl: null,
    createdAt: "2026-01-10T10:00:00.000Z",
    updatedAt: "2026-05-01T12:00:00.000Z",
  },
];
