import type { User } from "../types/auth";

/**
 * GET/PATCH `/api/auth/me`: cuerpo JSON plano `{ id, email, name, mobilePhone? }`.
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

  return { id, email, name, mobilePhone };
};
