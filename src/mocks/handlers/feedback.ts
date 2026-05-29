import { http, HttpResponse } from "msw";
import type {
  CreateFeedbackDto,
  Feedback,
  FeedbackCategory,
  FeedbackPriority,
  UpdateFeedbackDto,
} from "../../shared/types/feedback";
import { mockFeedbacks } from "../data/feedbacks";
import { mockApiPath } from "../mock-api-path";
import { requireAdmin, requireAuth } from "./auth-helpers";

const VALID_CATEGORIES: FeedbackCategory[] = [
  "idea",
  "feature",
  "improvement",
  "complaint",
  "opinion",
  "bug",
  "other",
];

const VALID_PRIORITIES: FeedbackPriority[] = ["high", "medium", "low"];

const db: Feedback[] = [...mockFeedbacks];

const isValidCategory = (value: string): value is FeedbackCategory =>
  VALID_CATEGORIES.includes(value as FeedbackCategory);

const isValidPriority = (value: string): value is FeedbackPriority =>
  VALID_PRIORITIES.includes(value as FeedbackPriority);

export const feedbackHandlers = [
  http.get(mockApiPath("/api/feedback"), ({ request }) => {
    const auth = requireAdmin(request);
    if (auth instanceof Response) {
      return auth;
    }

    const sorted = [...db].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    );

    return HttpResponse.json(sorted);
  }),

  http.post(mockApiPath("/api/feedback"), async ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    const body = (await request.json()) as CreateFeedbackDto;
    const title = body.title?.trim() ?? "";
    const description = body.description?.trim() ?? "";
    const category = body.category;

    if (!title || title.length < 3) {
      return HttpResponse.json(
        { message: "El título debe tener al menos 3 caracteres" },
        { status: 400 },
      );
    }

    if (!category || !isValidCategory(category)) {
      return HttpResponse.json(
        { message: "Categoría inválida" },
        { status: 400 },
      );
    }

    if (!description || description.length < 10) {
      return HttpResponse.json(
        { message: "La descripción debe tener al menos 10 caracteres" },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();
    const newFeedback: Feedback = {
      id: String(Date.now()),
      userId: auth.user.id,
      userEmail: auth.user.email,
      userName: auth.user.name,
      title,
      category,
      description,
      priority: "medium",
      status: "new",
      createdAt: now,
      updatedAt: now,
    };

    db.push(newFeedback);

    console.info("[MSW] Feedback recibido", {
      id: newFeedback.id,
      user: auth.user.email,
      title: newFeedback.title,
      category: newFeedback.category,
    });

    return HttpResponse.json(newFeedback, { status: 201 });
  }),

  http.patch(
    mockApiPath("/api/feedback/:id/priority"),
    async ({ request, params }) => {
      const auth = requireAdmin(request);
      if (auth instanceof Response) {
        return auth;
      }

      const id = params.id as string;
      const index = db.findIndex((f) => f.id === id);

      if (index === -1) {
        return HttpResponse.json(
          { message: "Feedback no encontrado" },
          { status: 404 },
        );
      }

      const body = (await request.json()) as UpdateFeedbackDto;

      if (
        body.priority !== undefined &&
        !isValidPriority(body.priority)
      ) {
        return HttpResponse.json(
          { message: "Prioridad inválida" },
          { status: 400 },
        );
      }

      if (body.priority === undefined) {
        return HttpResponse.json(
          { message: "Debe enviar priority" },
          { status: 400 },
        );
      }

      const updated: Feedback = {
        ...db[index],
        priority: body.priority,
        updatedAt: new Date().toISOString(),
      };

      db[index] = updated;

      return HttpResponse.json(updated);
    },
  ),
];
