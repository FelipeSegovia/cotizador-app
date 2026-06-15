import { http, HttpResponse } from "msw";
import DEFAULT_TERMS from "../../shared/data/default-terms";
import type { Company } from "../../shared/types/company";
import type { CompanyTerms, CompanyTermsWriteDto } from "../../shared/types/terms";
import { mockApiPath } from "../mock-api-path";

type JwtPayload = {
  sub: string;
  email: string;
  name: string;
  iat: number;
  exp: number;
};

const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
};

const parseJwtPayload = (token: string): JwtPayload | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }
    const payload = decodeBase64Url(parts[1]);
    return JSON.parse(payload) as JwtPayload;
  } catch {
    return null;
  }
};

const getBearerToken = (request: Request): string | null => {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return null;
  }
  return authHeader.replace("Bearer ", "");
};

const companiesByUserId = new Map<string, Company>();

type StoredCompanyTerms = {
  terms: string[];
  updatedAt: string;
};

const termsByUserId = new Map<string, StoredCompanyTerms>();

const getTermsForUser = (userId: string): StoredCompanyTerms => {
  const existing = termsByUserId.get(userId);
  if (existing) {
    return existing;
  }

  const seeded: StoredCompanyTerms = {
    terms: [...DEFAULT_TERMS],
    updatedAt: new Date().toISOString(),
  };
  termsByUserId.set(userId, seeded);
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

export const companyHandlers = [
  http.get(mockApiPath("/api/company"), ({ request }) => {
    const token = getBearerToken(request);
    if (!token) {
      return HttpResponse.json(
        { message: "Token no proporcionado" },
        { status: 401 },
      );
    }

    const payload = parseJwtPayload(token);
    if (!payload || Date.now() > payload.exp * 1000) {
      return HttpResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const company = companiesByUserId.get(payload.sub);
    if (!company) {
      return HttpResponse.json(
        { message: "Empresa no configurada" },
        { status: 404 },
      );
    }

    return HttpResponse.json(company, { status: 200 });
  }),

  http.put(mockApiPath("/api/company"), async ({ request }) => {
    const token = getBearerToken(request);
    if (!token) {
      return HttpResponse.json(
        { message: "Token no proporcionado" },
        { status: 401 },
      );
    }

    const payload = parseJwtPayload(token);
    if (!payload || Date.now() > payload.exp * 1000) {
      return HttpResponse.json({ message: "Token inválido" }, { status: 401 });
    }

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

    const now = new Date().toISOString();
    const existing = companiesByUserId.get(payload.sub);
    const logoEntry = formData.get("logo");
    const logoUrl =
      logoEntry instanceof File && logoEntry.size > 0
        ? URL.createObjectURL(logoEntry)
        : (existing?.logoUrl ?? null);

    const company: Company = {
      id: existing?.id ?? crypto.randomUUID(),
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
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    companiesByUserId.set(payload.sub, company);

    return HttpResponse.json(company, { status: 200 });
  }),

  http.get(mockApiPath("/api/company/terms"), ({ request }) => {
    const token = getBearerToken(request);
    if (!token) {
      return HttpResponse.json(
        { message: "Token no proporcionado" },
        { status: 401 },
      );
    }

    const payload = parseJwtPayload(token);
    if (!payload || Date.now() > payload.exp * 1000) {
      return HttpResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const stored = getTermsForUser(payload.sub);
    const response: CompanyTerms = {
      terms: stored.terms,
      updatedAt: stored.updatedAt,
    };

    return HttpResponse.json(response, { status: 200 });
  }),

  http.put(mockApiPath("/api/company/terms"), async ({ request }) => {
    const token = getBearerToken(request);
    if (!token) {
      return HttpResponse.json(
        { message: "Token no proporcionado" },
        { status: 401 },
      );
    }

    const payload = parseJwtPayload(token);
    if (!payload || Date.now() > payload.exp * 1000) {
      return HttpResponse.json({ message: "Token inválido" }, { status: 401 });
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

    termsByUserId.set(payload.sub, stored);

    const response: CompanyTerms = {
      terms: stored.terms,
      updatedAt: stored.updatedAt,
    };

    return HttpResponse.json(response, { status: 200 });
  }),
];
