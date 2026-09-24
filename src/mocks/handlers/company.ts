import { http, HttpResponse } from "msw";
import DEFAULT_TERMS from "../../shared/data/default-terms";
import type { Company, CompanyWriteDto } from "../../shared/types/company";
import type { CompanyTerms, CompanyTermsWriteDto } from "../../shared/types/terms";
import { mockCompanies } from "../data/companies";
import { mockUsers } from "../data/users";
import { mockApiPath } from "../mock-api-path";
import {
  getUserCompanyId,
  requireAdmin,
  requireAuth,
  requireBusiness,
} from "./auth-helpers";

type StoredCompanyTerms = {
  terms: string[];
  updatedAt: string;
};

const termsByCompanyId = new Map<string, StoredCompanyTerms>();

const getTermsForCompany = (companyId: string): StoredCompanyTerms => {
  const existing = termsByCompanyId.get(companyId);
  if (existing) {
    return existing;
  }

  const seeded: StoredCompanyTerms = {
    terms: [...DEFAULT_TERMS],
    updatedAt: new Date().toISOString(),
  };
  termsByCompanyId.set(companyId, seeded);
  return seeded;
};

const sanitizeTerms = (terms: unknown): string[] | null => {
  if (!Array.isArray(terms)) {
    return null;
  }

  const sanitized = terms
    .filter((term): term is string => typeof term === "string")
    .map((term) => term.trim())
    .filter((term) => term.length > 0);

  if (sanitized.length === 0) {
    return null;
  }

  return sanitized;
};

const findCompany = (companyId: string): Company | undefined =>
  mockCompanies.find((c) => c.id === companyId);

const parseCompanyBody = async (
  request: Request,
): Promise<CompanyWriteDto & { logoUrl?: string | null } | Response> => {
  const contentType = request.headers.get("Content-Type") ?? "";

  if (contentType.includes("multipart/form-data")) {
    const formData = await request.formData();
    const name =
      typeof formData.get("name") === "string"
        ? formData.get("name")!.toString().trim()
        : "";
    const rut =
      typeof formData.get("rut") === "string"
        ? formData.get("rut")!.toString().trim()
        : "";

    if (!name || !rut) {
      return HttpResponse.json(
        { message: "Razón social y RUT son obligatorios" },
        { status: 400 },
      );
    }

    const logoEntry = formData.get("logo");
    const logoUrl =
      logoEntry instanceof File && logoEntry.size > 0
        ? URL.createObjectURL(logoEntry)
        : undefined;

    return {
      name,
      rut,
      address:
        typeof formData.get("address") === "string"
          ? formData.get("address")!.toString()
          : "",
      city:
        typeof formData.get("city") === "string"
          ? formData.get("city")!.toString()
          : "",
      contact:
        typeof formData.get("contact") === "string"
          ? formData.get("contact")!.toString()
          : "",
      logoUrl,
    };
  }

  const body = (await request.json()) as CompanyWriteDto;
  const name = body.name?.trim() ?? "";
  const rut = body.rut?.trim() ?? "";
  if (!name || !rut) {
    return HttpResponse.json(
      { message: "Razón social y RUT son obligatorios" },
      { status: 400 },
    );
  }

  return {
    name,
    rut,
    address: body.address?.trim() ?? "",
    city: body.city?.trim() ?? "",
    contact: body.contact?.trim() ?? "",
  };
};

export const companyHandlers = [
  http.get(mockApiPath("/api/companies"), ({ request }) => {
    const auth = requireAdmin(request);
    if (auth instanceof Response) {
      return auth;
    }
    return HttpResponse.json(mockCompanies);
  }),

  http.post(mockApiPath("/api/companies"), async ({ request }) => {
    const auth = requireAdmin(request);
    if (auth instanceof Response) {
      return auth;
    }

    const parsed = await parseCompanyBody(request);
    if (parsed instanceof Response) {
      return parsed;
    }

    const now = new Date().toISOString();
    const company: Company = {
      id: `company-${Date.now()}`,
      name: parsed.name,
      rut: parsed.rut,
      address: parsed.address ?? "",
      city: parsed.city ?? "",
      contact: parsed.contact ?? "",
      logoUrl: parsed.logoUrl ?? null,
      createdAt: now,
      updatedAt: now,
    };

    mockCompanies.push(company);
    return HttpResponse.json(company, { status: 201 });
  }),

  http.get(mockApiPath("/api/company"), ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    if (auth.user.role === "admin") {
      return HttpResponse.json(
        { message: "Usa /api/companies para administrar empresas" },
        { status: 404 },
      );
    }

    const companyId = getUserCompanyId(auth.user.id);
    if (!companyId) {
      return HttpResponse.json(
        { message: "Empresa no configurada" },
        { status: 404 },
      );
    }

    const company = findCompany(companyId);
    if (!company) {
      return HttpResponse.json(
        { message: "Empresa no configurada" },
        { status: 404 },
      );
    }

    return HttpResponse.json(company);
  }),

  http.put(mockApiPath("/api/company"), async ({ request }) => {
    const auth = requireBusiness(request);
    if (auth instanceof Response) {
      return auth;
    }

    const parsed = await parseCompanyBody(request);
    if (parsed instanceof Response) {
      return parsed;
    }

    const now = new Date().toISOString();
    let companyId = getUserCompanyId(auth.user.id);
    let existing = companyId ? findCompany(companyId) : undefined;

    if (!existing) {
      companyId = `company-${Date.now()}`;
      const company: Company = {
        id: companyId,
        name: parsed.name,
        rut: parsed.rut,
        address: parsed.address ?? "",
        city: parsed.city ?? "",
        contact: parsed.contact ?? "",
        logoUrl: parsed.logoUrl ?? null,
        createdAt: now,
        updatedAt: now,
      };
      mockCompanies.push(company);

      const row = mockUsers.find((u) => u.id === auth.user.id);
      if (row) {
        row.companyId = companyId;
      }

      return HttpResponse.json(company);
    }

    existing.name = parsed.name;
    existing.rut = parsed.rut;
    existing.address = parsed.address ?? "";
    existing.city = parsed.city ?? "";
    existing.contact = parsed.contact ?? "";
    if (parsed.logoUrl !== undefined) {
      existing.logoUrl = parsed.logoUrl;
    }
    existing.updatedAt = now;

    return HttpResponse.json(existing);
  }),

  http.get(mockApiPath("/api/company/terms"), ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    const companyId = getUserCompanyId(auth.user.id);
    if (!companyId) {
      const response: CompanyTerms = {
        terms: [...DEFAULT_TERMS],
        updatedAt: new Date().toISOString(),
      };
      return HttpResponse.json(response);
    }

    const stored = getTermsForCompany(companyId);
    return HttpResponse.json({
      terms: stored.terms,
      updatedAt: stored.updatedAt,
    } satisfies CompanyTerms);
  }),

  http.put(mockApiPath("/api/company/terms"), async ({ request }) => {
    const auth = requireBusiness(request);
    if (auth instanceof Response) {
      return auth;
    }

    const companyId = getUserCompanyId(auth.user.id);
    if (!companyId) {
      return HttpResponse.json(
        { message: "Configura la empresa antes de editar términos" },
        { status: 422 },
      );
    }

    const body = (await request.json()) as CompanyTermsWriteDto;
    const sanitized = sanitizeTerms(body.terms);

    if (!sanitized) {
      return HttpResponse.json(
        { message: "Debe enviar al menos un término con contenido" },
        { status: 400 },
      );
    }

    const stored: StoredCompanyTerms = {
      terms: sanitized,
      updatedAt: new Date().toISOString(),
    };

    termsByCompanyId.set(companyId, stored);

    return HttpResponse.json({
      terms: stored.terms,
      updatedAt: stored.updatedAt,
    } satisfies CompanyTerms);
  }),
];
