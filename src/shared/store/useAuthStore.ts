import { create } from "zustand";
import type { AuthState, AuthActions, User } from "../types/auth";
import { login, logout } from "../services";

const STORAGE_KEY = "auth_token";
const STORAGE_EXPIRY_KEY = "auth_expiry";

type AuthStore = AuthState & AuthActions;

type JwtPayload = {
  exp?: number;
};

const parseJwtExpiry = (token: string): number | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded)) as JwtPayload;

    if (!payload.exp) {
      return null;
    }

    return payload.exp * 1000;
  } catch {
    return null;
  }
};

// Función para verificar autenticación desde localStorage (sin depender del estado)
const getAuthFromStorage = (): {
  token: string | null;
  expiresAt: number | null;
  isValid: boolean;
} => {
  const token = localStorage.getItem(STORAGE_KEY);
  const expiryStr = localStorage.getItem(STORAGE_EXPIRY_KEY);

  if (token) {
    const jwtExpiry = parseJwtExpiry(token);
    const fallbackExpiry = expiryStr ? Number(expiryStr) : null;
    const expiresAt = jwtExpiry ?? fallbackExpiry;

    if (!expiresAt) {
      return { token: null, expiresAt: null, isValid: false };
    }

    const isValid = Date.now() < expiresAt;
    return { token, expiresAt, isValid };
  }

  return { token: null, expiresAt: null, isValid: false };
};

const useAuthStore = create<AuthStore>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  expiresAt: null,

  login: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const { user, token, expiresIn } = await login(email, password);

      const expiresAt =
        parseJwtExpiry(token) ??
        (expiresIn ? Date.now() + expiresIn * 1000 : null);

      if (!expiresAt) {
        throw new Error("Token inválido: no incluye expiración");
      }

      set({
        user,
        token,
        isAuthenticated: true,
        expiresAt,
        isLoading: false,
      });

      // Persistir en localStorage
      localStorage.setItem(STORAGE_KEY, token);
      localStorage.setItem(STORAGE_EXPIRY_KEY, String(expiresAt));
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    const currentToken = get().token;

    if (currentToken) {
      void logout(currentToken);
    }

    set({
      user: null,
      token: null,
      isAuthenticated: false,
      error: null,
      expiresAt: null,
    });
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_EXPIRY_KEY);
  },

  setToken: (token: string, expiresIn?: number) => {
    const expiresAt =
      parseJwtExpiry(token) ??
      (expiresIn ? Date.now() + expiresIn * 1000 : null);

    if (!expiresAt) {
      return;
    }

    set({ token, expiresAt, isAuthenticated: true });
    localStorage.setItem(STORAGE_KEY, token);
    localStorage.setItem(STORAGE_EXPIRY_KEY, String(expiresAt));
  },

  setUser: (user: User) => {
    set({ user });
  },

  setError: (error: string | null) => {
    set({ error });
  },

  clearError: () => {
    set({ error: null });
  },

  loadFromStorage: () => {
    const authFromStorage = getAuthFromStorage();

    if (
      authFromStorage.token &&
      authFromStorage.expiresAt &&
      authFromStorage.isValid
    ) {
      set({
        token: authFromStorage.token,
        expiresAt: authFromStorage.expiresAt,
        isAuthenticated: true,
      });
    } else {
      // Token expirado o inválido, limpiar
      get().logout();
    }
  },

  isTokenExpired: () => {
    const { expiresAt } = get();
    if (!expiresAt) return true;
    return Date.now() > expiresAt;
  },

  // Nueva función para verificar autenticación (con prioridad a localStorage)
  getIsAuthenticated: () => {
    const authFromStorage = getAuthFromStorage();
    if (authFromStorage.isValid) {
      return true;
    }
    const { isAuthenticated, expiresAt } = get();
    if (isAuthenticated && expiresAt) {
      return Date.now() < expiresAt;
    }
    return false;
  },
}));

export default useAuthStore;
