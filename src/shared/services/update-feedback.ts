import { endpoints } from "../data";
import type { Feedback, UpdateFeedbackDto } from "../types/feedback";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

export const updateFeedback = async (
  id: string,
  payload: UpdateFeedbackDto,
): Promise<Feedback> => {
  const res = await authenticatedFetch(endpoints.FEEDBACK_PRIORITY(id), {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(
      await fetchErrorMessage(res, "Error al actualizar el feedback"),
    );
  }

  return (await res.json()) as Feedback;
};
