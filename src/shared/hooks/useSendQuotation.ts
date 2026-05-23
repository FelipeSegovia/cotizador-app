import { useMutation, useQueryClient } from "@tanstack/react-query";
import { sendQuotation } from "../services";
import type { Quotation } from "../types/quotation";

interface SendQuotationVariables {
  quotationId: string;
}

/**
 * Mutación para enviar una cotización en estado `draft` al cliente.
 * Invalida la cache de `quotations` al completar con éxito.
 */
export const useSendQuotation = () => {
  const queryClient = useQueryClient();

  return useMutation<Quotation, Error, SendQuotationVariables>({
    mutationFn: ({ quotationId }) => sendQuotation(quotationId),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["quotations"] });
    },
  });
};
