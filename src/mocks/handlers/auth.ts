import { http, HttpResponse } from "msw";
import { mockUsers } from "../data/users";
import type { User, AuthResponse } from "../../shared/types/auth";

type JwtPayload = {
  sub: string;
  email: string;
  name: string;
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
    const token = generateMockJwt(
      { id: user.id, email: user.email, name: user.name },
      TOKEN_EXPIRY_SECONDS,
    );
    const expiresAt = Date.now() + TOKEN_EXPIRY_SECONDS * 1000;

    // Store token mapping
    validTokens.set(token, {
      user: { id: user.id, email: user.email, name: user.name },
      expiresAt,
    });

    const response: AuthResponse = {
      user: { id: user.id, email: user.email, name: user.name },
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

    const tokenData = validTokens.get(token);

    if (!tokenData) {
      return HttpResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    const payload = parseJwtPayload(token);
    if (!payload) {
      validTokens.delete(token);
      return HttpResponse.json({ message: "Token inválido" }, { status: 401 });
    }

    if (Date.now() > payload.exp * 1000 || Date.now() > tokenData.expiresAt) {
      validTokens.delete(token);
      return HttpResponse.json({ message: "Token expirado" }, { status: 401 });
    }

    return HttpResponse.json({ user: tokenData.user }, { status: 200 });
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
