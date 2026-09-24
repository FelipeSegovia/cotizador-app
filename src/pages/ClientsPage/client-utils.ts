import type { ClientStatus } from "../../shared/types/client";

export const CLIENT_STATUS_DOT_CLASSES: Record<ClientStatus, string> = {
  not_contacted: "bg-muted-foreground",
  approved: "bg-primary",
  rejected: "bg-destructive",
};

export const CLIENT_STATUS_BADGE_CLASSES: Record<ClientStatus, string> = {
  not_contacted: "bg-muted text-muted-foreground",
  approved: "bg-accent text-accent-foreground dark:bg-primary/20 dark:text-primary-foreground",
  rejected:
    "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground",
};

export const CLIENT_STATUS_OPTIONS: ClientStatus[] = [
  "not_contacted",
  "approved",
  "rejected",
];
