import { http, HttpResponse } from "msw";
import type { CreateUserDto, UpdateUserDto, User } from "../../shared/types/auth";
import { mockUsers } from "../data/users";
import { mockApiPath } from "../mock-api-path";
import {
  generateProvisionalPassword,
  requireAdmin,
  simulateWelcomeEmail,
  toPublicUser,
} from "./auth-helpers";

const db = [...mockUsers];

const toPublicUserList = (): User[] => db.map((row) => toPublicUser(row));

export const userHandlers = [
  http.get(mockApiPath("/api/users"), ({ request }) => {
    const auth = requireAdmin(request);
    if (auth instanceof Response) {
      return auth;
    }

    return HttpResponse.json(toPublicUserList());
  }),

  http.post(mockApiPath("/api/users"), async ({ request }) => {
    const auth = requireAdmin(request);
    if (auth instanceof Response) {
      return auth;
    }

    const body = (await request.json()) as CreateUserDto;
    const name = body.name?.trim() ?? "";
    const email = body.email?.trim().toLowerCase() ?? "";
    const mobilePhone = body.mobilePhone?.trim() ?? "";
    const password = body.password ?? "";
    const role = body.role;

    if (!name || !email || !password) {
      return HttpResponse.json(
        { message: "Nombre, correo y contraseña son obligatorios" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return HttpResponse.json(
        { message: "La contraseña debe tener al menos 8 caracteres" },
        { status: 400 },
      );
    }

    if (role !== "admin" && role !== "common") {
      return HttpResponse.json({ message: "Rol inválido" }, { status: 400 });
    }

    if (db.some((u) => u.email.toLowerCase() === email)) {
      return HttpResponse.json(
        { message: "Ya existe un usuario con ese correo" },
        { status: 409 },
      );
    }

    const now = new Date().toISOString();
    const newRow = {
      id: String(Date.now()),
      email,
      name,
      mobilePhone,
      password,
      role,
      isActive: true,
      mustChangePassword: true,
      createdAt: now,
      updatedAt: now,
    };

    db.push(newRow);

    simulateWelcomeEmail({
      to: email,
      name,
      provisionalPassword: password,
    });

    return HttpResponse.json(toPublicUser(newRow), { status: 201 });
  }),

  http.patch(mockApiPath("/api/users/:id"), async ({ request, params }) => {
    const auth = requireAdmin(request);
    if (auth instanceof Response) {
      return auth;
    }

    const index = db.findIndex((u) => u.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    const body = (await request.json()) as UpdateUserDto;
    const current = db[index];

    if (body.name !== undefined) {
      const name = body.name.trim();
      if (!name) {
        return HttpResponse.json(
          { message: "El nombre es obligatorio" },
          { status: 400 },
        );
      }
      current.name = name;
    }

    if (body.mobilePhone !== undefined) {
      current.mobilePhone = body.mobilePhone.trim();
    }

    if (body.role !== undefined) {
      if (body.role !== "admin" && body.role !== "common") {
        return HttpResponse.json({ message: "Rol inválido" }, { status: 400 });
      }
      current.role = body.role;
    }

    if (body.isActive !== undefined) {
      current.isActive = body.isActive;
    }

    current.updatedAt = new Date().toISOString();

    return HttpResponse.json(toPublicUser(current));
  }),

  http.patch(mockApiPath("/api/users/:id/status"), ({ request, params }) => {
    const auth = requireAdmin(request);
    if (auth instanceof Response) {
      return auth;
    }

    const index = db.findIndex((u) => u.id === params.id);
    if (index === -1) {
      return HttpResponse.json(
        { message: "Usuario no encontrado" },
        { status: 404 },
      );
    }

    if (db[index].id === auth.user.id) {
      return HttpResponse.json(
        { message: "No puedes deshabilitar tu propia cuenta" },
        { status: 409 },
      );
    }

    db[index].isActive = !db[index].isActive;
    db[index].updatedAt = new Date().toISOString();

    return HttpResponse.json(toPublicUser(db[index]));
  }),

  http.post(
    mockApiPath("/api/users/:id/resend-password"),
    ({ request, params }) => {
      const auth = requireAdmin(request);
      if (auth instanceof Response) {
        return auth;
      }

      const index = db.findIndex((u) => u.id === params.id);
      if (index === -1) {
        return HttpResponse.json(
          { message: "Usuario no encontrado" },
          { status: 404 },
        );
      }

      const provisionalPassword = generateProvisionalPassword();
      db[index].password = provisionalPassword;
      db[index].mustChangePassword = true;
      db[index].updatedAt = new Date().toISOString();

      simulateWelcomeEmail({
        to: db[index].email,
        name: db[index].name,
        provisionalPassword,
      });

      return HttpResponse.json({
        message: "Contraseña provisional reenviada por correo",
        user: toPublicUser(db[index]),
      });
    },
  ),
];
