import type {
  Invitation,
  InvitationRole,
} from "../../shared/types/auth";
import { DEMO_COMPANY_ID } from "./users";

export type MockInvitation = Invitation & {
  token: string;
};

export const mockInvitations: MockInvitation[] = [
  {
    id: "inv-1",
    email: "pendiente@empresa.cl",
    name: "Ana Pendiente",
    role: "common",
    companyId: DEMO_COMPANY_ID,
    expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    acceptedAt: null,
    createdAt: new Date().toISOString(),
    token: "invite-token-demo",
  },
];

export type CreateMockInvitationInput = {
  email: string;
  name: string;
  role: InvitationRole;
  companyId: string;
};
