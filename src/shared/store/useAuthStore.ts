import { create } from "zustand";
import type { AuthState, AuthActions, User } from "../types/auth";
import login from "../services/login";
import logout from "../services/logout";

const STORAGE_KEY = "auth_token";
const STORAGE_EXPIRY_KEY = "auth_expiry";
const STORAGE_USER_KEY = "auth_user";

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

/** Token JWT aún válido (localStorage), para headers en fetch antes de hidratar Zustand. */
export const readValidAccessToken = (): string | null => {
  const { token, isValid } = getAuthFromStorage();
  return isValid && token ? token : null;
};

const parseJwtProfileFromToken = (token: string): User | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return null;
    }

    const normalized = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const payload = JSON.parse(atob(padded)) as {
      sub?: string;
      email?: string;
      name?: string;
      mobilePhone?: string;
    };

    if (!payload.sub || !payload.email || !payload.name) {
      return null;
    }

    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
      mobilePhone: payload.mobilePhone ?? "",
    };
  } catch {
    return null;
  }
};

const readPersistedUser = (): User | null => {
  if (typeof window === "undefined") {
    return null;
  }
  const auth = getAuthFromStorage();
  if (!auth.isValid || !auth.token) {
    return null;
  }
  const raw = localStorage.getItem(STORAGE_USER_KEY);
  if (raw) {
    try {
      const parsed = JSON.parse(raw) as Partial<User>;
      if (!parsed.id || !parsed.email || !parsed.name) {
        return parseJwtProfileFromToken(auth.token);
      }
      return {
        id: parsed.id,
        email: parsed.email,
        name: parsed.name,
        mobilePhone: parsed.mobilePhone ?? "",
      };
    } catch {
      return parseJwtProfileFromToken(auth.token);
    }
  }
  return parseJwtProfileFromToken(auth.token);
};

const buildInitialSession = () => {
  if (typeof window === "undefined") {
    return {
      user: null as User | null,
      token: null as string | null,
      expiresAt: null as number | null,
      isAuthenticated: false,
    };
  }

  const auth = getAuthFromStorage();
  if (!auth.isValid || !auth.token || !auth.expiresAt) {
    return {
      user: null,
      token: null,
      expiresAt: null,
      isAuthenticated: false,
    };
  }

  return {
    user: readPersistedUser(),
    token: auth.token,
    expiresAt: auth.expiresAt,
    isAuthenticated: true,
  };
};

const initialSession = buildInitialSession();

const persistUser = (user: User) => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
};

const clearPersistedUser = () => {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(STORAGE_USER_KEY);
};

const useAuthStore = create<AuthStore>((set, get) => ({
  user: initialSession.user,
  token: initialSession.token,
  isAuthenticated: initialSession.isAuthenticated,
  isLoading: false,
  error: null,
  expiresAt: initialSession.expiresAt,

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
      persistUser(user);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Error desconocido";
      set({ error: message, isLoading: false });
      throw error;
    }
  },

  logout: () => {
    const tokenForRequest = get().token ?? readValidAccessToken();

    if (tokenForRequest) {
      void logout(tokenForRequest);
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
    clearPersistedUser();
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
    persistUser(user);
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
      const persistedUser = readPersistedUser();
      set({
        token: authFromStorage.token,
        expiresAt: authFromStorage.expiresAt,
        isAuthenticated: true,
        ...(persistedUser ? { user: persistedUser } : {}),
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
