import { mockUsers, type MockUser } from "../data/users";
import type { User, UserRole } from "../../shared/types/auth";

export type JwtPayload = {
  sub: string;
  email: string;
  name: string;
  mobilePhone?: string;
  role?: UserRole;
  isActive?: boolean;
  mustChangePassword?: boolean;
  iat: number;
  exp: number;
};

export const encodeBase64Url = (value: string): string => {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
};

export const decodeBase64Url = (value: string): string => {
  const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
  return atob(padded);
};

export const parseJwtPayload = (token: string): JwtPayload | null => {
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

export const toPublicUser = (row: MockUser): User => ({
  id: row.id,
  email: row.email,
  name: row.name,
  mobilePhone: row.mobilePhone ?? "",
  role: row.role,
  isActive: row.isActive,
  mustChangePassword: row.mustChangePassword,
  createdAt: row.createdAt,
  updatedAt: row.updatedAt,
});

export const getMockUserRow = (userId: string): MockUser | undefined =>
  mockUsers.find((u) => u.id === userId);

export const getUserCompanyId = (userId: string): string | null => {
  return getMockUserRow(userId)?.companyId ?? null;
};

export const generateMockJwt = (user: User, expInSeconds: number): string => {
  const nowInSeconds = Math.floor(Date.now() / 1000);

  const header = {
    alg: "HS256",
    typ: "JWT",
  };

  const payload: JwtPayload = {
    sub: user.id,
    email: user.email,
    name: user.name,
    mobilePhone: user.mobilePhone,
    role: user.role,
    isActive: user.isActive,
    mustChangePassword: user.mustChangePassword,
    iat: nowInSeconds,
    exp: nowInSeconds + expInSeconds,
  };

  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const mockSignature = encodeBase64Url("mock-signature");

  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

export const TOKEN_EXPIRY_SECONDS = 15 * 60;

export const validTokens: Map<string, { user: User; expiresAt: number }> =
  new Map();

export const getBearerToken = (request: Request): string | null => {
  const authHeader = request.headers.get("Authorization");
  return authHeader?.replace("Bearer ", "") ?? null;
};

export const resolveUserFromToken = (token: string): User | null => {
  const payload = parseJwtPayload(token);
  if (!payload) {
    validTokens.delete(token);
    return null;
  }

  if (Date.now() > payload.exp * 1000) {
    validTokens.delete(token);
    return null;
  }

  const dbUser = mockUsers.find((u) => u.id === payload.sub);
  if (dbUser && !dbUser.isActive) {
    validTokens.delete(token);
    return null;
  }

  const tokenData = validTokens.get(token);
  if (tokenData) {
    if (Date.now() > tokenData.expiresAt) {
      validTokens.delete(token);
      return null;
    }
    return tokenData.user;
  }

  if (!dbUser) {
    return null;
  }

  const user = toPublicUser(dbUser);
  validTokens.set(token, {
    user,
    expiresAt: payload.exp * 1000,
  });
  return user;
};

export const requireAuth = (
  request: Request,
): { token: string; user: User } | Response => {
  const token = getBearerToken(request);
  if (!token) {
    return new Response(
      JSON.stringify({ message: "Token no proporcionado" }),
      { status: 401, headers: { "Content-Type": "application/json" } },
    );
  }

  const user = resolveUserFromToken(token);
  if (!user) {
    return new Response(JSON.stringify({ message: "Token inválido o expirado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  return { token, user };
};

const forbidden = (message = "No tienes permisos para esta acción") =>
  new Response(JSON.stringify({ message }), {
    status: 403,
    headers: { "Content-Type": "application/json" },
  });

export const requireAdmin = (
  request: Request,
): { token: string; user: User } | Response => {
  const auth = requireAuth(request);
  if (auth instanceof Response) {
    return auth;
  }

  if (auth.user.role !== "admin") {
    return forbidden();
  }

  return auth;
};

export const requireAdminOrBusiness = (
  request: Request,
): { token: string; user: User } | Response => {
  const auth = requireAuth(request);
  if (auth instanceof Response) {
    return auth;
  }

  if (auth.user.role !== "admin" && auth.user.role !== "business") {
    return forbidden();
  }

  return auth;
};

export const requireBusiness = (
  request: Request,
): { token: string; user: User } | Response => {
  const auth = requireAuth(request);
  if (auth instanceof Response) {
    return auth;
  }

  if (auth.user.role !== "business") {
    return forbidden();
  }

  return auth;
};

export const requireOperational = (
  request: Request,
): { token: string; user: User } | Response => {
  const auth = requireAuth(request);
  if (auth instanceof Response) {
    return auth;
  }

  if (auth.user.role === "admin") {
    return forbidden("Los administradores de plataforma no operan este recurso");
  }

  return auth;
};

export const simulateInvitationEmail = (params: {
  to: string;
  name: string;
  token: string;
}) => {
  const link = `${typeof window !== "undefined" ? window.location.origin : ""}/invitar?token=${params.token}`;
  console.info("[MSW] Correo simulado — Invitación a QuoteFlow", {
    to: params.to,
    subject: "Te invitaron a QuoteFlow",
    body: `Hola ${params.name}, acepta tu invitación en: ${link}`,
  });
};
