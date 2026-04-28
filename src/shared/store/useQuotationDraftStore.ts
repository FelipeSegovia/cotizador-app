import { create } from "zustand";
import type { QuotationFormData } from "../types/quotation";

type QuotationDraftState = {
  draft: QuotationFormData | null;
  isPreviewMode: boolean;
  savedQuotationId: string | null;
};

type QuotationDraftActions = {
  setDraft: (data: QuotationFormData) => void;
  setPreviewMode: (value: boolean) => void;
  setSavedQuotationId: (value: string | null) => void;
  resetDraft: () => void;
};

const useQuotationDraftStore = create<
  QuotationDraftState & QuotationDraftActions
>((set) => ({
  draft: null,
  isPreviewMode: false,
  savedQuotationId: null,

  setDraft: (data) => set({ draft: data }),
  setPreviewMode: (value) => set({ isPreviewMode: value }),
  setSavedQuotationId: (value) => set({ savedQuotationId: value }),
  resetDraft: () =>
    set({ draft: null, isPreviewMode: false, savedQuotationId: null }),
}));

export default useQuotationDraftStore;
