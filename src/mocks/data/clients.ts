import type { Client } from "../../shared/types/client";

const now = Date.now();

export const mockClients: Client[] = [
  {
    id: "1",
    name: "Ana Torres",
    website: "https://anatorres.com",
    email: "ana@anatorres.com",
    phone: "+34 600 123 456",
    status: "approved",
    contacts: {
      email: true,
      phone: false,
      whatsapp: true,
    },
    createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
    activities: [
      {
        id: "1-a3",
        type: "note",
        message: "Confirmó interés y pidió propuesta formal.",
        createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
        createdByName: "Felipe Segovia",
      },
      {
        id: "1-a2",
        type: "status_changed",
        message: "Estado cambiado de No contactado a Aprobado",
        createdAt: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(),
        meta: { fromStatus: "not_contacted", toStatus: "approved" },
      },
      {
        id: "1-a1",
        type: "created",
        message: "Cliente potencial creado",
        createdAt: new Date(now - 4 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "2",
    name: "Comercial Delta",
    website: "https://comercialdelta.es",
    email: "hola@comercialdelta.es",
    phone: "+34 911 222 333",
    status: "not_contacted",
    contacts: {
      email: false,
      phone: false,
      whatsapp: false,
    },
    createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
    activities: [
      {
        id: "2-a1",
        type: "created",
        message: "Cliente potencial creado",
        createdAt: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
  {
    id: "3",
    name: "Luis Marín",
    email: "luis.marin@correo.com",
    phone: "+34 655 444 111",
    status: "rejected",
    contacts: {
      email: true,
      phone: true,
      whatsapp: false,
    },
    createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
    activities: [
      {
        id: "3-a2",
        type: "status_changed",
        message: "Estado cambiado de No contactado a Rechazado",
        createdAt: new Date(now - 3 * 24 * 60 * 60 * 1000).toISOString(),
        meta: { fromStatus: "not_contacted", toStatus: "rejected" },
      },
      {
        id: "3-a1",
        type: "created",
        message: "Cliente potencial creado",
        createdAt: new Date(now - 7 * 24 * 60 * 60 * 1000).toISOString(),
      },
    ],
  },
];
