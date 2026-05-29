import { endpoints } from "../data";
import type { Feedback } from "../types/feedback";
import { authenticatedFetch } from "./authenticated-fetch";
import { fetchErrorMessage } from "../utils";

interface GetFeedbacksParams {
  signal?: AbortSignal;
}

export const getFeedbacks = async (
  params: GetFeedbacksParams = {},
): Promise<Feedback[]> => {
  const { signal } = params;
  const res = await authenticatedFetch(endpoints.FEEDBACK, { signal });

  if (!res.ok) {
    throw new Error(
      await fetchErrorMessage(res, "Error al obtener el listado de feedback"),
    );
  }

  return (await res.json()) as Feedback[];
};
