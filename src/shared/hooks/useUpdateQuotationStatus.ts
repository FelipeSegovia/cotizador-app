import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateQuotationStatus } from "../services";
import type {
  ManualQuotationStatusTransition,
  Quotation,
} from "../types/quotation";

interface UpdateQuotationStatusVariables {
  quotationId: string;
  status: ManualQuotationStatusTransition;
}

/**
 * Mutación para cambiar el estado de una cotización en estado `sent` a
 * `approved` o `rejected`. Invalida la cache de `quotations` al completar
 * con éxito para que la lista refleje el cambio.
 */
export const useUpdateQuotationStatus = () => {
  const queryClient = useQueryClient();

  return useMutation<Quotation, Error, UpdateQuotationStatusVariables>({
    mutationFn: ({ quotationId, status }) =>
      updateQuotationStatus(quotationId, status),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
  });
};
