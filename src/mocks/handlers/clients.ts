import { http, HttpResponse } from "msw";
import type {
  Client,
  ClientActivity,
  ClientContactChannel,
  ClientStatus,
  CreateClientActivityDto,
  CreateClientDto,
  UpdateClientDto,
} from "../../shared/types/client";
import { mockClients } from "../data/clients";
import { mockApiPath } from "../mock-api-path";
import { requireOperational } from "./auth-helpers";

const STATUS_LABELS: Record<ClientStatus, string> = {
  not_contacted: "No contactado",
  pending: "Pendiente",
  no_answer: "No contesta",
  approved: "Aprobado",
  rejected: "Rechazado",
};

const CHANNEL_LABELS: Record<ClientContactChannel, string> = {
  email: "Email",
  phone: "Teléfono",
  whatsapp: "WhatsApp",
};

const MAX_EMAILS = 10;
const MAX_PHONES = 10;
const MAX_TAGS = 20;
const MAX_TAG_LENGTH = 40;
const MAX_PHONE_LENGTH = 64;
const TAG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

const db: Client[] = structuredClone(mockClients);

const findClientIndex = (id: string) => db.findIndex((c) => c.id === id);

const makeActivity = (
  partial: Omit<ClientActivity, "id" | "createdAt"> & {
    id?: string;
    createdAt?: string;
  },
): ClientActivity => ({
  id: partial.id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  type: partial.type,
  message: partial.message,
  createdAt: partial.createdAt ?? new Date().toISOString(),
  createdByName: partial.createdByName,
  meta: partial.meta,
});

const sortActivitiesDesc = (client: Client): Client => ({
  ...client,
  activities: [...client.activities].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  ),
});

const isValidEmail = (email: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const normalizeTag = (raw: string): string | null => {
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

const parseEmails = (
  value: unknown,
): { ok: true; emails: string[] } | { ok: false; message: string } => {
  if (value === undefined) {
    return { ok: true, emails: [] };
  }
  if (!Array.isArray(value)) {
    return { ok: false, message: "emails debe ser un arreglo" };
  }
  if (value.length > MAX_EMAILS) {
    return { ok: false, message: `Máximo ${MAX_EMAILS} correos` };
  }

  const emails: string[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    if (typeof item !== "string") {
      return { ok: false, message: "Cada correo debe ser texto" };
    }
    const email = item.trim().toLowerCase();
    if (!email) continue;
    if (!isValidEmail(email)) {
      return { ok: false, message: "El correo no es válido" };
    }
    if (seen.has(email)) continue;
    seen.add(email);
    emails.push(email);
  }

  return { ok: true, emails };
};

const parsePhones = (
  value: unknown,
): { ok: true; phones: string[] } | { ok: false; message: string } => {
  if (value === undefined) {
    return { ok: true, phones: [] };
  }
  if (!Array.isArray(value)) {
    return { ok: false, message: "phones debe ser un arreglo" };
  }
  if (value.length > MAX_PHONES) {
    return { ok: false, message: `Máximo ${MAX_PHONES} teléfonos` };
  }

  const phones: string[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    if (typeof item !== "string") {
      return { ok: false, message: "Cada teléfono debe ser texto" };
    }
    const phone = item.trim();
    if (!phone) continue;
    if (phone.length < 1 || phone.length > MAX_PHONE_LENGTH) {
      return {
        ok: false,
        message: `Cada teléfono debe tener entre 1 y ${MAX_PHONE_LENGTH} caracteres`,
      };
    }
    if (seen.has(phone)) continue;
    seen.add(phone);
    phones.push(phone);
  }

  return { ok: true, phones };
};

const parseTags = (
  value: unknown,
): { ok: true; tags: string[] } | { ok: false; message: string } => {
  if (value === undefined) {
    return { ok: true, tags: [] };
  }
  if (!Array.isArray(value)) {
    return { ok: false, message: "tags debe ser un arreglo" };
  }
  if (value.length > MAX_TAGS) {
    return { ok: false, message: `Máximo ${MAX_TAGS} etiquetas` };
  }

  const tags: string[] = [];
  const seen = new Set<string>();

  for (const item of value) {
    if (typeof item !== "string") {
      return { ok: false, message: "Cada etiqueta debe ser texto" };
    }
    const tag = normalizeTag(item);
    if (!tag) {
      return {
        ok: false,
        message:
          "Etiqueta inválida. Usa letras, números y guiones (ej. rondas-app)",
      };
    }
    if (seen.has(tag)) continue;
    seen.add(tag);
    tags.push(tag);
  }

  return { ok: true, tags };
};

export const clientHandlers = [
  http.get(mockApiPath("/api/clients"), ({ request }) => {
    const auth = requireOperational(request);
    if (auth instanceof Response) {
      return auth;
    }

    const url = new URL(request.url);
    const tagFilters = url.searchParams.getAll("tag").filter(Boolean);
    let result = db.map(sortActivitiesDesc);

    if (tagFilters.length > 0) {
      result = result.filter((client) =>
        tagFilters.some((tag) => client.tags.includes(tag)),
      );
    }

    return HttpResponse.json(result);
  }),

  http.post(mockApiPath("/api/clients"), async ({ request }) => {
    const auth = requireOperational(request);
    if (auth instanceof Response) {
      return auth;
    }

    const body = (await request.json()) as CreateClientDto;
    const name = body.name?.trim() ?? "";
    const website = body.website?.trim() || undefined;

    if (!name) {
      return HttpResponse.json(
        { message: "El nombre es obligatorio" },
        { status: 400 },
      );
    }

    const emailsResult = parseEmails(body.emails);
    if (!emailsResult.ok) {
      return HttpResponse.json(
        { message: emailsResult.message },
        { status: 400 },
      );
    }

    const phonesResult = parsePhones(body.phones);
    if (!phonesResult.ok) {
      return HttpResponse.json(
        { message: phonesResult.message },
        { status: 400 },
      );
    }

    const tagsResult = parseTags(body.tags);
    if (!tagsResult.ok) {
      return HttpResponse.json(
        { message: tagsResult.message },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const newClient: Client = {
      id: String(Date.now()),
      name,
      website,
      emails: emailsResult.emails,
      phones: phonesResult.phones,
      tags: tagsResult.tags,
      status: "not_contacted",
      contacts: { email: false, phone: false, whatsapp: false },
      createdAt: now,
      updatedAt: now,
      activities: [
        makeActivity({
          type: "created",
          message: "Cliente potencial creado",
          createdAt: now,
        }),
      ],
    };

    db.unshift(newClient);
    return HttpResponse.json(sortActivitiesDesc(newClient), { status: 201 });
  }),

  http.patch(mockApiPath("/api/clients/:id"), async ({ request, params }) => {
    const auth = requireOperational(request);
    if (auth instanceof Response) {
      return auth;
    }

    const id = String(params.id);
    const index = findClientIndex(id);
    if (index === -1) {
      return HttpResponse.json(
        { message: "Cliente no encontrado" },
        { status: 404 },
      );
    }

    const body = (await request.json()) as UpdateClientDto;
    const current = db[index];
    const now = new Date().toISOString();
    const activities = [...current.activities];

    let next: Client = { ...current, updatedAt: now };

    if (typeof body.name === "string") {
      const name = body.name.trim();
      if (!name) {
        return HttpResponse.json(
          { message: "El nombre es obligatorio" },
          { status: 400 },
        );
      }
      next = { ...next, name };
    }

    if (body.website !== undefined) {
      next = {
        ...next,
        website: body.website.trim() || undefined,
      };
    }

    if (body.emails !== undefined) {
      const emailsResult = parseEmails(body.emails);
      if (!emailsResult.ok) {
        return HttpResponse.json(
          { message: emailsResult.message },
          { status: 400 },
        );
      }
      next = { ...next, emails: emailsResult.emails };
    }

    if (body.phones !== undefined) {
      const phonesResult = parsePhones(body.phones);
      if (!phonesResult.ok) {
        return HttpResponse.json(
          { message: phonesResult.message },
          { status: 400 },
        );
      }
      next = { ...next, phones: phonesResult.phones };
    }

    if (body.tags !== undefined) {
      const tagsResult = parseTags(body.tags);
      if (!tagsResult.ok) {
        return HttpResponse.json(
          { message: tagsResult.message },
          { status: 400 },
        );
      }
      next = { ...next, tags: tagsResult.tags };
    }

    if (body.status && body.status !== current.status) {
      const fromStatus = current.status;
      const toStatus = body.status;
      if (!(toStatus in STATUS_LABELS)) {
        return HttpResponse.json(
          { message: "Estado inválido" },
          { status: 400 },
        );
      }
      activities.unshift(
        makeActivity({
          type: "status_changed",
          message: `Estado cambiado de ${STATUS_LABELS[fromStatus]} a ${STATUS_LABELS[toStatus]}`,
          createdAt: now,
          meta: { fromStatus, toStatus },
        }),
      );
      next = { ...next, status: toStatus };
    }

    if (body.contacts) {
      const contacts = { ...current.contacts };
      (["email", "phone", "whatsapp"] as ClientContactChannel[]).forEach(
        (channel) => {
          const value = body.contacts?.[channel];
          if (typeof value === "boolean" && value !== contacts[channel]) {
            contacts[channel] = value;
            activities.unshift(
              makeActivity({
                type: "channel_toggled",
                message: value
                  ? `Contacto por ${CHANNEL_LABELS[channel]} marcado`
                  : `Contacto por ${CHANNEL_LABELS[channel]} desmarcado`,
                createdAt: now,
                meta: { channel, channelValue: value },
              }),
            );
          }
        },
      );
      next = { ...next, contacts };
    }

    next = { ...next, activities };
    db[index] = next;
    return HttpResponse.json(sortActivitiesDesc(next));
  }),

  http.delete(mockApiPath("/api/clients/:id"), ({ request, params }) => {
    const auth = requireOperational(request);
    if (auth instanceof Response) {
      return auth;
    }

    const id = String(params.id);
    const index = findClientIndex(id);
    if (index === -1) {
      return HttpResponse.json(
        { message: "Cliente no encontrado" },
        { status: 404 },
      );
    }

    db.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(
    mockApiPath("/api/clients/:id/activities"),
    async ({ request, params }) => {
      const auth = requireOperational(request);
      if (auth instanceof Response) {
        return auth;
      }

      const id = String(params.id);
      const index = findClientIndex(id);
      if (index === -1) {
        return HttpResponse.json(
          { message: "Cliente no encontrado" },
          { status: 404 },
        );
      }

      const body = (await request.json()) as CreateClientActivityDto;
      const message = body.message?.trim() ?? "";
      if (!message) {
        return HttpResponse.json(
          { message: "La nota no puede estar vacía" },
          { status: 400 },
        );
      }

      const now = new Date().toISOString();
      const current = db[index];
      const activity = makeActivity({
        type: "note",
        message,
        createdAt: now,
        createdByName: auth.user.name,
      });

      const next: Client = {
        ...current,
        updatedAt: now,
        activities: [activity, ...current.activities],
      };
      db[index] = next;

      return HttpResponse.json(sortActivitiesDesc(next), { status: 201 });
    },
  ),
];
