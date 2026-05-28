import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFeedback } from "../services";
import type { CreateFeedbackDto } from "../types/feedback";

export const useCreateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFeedbackDto) => createFeedback(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
};
