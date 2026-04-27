import { useEffect } from "react";
import { useQuotationDraftStore } from "../shared/store";
import QuotationPage from "./QuotationPage";
import QuotationPreviewPage from "./QuotationPreviewPage";

const QuotationCreatorPage = () => {
  const { isPreviewMode, resetDraft } = useQuotationDraftStore();

  useEffect(() => {
    return () => {
      resetDraft();
    };
  }, []);

  return isPreviewMode ? <QuotationPreviewPage /> : <QuotationPage />;
};

export default QuotationCreatorPage;
