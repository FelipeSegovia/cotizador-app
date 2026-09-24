import { http, HttpResponse } from "msw";
import type {
  AcceptInvitationDto,
  CreateInvitationDto,
  Invitation,
} from "../../shared/types/auth";
import { mockCompanies } from "../data/companies";
import { mockInvitations, type MockInvitation } from "../data/invitations";
import { mockUsers } from "../data/users";
import { mockApiPath } from "../mock-api-path";
import {
  getUserCompanyId,
  requireAdminOrBusiness,
  simulateInvitationEmail,
} from "./auth-helpers";

const toPublicInvitation = (row: MockInvitation): Invitation => ({
  id: row.id,
  email: row.email,
  name: row.name,
  role: row.role,
  companyId: row.companyId,
  expiresAt: row.expiresAt,
  acceptedAt: row.acceptedAt,
  createdAt: row.createdAt,
});

const pendingInvitations = (): MockInvitation[] =>
  mockInvitations.filter((inv) => inv.acceptedAt === null);

export const invitationHandlers = [
  http.get(mockApiPath("/api/invitations"), ({ request }) => {
    const auth = requireAdminOrBusiness(request);
    if (auth instanceof Response) {
      return auth;
    }

    const url = new URL(request.url);
    let rows = pendingInvitations();

    if (auth.user.role === "admin") {
      const companyId = url.searchParams.get("companyId");
      if (companyId) {
        rows = rows.filter((inv) => inv.companyId === companyId);
      }
    } else {
      const companyId = getUserCompanyId(auth.user.id);
      if (!companyId) {
        return HttpResponse.json(
          { message: "Configura tu empresa antes de gestionar invitaciones" },
          { status: 422 },
        );
      }
      rows = rows.filter((inv) => inv.companyId === companyId);
    }

    return HttpResponse.json(rows.map(toPublicInvitation));
  }),

  http.post(mockApiPath("/api/invitations"), async ({ request }) => {
    const auth = requireAdminOrBusiness(request);
    if (auth instanceof Response) {
      return auth;
    }

    const body = (await request.json()) as CreateInvitationDto;
    const email = body.email?.trim().toLowerCase() ?? "";
    const name = body.name?.trim() ?? "";

    if (!email || !name) {
      return HttpResponse.json(
        { message: "Nombre y correo son obligatorios" },
        { status: 400 },
      );
    }

    let companyId: string;
    let role: "business" | "common";

    if (auth.user.role === "admin") {
      companyId = body.companyId?.trim() ?? "";
      role = body.role === "business" ? "business" : "common";
      if (!companyId || !body.role) {
        return HttpResponse.json(
          { message: "companyId y role son obligatorios para admin" },
          { status: 422 },
        );
      }
      if (!mockCompanies.some((c) => c.id === companyId)) {
        return HttpResponse.json(
          { message: "Empresa no encontrada" },
          { status: 404 },
        );
      }
    } else {
      const actorCompany = getUserCompanyId(auth.user.id);
      if (!actorCompany) {
        return HttpResponse.json(
          { message: "Configura tu empresa antes de invitar" },
          { status: 422 },
        );
      }
      companyId = actorCompany;
      role = "common";
    }

    if (mockUsers.some((u) => u.email.toLowerCase() === email)) {
      return HttpResponse.json(
        { message: "Ya existe un usuario con ese correo" },
        { status: 409 },
      );
    }

    if (
      pendingInvitations().some((inv) => inv.email.toLowerCase() === email)
    ) {
      return HttpResponse.json(
        { message: "Ya existe una invitación pendiente para ese correo" },
        { status: 409 },
      );
    }

    const token = `invite-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    const now = new Date();
    const invitation: MockInvitation = {
      id: `inv-${Date.now()}`,
      email,
      name,
      role,
      companyId,
      expiresAt: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      acceptedAt: null,
      createdAt: now.toISOString(),
      token,
    };

    mockInvitations.push(invitation);
    simulateInvitationEmail({ to: email, name, token });

    return HttpResponse.json(toPublicInvitation(invitation), { status: 201 });
  }),

  http.delete(mockApiPath("/api/invitations/:id"), ({ request, params }) => {
    const auth = requireAdminOrBusiness(request);
    if (auth instanceof Response) {
      return auth;
    }

    const index = mockInvitations.findIndex((inv) => inv.id === params.id);
    if (index === -1 || mockInvitations[index].acceptedAt) {
      return HttpResponse.json(
        { message: "Invitación no encontrada" },
        { status: 404 },
      );
    }

    if (auth.user.role === "business") {
      const companyId = getUserCompanyId(auth.user.id);
      if (!companyId || mockInvitations[index].companyId !== companyId) {
        return HttpResponse.json(
          { message: "Invitación no encontrada" },
          { status: 404 },
        );
      }
    }

    mockInvitations.splice(index, 1);
    return new HttpResponse(null, { status: 204 });
  }),

  http.post(mockApiPath("/api/auth/accept-invitation"), async ({ request }) => {
    const body = (await request.json()) as AcceptInvitationDto;
    const token = body.token?.trim() ?? "";
    const password = body.password ?? "";
    const mobilePhone = body.mobilePhone?.trim() ?? "";

    if (!token || !password) {
      return HttpResponse.json(
        { message: "Token y contraseña son obligatorios" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return HttpResponse.json(
        { message: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 },
      );
    }

    const invitation = mockInvitations.find(
      (inv) => inv.token === token && inv.acceptedAt === null,
    );

    if (!invitation) {
      return HttpResponse.json(
        { message: "Invitación inválida o ya utilizada" },
        { status: 400 },
      );
    }

    if (new Date(invitation.expiresAt).getTime() < Date.now()) {
      return HttpResponse.json(
        { message: "La invitación ha expirado" },
        { status: 400 },
      );
    }

    if (mockUsers.some((u) => u.email.toLowerCase() === invitation.email)) {
      return HttpResponse.json(
        { message: "Ya existe un usuario con ese correo" },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    mockUsers.push({
      id: `user-${Date.now()}`,
      email: invitation.email,
      name: invitation.name,
      mobilePhone,
      password,
      role: invitation.role,
      companyId: invitation.companyId,
      isActive: true,
      mustChangePassword: false,
      createdAt: now,
      updatedAt: now,
    });

    invitation.acceptedAt = now;

    return HttpResponse.json({
      message: "Cuenta creada. Ya puedes iniciar sesión.",
    });
  }),
];
