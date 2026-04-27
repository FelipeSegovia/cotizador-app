import { create } from "zustand";
import type { QuotationFormData } from "../types/quotation";

type QuotationDraftState = {
  draft: QuotationFormData | null;
  isPreviewMode: boolean;
};

type QuotationDraftActions = {
  setDraft: (data: QuotationFormData) => void;
  setPreviewMode: (value: boolean) => void;
  resetDraft: () => void;
};

const useQuotationDraftStore = create<
  QuotationDraftState & QuotationDraftActions
>((set) => ({
  draft: null,
  isPreviewMode: false,

  setDraft: (data) => set({ draft: data }),
  setPreviewMode: (value) => set({ isPreviewMode: value }),
  resetDraft: () => set({ draft: null, isPreviewMode: false }),
}));

export default useQuotationDraftStore;
