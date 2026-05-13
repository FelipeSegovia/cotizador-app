export interface User {
  id: string;
  email: string;
  name: string;
  mobilePhone?: string;
}

export type UpdateCurrentUserDto = {
  name: string;
  mobilePhone: string;
};

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn?: number; // opcional, ya que JWT puede incluir exp
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  expiresAt: number | null; // timestamp en ms
}

export type AuthActions = {
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setToken: (token: string, expiresIn?: number) => void;
  setUser: (user: User) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  loadFromStorage: () => void;
  isTokenExpired: () => boolean;
  getIsAuthenticated: () => boolean;
};
