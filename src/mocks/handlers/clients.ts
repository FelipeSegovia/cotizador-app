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
  approved: "Aprobado",
  rejected: "Rechazado",
};

const CHANNEL_LABELS: Record<ClientContactChannel, string> = {
  email: "Email",
  phone: "Teléfono",
  whatsapp: "WhatsApp",
};

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

export const clientHandlers = [
  http.get(mockApiPath("/api/clients"), ({ request }) => {
    const auth = requireOperational(request);
    if (auth instanceof Response) {
      return auth;
    }

    return HttpResponse.json(db.map(sortActivitiesDesc));
  }),

  http.post(mockApiPath("/api/clients"), async ({ request }) => {
    const auth = requireOperational(request);
    if (auth instanceof Response) {
      return auth;
    }

    const body = (await request.json()) as CreateClientDto;
    const name = body.name?.trim() ?? "";
    const website = body.website?.trim() || undefined;
    const email = body.email?.trim().toLowerCase() || undefined;
    const phone = body.phone?.trim() || undefined;

    if (!name) {
      return HttpResponse.json(
        { message: "El nombre es obligatorio" },
        { status: 400 },
      );
    }

    if (email && !isValidEmail(email)) {
      return HttpResponse.json(
        { message: "El correo no es válido" },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const newClient: Client = {
      id: String(Date.now()),
      name,
      website,
      email,
      phone,
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

    if (body.email !== undefined) {
      const email = body.email.trim().toLowerCase();
      if (email && !isValidEmail(email)) {
        return HttpResponse.json(
          { message: "El correo no es válido" },
          { status: 400 },
        );
      }
      next = { ...next, email: email || undefined };
    }

    if (body.phone !== undefined) {
      next = {
        ...next,
        phone: body.phone.trim() || undefined,
      };
    }

    if (body.status && body.status !== current.status) {
      const fromStatus = current.status;
      const toStatus = body.status;
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
