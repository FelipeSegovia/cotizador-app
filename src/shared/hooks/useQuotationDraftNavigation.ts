import { useCallback } from "react";
import { useNavigate } from "react-router";
import { PATHS } from "../data";
import { useQuotationDraftStore } from "../store";
import type { Quotation, QuotationFormData } from "../types/quotation";

const mapQuotationToFormData = (quotation: Quotation): QuotationFormData => ({
  clientName: quotation.clientName,
  clientRut: quotation.clientRut ?? "",
  clientEmail: quotation.clientEmail ?? "",
  projectTitle: quotation.projectTitle,
  projectDeadline: quotation.projectDeadline ?? "",
  projectNotes: quotation.projectNotes ?? "",
  validUntil: quotation.validUntil ?? "",
  items: quotation.items.map((item) => ({
    description: item.description,
    unitPrice: item.unitPrice,
    quantity: item.quantity,
  })),
});

const READONLY_PREVIEW_STATUSES = new Set<Quotation["status"]>([
  "sent",
  "approved",
  "rejected",
  "expired",
]);

export const useQuotationDraftNavigation = () => {
  const navigate = useNavigate();
  const {
    setDraft,
    setPreviewMode,
    setPreviewStatus,
    setReadOnlyPreview,
    setSavedQuotationId,
    resetDraft,
  } = useQuotationDraftStore();

  const startNewQuotation = useCallback(() => {
    resetDraft();
    navigate(PATHS.NEW_QUOTATION);
  }, [resetDraft, navigate]);

  const openDraftForEdit = useCallback(
    (quotation: Quotation | undefined) => {
      if (!quotation || quotation.status !== "draft") {
        return;
      }

      setDraft(mapQuotationToFormData(quotation));
      setSavedQuotationId(quotation.id);
      setPreviewStatus("draft");
      setReadOnlyPreview(false);
      setPreviewMode(false);
      navigate(PATHS.NEW_QUOTATION);
    },
    [
      setDraft,
      setSavedQuotationId,
      setPreviewStatus,
      setReadOnlyPreview,
      setPreviewMode,
      navigate,
    ],
  );

  const openReadonlyPreview = useCallback(
    (quotation: Quotation | undefined) => {
      if (!quotation || !READONLY_PREVIEW_STATUSES.has(quotation.status)) {
        return;
      }

      setDraft(mapQuotationToFormData(quotation));
      setSavedQuotationId(quotation.id);
      setPreviewStatus(quotation.status);
      setReadOnlyPreview(true);
      setPreviewMode(true);
      navigate(PATHS.NEW_QUOTATION);
    },
    [
      setDraft,
      setSavedQuotationId,
      setPreviewStatus,
      setReadOnlyPreview,
      setPreviewMode,
      navigate,
    ],
  );

  return {
    startNewQuotation,
    openDraftForEdit,
    openReadonlyPreview,
  };
};
