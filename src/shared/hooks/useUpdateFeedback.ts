import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateFeedback } from "../services";
import type { UpdateFeedbackDto } from "../types/feedback";

type UpdateFeedbackVariables = {
  id: string;
  payload: UpdateFeedbackDto;
};

export const useUpdateFeedback = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: UpdateFeedbackVariables) =>
      updateFeedback(id, payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["feedbacks"] });
    },
  });
};
