import { http, HttpResponse } from "msw";
import type { UpdateUserDto, User } from "../../shared/types/auth";
import { mockUsers } from "../data/users";
import { mockApiPath } from "../mock-api-path";
import {
  getUserCompanyId,
  requireAdminOrBusiness,
  toPublicUser,
} from "./auth-helpers";

const listVisibleUsers = (actorId: string, actorRole: string, companyIdFilter?: string | null): User[] => {
  if (actorRole === "admin") {
    const rows = companyIdFilter
      ? mockUsers.filter((u) => u.companyId === companyIdFilter)
      : mockUsers;
    return rows.map(toPublicUser);
  }

  const companyId = getUserCompanyId(actorId);
  if (!companyId) {
    return [];
  }

  return mockUsers
    .filter((u) => u.companyId === companyId)
    .map(toPublicUser);
};

export const userHandlers = [
  http.get(mockApiPath("/api/users"), ({ request }) => {
    const auth = requireAdminOrBusiness(request);
    if (auth instanceof Response) {
      return auth;
    }

    if (auth.user.role === "business" && !getUserCompanyId(auth.user.id)) {
      return HttpResponse.json(
        { message: "Configura tu empresa antes de gestionar usuarios" },
        { status: 422 },
      );
    }

    const url = new URL(request.url);
    const companyIdFilter =
      auth.user.role === "admin" ? url.searchParams.get("companyId") : null;

    return HttpResponse.json(
      listVisibleUsers(auth.user.id, auth.user.role, companyIdFilter),
    );
  }),

  http.patch(mockApiPath("/api/users/:id"), async ({ request, params }) => {
    const auth = requireAdminOrBusiness(request);
    if (auth instanceof Response) {
      return auth;
    }

    const index = mockUsers.findIndex((u) => u.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    const target = mockUsers[index];
    if (auth.user.role === "business") {
      const actorCompany = getUserCompanyId(auth.user.id);
      if (!actorCompany || target.companyId !== actorCompany) {
        return HttpResponse.json(
          { message: "Usuario no encontrado" },
          { status: 404 },
        );
      }
    }

    const body = (await request.json()) as UpdateUserDto;

    if (body.name !== undefined) {
      const name = body.name.trim();
      if (!name) {
        return HttpResponse.json(
          { message: "El nombre es obligatorio" },
          { status: 400 },
        );
      }
      target.name = name;
    }

    if (body.mobilePhone !== undefined) {
      target.mobilePhone = body.mobilePhone.trim();
    }

    if (body.role !== undefined) {
      if (
        body.role !== "admin" &&
        body.role !== "business" &&
        body.role !== "common"
      ) {
        return HttpResponse.json({ message: "Rol inválido" }, { status: 400 });
      }
      if (auth.user.role === "business" && body.role === "admin") {
        return HttpResponse.json(
          { message: "No puedes asignar el rol administrador" },
          { status: 403 },
        );
      }
      target.role = body.role;
    }

    if (body.isActive !== undefined) {
      target.isActive = body.isActive;
    }

    target.updatedAt = new Date().toISOString();

    return HttpResponse.json(toPublicUser(target));
  }),

  http.patch(mockApiPath("/api/users/:id/status"), ({ request, params }) => {
    const auth = requireAdminOrBusiness(request);
    if (auth instanceof Response) {
      return auth;
    }

    const index = mockUsers.findIndex((u) => u.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    if (mockUsers[index].id === auth.user.id) {
      return HttpResponse.json(
        { message: "No puedes deshabilitar tu propia cuenta" },
        { status: 409 },
      );
    }

    if (auth.user.role === "business") {
      const actorCompany = getUserCompanyId(auth.user.id);
      if (!actorCompany || mockUsers[index].companyId !== actorCompany) {
        return HttpResponse.json(
          { message: "Usuario no encontrado" },
          { status: 404 },
        );
      }
    }

    mockUsers[index].isActive = !mockUsers[index].isActive;
    mockUsers[index].updatedAt = new Date().toISOString();

    return HttpResponse.json(toPublicUser(mockUsers[index]));
  }),
];
