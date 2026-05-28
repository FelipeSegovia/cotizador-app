import { http, HttpResponse } from "msw";
import type {
  CreateFeedbackDto,
  Feedback,
  FeedbackCategory,
} from "../../shared/types/feedback";
import { mockFeedbacks } from "../data/feedbacks";
import { mockApiPath } from "../mock-api-path";
import { requireAuth } from "./auth-helpers";

const VALID_CATEGORIES: FeedbackCategory[] = [
  "idea",
  "feature",
  "improvement",
  "complaint",
  "opinion",
  "bug",
  "other",
];

const db: Feedback[] = [...mockFeedbacks];

const isValidCategory = (value: string): value is FeedbackCategory =>
  VALID_CATEGORIES.includes(value as FeedbackCategory);

export const feedbackHandlers = [
  http.get(mockApiPath("/api/feedback"), ({ request }) => {
    const auth = requireAuth(request);
    if (auth instanceof Response) {
      return auth;
    }

    const userFeedbacks = db.filter((f) => f.userId === auth.user.id);
    return HttpResponse.json(userFeedbacks);
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
      title,
      category,
      description,
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
];
