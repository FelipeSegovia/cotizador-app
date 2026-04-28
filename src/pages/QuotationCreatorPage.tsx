import { useQuotationDraftStore } from "../shared/store";
import QuotationPage from "./QuotationPage";
import QuotationPreviewPage from "./QuotationPreviewPage";

const QuotationCreatorPage = () => {
  const { isPreviewMode } = useQuotationDraftStore();

  return isPreviewMode ? <QuotationPreviewPage /> : <QuotationPage />;
};

export default QuotationCreatorPage;
