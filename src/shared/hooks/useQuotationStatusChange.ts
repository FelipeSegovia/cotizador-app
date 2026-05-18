import { useCallback, useState } from "react";
import type {
  ManualQuotationStatusTransition,
  Quotation,
  QuotationStatus,
} from "../types/quotation";
import { useUpdateQuotationStatus } from "./useUpdateQuotationStatus";

export type StatusChangeRequest = {
  quotationId: string;
  fromStatus: QuotationStatus;
  nextStatus: ManualQuotationStatusTransition;
};

type UseQuotationStatusChangeOptions = {
  onSuccess?: (quotation: Quotation, request: StatusChangeRequest) => void;
  onError?: (error: unknown, request: StatusChangeRequest) => void;
  defaultErrorMessage?: string;
};

export const useQuotationStatusChange = (
  options: UseQuotationStatusChangeOptions = {},
) => {
  const { onSuccess, onError, defaultErrorMessage } = options;
  const updateStatusMutation = useUpdateQuotationStatus();
  const [statusError, setStatusError] = useState<string | null>(null);
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);
  const [pendingStatusChange, setPendingStatusChange] =
    useState<StatusChangeRequest | null>(null);

  const requestStatusChange = useCallback(
    (
      quotationId: string,
      fromStatus: QuotationStatus,
      nextStatus: ManualQuotationStatusTransition,
    ) => {
      setPendingStatusChange({ quotationId, fromStatus, nextStatus });
    },
    [],
  );

  const clearError = useCallback(() => {
    setStatusError(null);
  }, []);

  const confirmStatusChange = useCallback(() => {
    if (pendingStatusChange === null) return;

    const request = pendingStatusChange;
    setStatusError(null);
    setPendingStatusId(request.quotationId);
    updateStatusMutation.mutate(
      { quotationId: request.quotationId, status: request.nextStatus },
      {
        onSuccess: (quotation) => {
          setPendingStatusChange(null);
          onSuccess?.(quotation, request);
        },
        onError: (error) => {
          if (onError) {
            onError(error, request);
          } else {
            setStatusError(
              error instanceof Error
                ? error.message
                : (defaultErrorMessage ??
                  "No se pudo actualizar el estado de la cotización."),
            );
          }
        },
        onSettled: () => {
          setPendingStatusId(null);
        },
      },
    );
  }, [
    pendingStatusChange,
    updateStatusMutation,
    onSuccess,
    onError,
    defaultErrorMessage,
  ]);

  const cancelStatusChange = useCallback(() => {
    if (!updateStatusMutation.isPending) {
      setPendingStatusChange(null);
    }
  }, [updateStatusMutation.isPending]);

  const modalProps = {
    isOpen: pendingStatusChange !== null,
    fromStatus: (pendingStatusChange?.fromStatus ?? "sent") as QuotationStatus,
    toStatus: (pendingStatusChange?.nextStatus ?? "sent") as QuotationStatus,
    isConfirming: updateStatusMutation.isPending,
    onConfirm: confirmStatusChange,
    onCancel: cancelStatusChange,
  };

  return {
    requestStatusChange,
    pendingStatusId,
    isUpdating: updateStatusMutation.isPending,
    error: statusError,
    clearError,
    modalProps,
  };
};
