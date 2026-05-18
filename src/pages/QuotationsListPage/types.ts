import type {
  ManualQuotationStatusTransition,
  Quotation,
  QuotationStatus,
} from "../../shared/types/quotation";

export type QuotationsListViewProps = {
  quotations: Quotation[];
  pendingStatusId: string | null;
  isUpdating: boolean;
  onEditDraft: (quotationId: string) => void;
  onViewPreview: (quotationId: string) => void;
  onRequestStatusChange: (
    quotationId: string,
    fromStatus: QuotationStatus,
    nextStatus: ManualQuotationStatusTransition,
  ) => void;
};
