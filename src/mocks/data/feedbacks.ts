import type { Feedback } from "../../shared/types/feedback";

export const mockFeedbacks: Feedback[] = [
  {
    id: "1",
    userId: "1",
    userEmail: "felipe.segovia.rod@gmail.com",
    title: "Exportar cotizaciones a Excel",
    category: "feature",
    description:
      "Sería útil poder exportar el listado de cotizaciones a Excel para reportes internos.",
    createdAt: "2026-05-10T14:00:00.000Z",
    updatedAt: "2026-05-10T14:00:00.000Z",
  },
  {
    id: "2",
    userId: "2",
    userEmail: "admin@quoteflow.cl",
    title: "Mejorar contraste del sidebar",
    category: "improvement",
    description:
      "El texto del menú lateral podría tener más contraste en modo claro.",
    createdAt: "2026-05-15T09:30:00.000Z",
    updatedAt: "2026-05-15T09:30:00.000Z",
  },
];
