export type UserRole = "admin" | "common";

export interface User {
  id: string;
  email: string;
  name: string;
  mobilePhone?: string;
  role: UserRole;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
}

export type UpdateCurrentUserDto = {
  name: string;
  mobilePhone: string;
};

export type CreateUserDto = {
  name: string;
  email: string;
  mobilePhone: string;
  role: UserRole;
  password: string;
};

export type UpdateUserDto = Partial<
  Pick<User, "name" | "mobilePhone" | "role" | "isActive">
>;

export type ChangePasswordDto = {
  currentPassword?: string;
  newPassword: string;
};

export type ForgotPasswordDto = { email: string };

export type VerifyResetCodeDto = { email: string; code: string };

export type ResetPasswordDto = {
  email: string;
  code: string;
  newPassword: string;
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
