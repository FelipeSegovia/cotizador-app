export type UserRole = "admin" | "business" | "common";

export type InvitationRole = "business" | "common";

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

export interface Invitation {
  id: string;
  email: string;
  name: string;
  role: InvitationRole;
  companyId: string;
  expiresAt: string;
  acceptedAt: string | null;
  createdAt: string;
}

export type CreateInvitationDto = {
  email: string;
  name: string;
  companyId?: string;
  role?: InvitationRole;
};

export type AcceptInvitationDto = {
  token: string;
  password: string;
  mobilePhone?: string;
};

export interface AuthResponse {
  user: User;
  token: string;
  expiresIn?: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  expiresAt: number | null;
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
