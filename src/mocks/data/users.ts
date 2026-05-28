import type { UserRole } from "../../shared/types/auth";

export type MockUser = {
  id: string;
  email: string;
  name: string;
  mobilePhone: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  mustChangePassword: boolean;
  createdAt: string;
  updatedAt: string;
};

export const mockUsers: MockUser[] = [
  {
    id: "1",
    email: "admin@quoteflow.cl",
    name: "Admin User",
    mobilePhone: "+56 9 8765 4321",
    password: "Admin1234!",
    role: "admin",
    isActive: true,
    mustChangePassword: false,
    createdAt: "2026-01-15T10:00:00.000Z",
    updatedAt: "2026-05-01T12:00:00.000Z",
  },
  {
    id: "2",
    email: "felipe.segovia.rod@gmail.com",
    name: "Felipe Segovia",
    mobilePhone: "+56 9 8765 4321",
    password: "Fe.89104665",
    role: "common",
    isActive: true,
    mustChangePassword: false,
    createdAt: "2026-02-01T10:00:00.000Z",
    updatedAt: "2026-05-01T12:00:00.000Z",
  },
  {
    id: "3",
    email: "rodrigo.vargas@quoteflow.cl",
    name: "Rodrigo Vargas",
    mobilePhone: "+56 9 1234 5678",
    password: "TempPass123!",
    role: "common",
    isActive: true,
    mustChangePassword: true,
    createdAt: "2026-03-10T10:00:00.000Z",
    updatedAt: "2026-05-20T12:00:00.000Z",
  },
  {
    id: "4",
    email: "maria.castro@quoteflow.cl",
    name: "María Castro",
    mobilePhone: "+56 9 2345 6789",
    password: "TempPass456!",
    role: "common",
    isActive: false,
    mustChangePassword: false,
    createdAt: "2026-03-15T10:00:00.000Z",
    updatedAt: "2026-05-18T12:00:00.000Z",
  },
  {
    id: "5",
    email: "carlos.lopez@quoteflow.cl",
    name: "Carlos López",
    mobilePhone: "+56 9 3456 7890",
    password: "TempPass789!",
    role: "common",
    isActive: true,
    mustChangePassword: false,
    createdAt: "2026-04-01T10:00:00.000Z",
    updatedAt: "2026-05-22T12:00:00.000Z",
  },
  // Usuario sin empresa configurada. Sirve para probar el flujo del modal
  // "Configura los datos de tu empresa" al intentar crear una cotización.
  {
    id: "6",
    email: "nuevo.usuario@quoteflow.cl",
    name: "Nuevo Usuario",
    mobilePhone: "+56 9 4567 8901",
    password: "NewUser123!",
    role: "common",
    isActive: true,
    mustChangePassword: false,
    createdAt: "2026-05-27T10:00:00.000Z",
    updatedAt: "2026-05-27T10:00:00.000Z",
  },
];
