import { http, HttpResponse } from "msw";
import { mockUsers, type MockUser } from "../data/users";
import type { User, AuthResponse } from "../../shared/types/auth";

const toPublicUser = (row: MockUser): User => ({
  id: row.id,
  email: row.email,
  name: row.name,
  mobilePhone: row.mobilePhone ?? "",
});

type JwtPayload = {
  sub: string;
  email: string;
  name: string;
  /** Incluido en tokens nuevos; ausente en sesiones antiguas solo en memoria. */
  mobilePhone?: string;
  iat: number;
  exp: number;
};

const encodeBase64Url = (value: string): string => {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
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

// Mock JWT generation (header.payload.signature)
const generateMockJwt = (user: User, expInSeconds: number): string => {
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
    iat: nowInSeconds,
    exp: nowInSeconds + expInSeconds,
  };

  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const mockSignature = encodeBase64Url("mock-signature");

  return `${encodedHeader}.${encodedPayload}.${mockSignature}`;
};

// In-memory token storage for tracking valid tokens
const validTokens: Map<string, { user: User; expiresAt: number }> = new Map();

// 15 minutes in seconds
const TOKEN_EXPIRY_SECONDS = 15 * 60;

export const authHandlers = [
  // POST /api/auth/login
  http.post("/api/auth/login", async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      password?: string;
    };

    const { email, password } = body;

    if (!email || !password) {
      return HttpResponse.json(
        { message: "Email y contraseña son requeridos" },
        { status: 400 },
      );
    }

    // Find user
    const user = mockUsers.find((u) => u.email === email);

    if (!user || user.password !== password) {
      return HttpResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    // Generate mock JWT token
    const publicUser = toPublicUser(user);
    const token = generateMockJwt(publicUser, TOKEN_EXPIRY_SECONDS);
    const expiresAt = Date.now() + TOKEN_EXPIRY_SECONDS * 1000;

    // Store token mapping
    validTokens.set(token, {
      user: publicUser,
      expiresAt,
    });

    const response: AuthResponse = {
      user: publicUser,
      token,
      expiresIn: TOKEN_EXPIRY_SECONDS,
    };

    return HttpResponse.json(response, { status: 200 });
  }),

  // GET /api/auth/me
  http.get("/api/auth/me", ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return HttpResponse.json(
        { message: "Token no proporcionado" },
        { status: 401 },
      );
    }

    const payload = parseJwtPayload(token);
    if (!payload) {
      validTokens.delete(token);
      return HttpResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    if (Date.now() > payload.exp * 1000) {
      validTokens.delete(token);
      return HttpResponse.json({ message: "Token expirado" }, { status: 401 });
    }

    const tokenData = validTokens.get(token);

    if (tokenData) {
      if (Date.now() > tokenData.expiresAt) {
        validTokens.delete(token);
        return HttpResponse.json(
          { message: "Token expirado" },
          { status: 401 },
        );
      }
      return HttpResponse.json(tokenData.user, { status: 200 });
    }

    // Token válido pero no está en memoria (p. ej. recarga de página con JWT en localStorage)
    const mobilePhone =
      payload.mobilePhone ??
      mockUsers.find((u) => u.id === payload.sub)?.mobilePhone ??
      "";
    const user: User = {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      mobilePhone,
    };

    validTokens.set(token, {
      user,
      expiresAt: payload.exp * 1000,
    });

    return HttpResponse.json(user, { status: 200 });
  }),

  // PATCH /api/auth/me
  http.patch("/api/auth/me", async ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return HttpResponse.json(
        { message: "Token no proporcionado" },
        { status: 401 },
      );
    }

    const payload = parseJwtPayload(token);
    if (!payload) {
      validTokens.delete(token);
      return HttpResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    if (Date.now() > payload.exp * 1000) {
      validTokens.delete(token);
      return HttpResponse.json({ message: "Token expirado" }, { status: 401 });
    }

    const body = (await request.json()) as {
      name?: unknown;
      mobilePhone?: unknown;
    };
    const name = typeof body.name === "string" ? body.name.trim() : "";
    const mobilePhone =
      typeof body.mobilePhone === "string" ? body.mobilePhone.trim() : "";

    if (!name) {
      return HttpResponse.json(
        { message: "El nombre es obligatorio" },
        { status: 400 },
      );
    }

    const tokenData = validTokens.get(token);
    const base: User =
      tokenData?.user ??
      ({
        id: payload.sub,
        email: payload.email,
        name: payload.name,
        mobilePhone:
          payload.mobilePhone ??
          mockUsers.find((u) => u.id === payload.sub)?.mobilePhone ??
          "",
      } as User);

    const user: User = {
      ...base,
      name,
      mobilePhone,
    };

    validTokens.set(token, {
      user,
      expiresAt: tokenData?.expiresAt ?? payload.exp * 1000,
    });

    return HttpResponse.json(user, { status: 200 });
  }),

  // POST /api/auth/logout
  http.post("/api/auth/logout", ({ request }) => {
    const authHeader = request.headers.get("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (token) {
      validTokens.delete(token);
    }

    return HttpResponse.json({ message: "Logout exitoso" }, { status: 200 });
  }),
];
