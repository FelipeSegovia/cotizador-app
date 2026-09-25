import type { ClientStatus } from "../../shared/types/client";

export const CLIENT_STATUS_DOT_CLASSES: Record<ClientStatus, string> = {
  not_contacted: "bg-muted-foreground",
  pending: "bg-amber-500",
  no_answer: "bg-orange-500",
  approved: "bg-primary",
  rejected: "bg-destructive",
};

export const CLIENT_STATUS_BADGE_CLASSES: Record<ClientStatus, string> = {
  not_contacted: "bg-muted text-muted-foreground",
  pending:
    "bg-amber-500/15 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300",
  no_answer:
    "bg-orange-500/15 text-orange-700 dark:bg-orange-500/20 dark:text-orange-300",
  approved:
    "bg-accent text-accent-foreground dark:bg-primary/20 dark:text-primary-foreground",
  rejected:
    "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground",
};

export const CLIENT_STATUS_OPTIONS: ClientStatus[] = [
  "not_contacted",
  "pending",
  "no_answer",
  "approved",
  "rejected",
];

export const MAX_CLIENT_EMAILS = 10;
export const MAX_CLIENT_PHONES = 10;
export const MAX_CLIENT_TAGS = 20;
export const MAX_TAG_LENGTH = 40;
export const MAX_PHONE_LENGTH = 64;

const TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

/** Normaliza un tag: trim, minúsculas, espacios → guion. Devuelve null si es inválido. */
export const normalizeClientTag = (raw: string): string | null => {
  const normalized = raw
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

  if (
    !normalized ||
    normalized.length > MAX_TAG_LENGTH ||
    !TAG_PATTERN.test(normalized)
  ) {
    return null;
  }

  return normalized;
};

export const normalizeClientTags = (tags: string[]): string[] => {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const tag of tags) {
    const normalized = normalizeClientTag(tag);
    if (!normalized || seen.has(normalized)) continue;
    seen.add(normalized);
    result.push(normalized);
  }

  return result;
};

export const isValidClientEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

export const sanitizeClientEmails = (emails: string[]): string[] => {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const raw of emails) {
    const email = raw.trim().toLowerCase();
    if (!email || seen.has(email)) continue;
    seen.add(email);
    result.push(email);
  }

  return result;
};

export const sanitizeClientPhones = (phones: string[]): string[] => {
  const result: string[] = [];
  const seen = new Set<string>();

  for (const raw of phones) {
    const phone = raw.trim();
    if (!phone || phone.length > MAX_PHONE_LENGTH || seen.has(phone)) continue;
    seen.add(phone);
    result.push(phone);
  }

  return result;
};

export const formatContactPreview = (
  values: string[],
  maxVisible = 2,
): { visible: string[]; extra: number } => {
  const visible = values.slice(0, maxVisible);
  return {
    visible,
    extra: Math.max(0, values.length - maxVisible),
  };
};

/** Forma la query para comparar con tags (espacios → guión), sin exigir patrón válido. */
export const searchQueryAsTagHint = (query: string): string =>
  query
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");

export const clientMatchesSearch = (
  client: {
    name: string;
    emails: string[];
    phones: string[];
    tags: string[];
    website?: string;
  },
  rawQuery: string,
): boolean => {
  const query = rawQuery.trim().toLowerCase();
  if (!query) return true;

  const tagHint = searchQueryAsTagHint(query);
  const matchesTag = client.tags.some(
    (tag) => tag.includes(query) || (tagHint.length > 0 && tag.includes(tagHint)),
  );
  if (matchesTag) return true;

  const haystack = [
    client.name,
    ...client.emails,
    ...client.phones,
    client.website ?? "",
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
};
