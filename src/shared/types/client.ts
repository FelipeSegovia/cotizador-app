export type ClientStatus = "not_contacted" | "approved" | "rejected";

export type ClientContactChannel = "email" | "phone" | "whatsapp";

export type ClientActivityType =
  | "created"
  | "status_changed"
  | "channel_toggled"
  | "note";

export type ClientContacts = {
  email: boolean;
  phone: boolean;
  whatsapp: boolean;
};

export type ClientActivity = {
  id: string;
  type: ClientActivityType;
  message: string;
  createdAt: string;
  createdByName?: string;
  meta?: {
    channel?: ClientContactChannel;
    channelValue?: boolean;
    fromStatus?: ClientStatus;
    toStatus?: ClientStatus;
  };
};

export type Client = {
  id: string;
  name: string;
  website?: string;
  email?: string;
  phone?: string;
  status: ClientStatus;
  contacts: ClientContacts;
  createdAt: string;
  updatedAt: string;
  activities: ClientActivity[];
};

export type CreateClientDto = {
  name: string;
  website?: string;
  email?: string;
  phone?: string;
};

export type UpdateClientDto = {
  name?: string;
  website?: string;
  email?: string;
  phone?: string;
  status?: ClientStatus;
  contacts?: Partial<ClientContacts>;
};

export type CreateClientActivityDto = {
  message: string;
};
