import { http, HttpResponse } from "msw";
import type { AuthResponse } from "../../shared/types/auth";
import { mockUsers } from "../data/users";
import { mockApiPath } from "../mock-api-path";
import {
  generateMockJwt,
  getBearerToken,
  parseJwtPayload,
  requireAuth,
  resolveUserFromToken,
  TOKEN_EXPIRY_SECONDS,
  toPublicUser,
  validTokens,
} from "./auth-helpers";

const resetCodesByEmail = new Map<string, string>();

const generateResetCode = (): string => {
  return String(Math.floor(100000 + Math.random() * 900000));
};

const simulateResetCodeEmail = (params: { to: string; code: string }) => {
  console.info("[MSW] Correo simulado — Recuperación de contraseña", {
    to: params.to,
    subject: "Código de recuperación de contraseña",
    body: `Tu código de verificación es: ${params.code}. Válido por 15 minutos.`,
  });
};

export const authHandlers = [
  http.post(mockApiPath("/api/auth/login"), async ({ request }) => {
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

    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase(),
    );

    if (!user || user.password !== password) {
      return HttpResponse.json(
        { message: "Credenciales inválidas" },
        { status: 401 },
      );
    }

    if (!user.isActive) {
      return HttpResponse.json(
        { message: "Tu cuenta está deshabilitada. Contacta al administrador." },
        { status: 403 },
      );
    }

    const publicUser = toPublicUser(user);
    const token = generateMockJwt(publicUser, TOKEN_EXPIRY_SECONDS);
    const expiresAt = Date.now() + TOKEN_EXPIRY_SECONDS * 1000;

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

  http.get(mockApiPath("/api/auth/me"), ({ request }) => {
    const token = getBearerToken(request);

    if (!token) {
      return HttpResponse.json(
        { message: "Token no proporcionado" },
        { status: 401 },
      );
    }

    const user = resolveUserFromToken(token);
    if (!user) {
      return HttpResponse.json(
        { message: "Token inválido o expirado" },
        { status: 401 },
      );
    }

    const dbUser = mockUsers.find((u) => u.id === user.id);
    if (dbUser) {
      return HttpResponse.json(toPublicUser(dbUser), { status: 200 });
    }

    return HttpResponse.json(user, { status: 200 });
  }),

  http.patch(mockApiPath("/api/auth/me"), async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
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

    const dbUser = mockUsers.find((u) => u.id === auth.user.id);
    if (!dbUser) {
      return HttpResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    dbUser.name = name;
    dbUser.mobilePhone = mobilePhone;
    dbUser.updatedAt = new Date().toISOString();

    const user = toPublicUser(dbUser);
    validTokens.set(auth.token, {
      user,
      expiresAt:
        validTokens.get(auth.token)?.expiresAt ??
        (parseJwtPayload(auth.token)?.exp ?? 0) * 1000,
    });

    return HttpResponse.json(user, { status: 200 });
  }),

  http.patch(mockApiPath("/api/auth/me/password"), async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    const body = (await request.json()) as {
      currentPassword?: string;
      newPassword?: string;
    };

    const newPassword =
      typeof body.newPassword === "string" ? body.newPassword.trim() : "";
    const currentPassword =
      typeof body.currentPassword === "string"
        ? body.currentPassword.trim()
        : "";

    if (!newPassword || newPassword.length < 8) {
      return HttpResponse.json(
        { message: "La nueva contraseña debe tener al menos 8 caracteres" },
        { status: 400 },
      );
    }

    const dbUser = mockUsers.find((u) => u.id === auth.user.id);
    if (!dbUser) {
      return HttpResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    if (!dbUser.mustChangePassword) {
      if (!currentPassword) {
        return HttpResponse.json(
          { message: "La contraseña actual es obligatoria" },
          { status: 400 },
        );
      }
      if (dbUser.password !== currentPassword) {
        return HttpResponse.json(
          { message: "La contraseña actual es incorrecta" },
          { status: 401 },
        );
      }
    }

    dbUser.password = newPassword;
    dbUser.mustChangePassword = false;
    dbUser.updatedAt = new Date().toISOString();

    const user = toPublicUser(dbUser);
    validTokens.set(auth.token, {
      user,
      expiresAt:
        validTokens.get(auth.token)?.expiresAt ??
        (parseJwtPayload(auth.token)?.exp ?? 0) * 1000,
    });

    return HttpResponse.json(user, { status: 200 });
  }),

  http.post(mockApiPath("/api/auth/logout"), ({ request }) => {
    const token = getBearerToken(request);

    if (token) {
      validTokens.delete(token);
    }

    return HttpResponse.json({ message: "Logout exitoso" }, { status: 200 });
  }),

  http.post(mockApiPath("/api/auth/forgot-password"), async ({ request }) => {
    const body = (await request.json()) as { email?: string };
    const email = typeof body.email === "string" ? body.email.trim() : "";

    if (!email) {
      return HttpResponse.json(
        { message: "El correo electrónico es obligatorio" },
        { status: 400 },
      );
    }

    const user = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (user && user.isActive) {
      const code = generateResetCode();
      resetCodesByEmail.set(email.toLowerCase(), code);
      simulateResetCodeEmail({ to: email, code });
    }

    return HttpResponse.json(
      {
        message:
          "Si el correo está registrado, recibirás un código de verificación.",
      },
      { status: 200 },
    );
  }),

  http.post(mockApiPath("/api/auth/verify-reset-code"), async ({ request }) => {
    const body = (await request.json()) as { email?: string; code?: string };
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";

    if (!email || !code) {
      return HttpResponse.json(
        { message: "El correo y el código son obligatorios" },
        { status: 400 },
      );
    }

    const storedCode = resetCodesByEmail.get(email.toLowerCase());

    if (!storedCode || storedCode !== code) {
      return HttpResponse.json(
        { message: "Código de verificación inválido o expirado" },
        { status: 401 },
      );
    }

    return HttpResponse.json(
      { message: "Código verificado correctamente" },
      { status: 200 },
    );
  }),

  http.post(mockApiPath("/api/auth/reset-password"), async ({ request }) => {
    const body = (await request.json()) as {
      email?: string;
      code?: string;
      newPassword?: string;
    };
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const newPassword =
      typeof body.newPassword === "string" ? body.newPassword.trim() : "";

    if (!email || !code || !newPassword) {
      return HttpResponse.json(
        { message: "El correo, código y nueva contraseña son obligatorios" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return HttpResponse.json(
        { message: "La nueva contraseña debe tener al menos 8 caracteres" },
        { status: 400 },
      );
    }

    const storedCode = resetCodesByEmail.get(email.toLowerCase());

    if (!storedCode || storedCode !== code) {
      return HttpResponse.json(
        { message: "Código de verificación inválido o expirado" },
        { status: 401 },
      );
    }

    const dbUser = mockUsers.find(
      (u) => u.email.toLowerCase() === email.toLowerCase(),
    );

    if (!dbUser) {
      return HttpResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    dbUser.password = newPassword;
    dbUser.mustChangePassword = false;
    dbUser.updatedAt = new Date().toISOString();
    resetCodesByEmail.delete(email.toLowerCase());

    return HttpResponse.json(
      { message: "Contraseña restablecida correctamente" },
      { status: 200 },
    );
  }),
];
