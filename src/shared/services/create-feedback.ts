import { endpoints } from "../data";
import type { CreateFeedbackDto, Feedback } from "../types/feedback";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const createFeedback = async (
  payload: CreateFeedbackDto,
): Promise<Feedback> => {
  const res = await authenticatedFetch(endpoints.FEEDBACK, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(await fetchErrorMessage(res, "Error al enviar tu idea"));
  }

  return (await res.json()) as Feedback;
};
