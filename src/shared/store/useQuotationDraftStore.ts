import { create } from "zustand";
import type { QuotationFormData, QuotationStatus } from "../types/quotation";

type QuotationDraftState = {
  draft: QuotationFormData | null;
  isPreviewMode: boolean;
  savedQuotationId: string | null;
  isReadOnlyPreview: boolean;
  previewStatus: QuotationStatus | null;
};

type QuotationDraftActions = {
  setDraft: (data: QuotationFormData) => void;
  setPreviewMode: (value: boolean) => void;
  setSavedQuotationId: (value: string | null) => void;
  setReadOnlyPreview: (value: boolean) => void;
  setPreviewStatus: (value: QuotationStatus | null) => void;
  resetDraft: () => void;
};

const useQuotationDraftStore = create<
  QuotationDraftState & QuotationDraftActions
>((set) => ({
  draft: null,
  isPreviewMode: false,
  savedQuotationId: null,
  isReadOnlyPreview: false,
  previewStatus: null,

  setDraft: (data) => set({ draft: data }),
  setPreviewMode: (value) => set({ isPreviewMode: value }),
  setSavedQuotationId: (value) => set({ savedQuotationId: value }),
  setReadOnlyPreview: (value) => set({ isReadOnlyPreview: value }),
  setPreviewStatus: (value) => set({ previewStatus: value }),
  resetDraft: () =>
    set({
      draft: null,
      isPreviewMode: false,
      savedQuotationId: null,
      isReadOnlyPreview: false,
      previewStatus: null,
    }),
}));

export default useQuotationDraftStore;
