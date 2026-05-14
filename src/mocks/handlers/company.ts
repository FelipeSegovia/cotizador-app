import { http, HttpResponse } from "msw";
import type { Company, CompanyWriteDto } from "../../shared/types/company";
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

    const body = (await request.json()) as Partial<CompanyWriteDto>;
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const rut = typeof body.rut === "string" ? body.rut.trim() : "";

    if (!name || !rut) {
      return HttpResponse.json(
        { message: "Razón social y RUT son obligatorios" },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const existing = companiesByUserId.get(payload.sub);

    const company: Company = {
      id: existing?.id ?? crypto.randomUUID(),
      name,
      rut,
      address: typeof body.address === "string" ? body.address : "",
      city: typeof body.city === "string" ? body.city : "",
      contact: typeof body.contact === "string" ? body.contact : "",
      createdAt: existing?.createdAt ?? now,
      updatedAt: now,
    };

    companiesByUserId.set(payload.sub, company);

    return HttpResponse.json(company, { status: 200 });
  }),
];
