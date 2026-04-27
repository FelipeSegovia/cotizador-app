import type { AuthResponse, User } from "../types/auth";

const AUTH_BASE_URL = "/api/auth";

const parseErrorMessage = async (response: Response): Promise<string> => {
  try {
    const data = (await response.json()) as { message?: string };
    if (data.message) {
      return data.message;
    }
  } catch {
    // Si la respuesta no es JSON o viene vacia, intentamos leer texto.
  }

  try {
    const text = await response.text();
    if (text.trim().length > 0) {
      return text;
    }
  } catch {
    // Ignorar errores de parseo de texto y usar fallback.
  }

  return "Error inesperado en autenticacion";
};

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${AUTH_BASE_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const message = await parseErrorMessage(response);
      throw new Error(message || "Login fallido");
    }

    return (await response.json()) as AuthResponse;
  },

  async logout(token: string): Promise<void> {
    await fetch(`${AUTH_BASE_URL}/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  async getCurrentUser(token: string): Promise<User> {
    const response = await fetch(`${AUTH_BASE_URL}/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error("No autorizado");
    }

    const data = (await response.json()) as { user: User };
    return data.user;
  },
};
