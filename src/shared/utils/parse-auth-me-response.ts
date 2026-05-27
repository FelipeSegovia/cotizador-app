import type { User, UserRole } from "../types/auth";

/**
 * GET/PATCH `/api/auth/me`: cuerpo JSON plano `{ id, email, name, ... }`.
 * Acepta también `{ user: { ... } }` por compatibilidad con respuestas antiguas.
 */
export const parseAuthMeResponse = (json: unknown): User => {
  if (!json || typeof json !== "object") {
    throw new Error("Respuesta de perfil inválida");
  }

  const root = json as Record<string, unknown>;
  const candidate =
    root.user && typeof root.user === "object" && root.user !== null
      ? (root.user as Record<string, unknown>)
      : root;

  const id = typeof candidate.id === "string" ? candidate.id.trim() : "";
  const email = typeof candidate.email === "string" ? candidate.email.trim() : "";
  const name = typeof candidate.name === "string" ? candidate.name.trim() : "";

  if (!id || !email || !name) {
    throw new Error("Respuesta de perfil inválida");
  }

  const mobilePhone =
    typeof candidate.mobilePhone === "string" ? candidate.mobilePhone : "";

  const role: UserRole =
    candidate.role === "admin" || candidate.role === "common"
      ? candidate.role
      : "common";

  const isActive =
    typeof candidate.isActive === "boolean" ? candidate.isActive : true;

  const mustChangePassword =
    typeof candidate.mustChangePassword === "boolean"
      ? candidate.mustChangePassword
      : false;

  const nowIso = new Date().toISOString();
  const createdAt =
    typeof candidate.createdAt === "string" ? candidate.createdAt : nowIso;
  const updatedAt =
    typeof candidate.updatedAt === "string" ? candidate.updatedAt : nowIso;

  return {
    id,
    email,
    name,
    mobilePhone,
    role,
    isActive,
    mustChangePassword,
    createdAt,
    updatedAt,
  };
};
