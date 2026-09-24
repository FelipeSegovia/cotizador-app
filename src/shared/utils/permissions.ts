import type { UserRole } from "../types/auth";
import PATHS from "../data/paths";

export type AppFeature =
  | "dashboard"
  | "quotations"
  | "clients"
  | "expenses"
  | "settings"
  | "users"
  | "companies"
  | "feedback"
  | "editCompany"
  | "editTerms"
  | "inviteUsers";

const ROLE_FEATURES: Record<UserRole, ReadonlySet<AppFeature>> = {
  admin: new Set(["companies", "users", "feedback", "settings", "inviteUsers"]),
  business: new Set([
    "dashboard",
    "quotations",
    "clients",
    "expenses",
    "settings",
    "users",
    "editCompany",
    "editTerms",
    "inviteUsers",
  ]),
  common: new Set([
    "dashboard",
    "quotations",
    "clients",
    "expenses",
    "settings",
  ]),
};

export const can = (role: UserRole | undefined | null, feature: AppFeature): boolean => {
  if (!role) {
    return false;
  }
  return ROLE_FEATURES[role].has(feature);
};

export const ROLE_HOME: Record<UserRole, string> = {
  admin: PATHS.COMPANIES,
  business: PATHS.DASHBOARD,
  common: PATHS.DASHBOARD,
};

export const getRoleHome = (role: UserRole | undefined | null): string => {
  if (!role) {
    return PATHS.LOGIN;
  }
  return ROLE_HOME[role];
};

export const OPERATIONAL_ROLES: UserRole[] = ["business", "common"];
export const USER_MANAGEMENT_ROLES: UserRole[] = ["admin", "business"];
