import { useNavigate } from "react-router";
import { CompanyRequiredModal } from "../shared/components/ui";
import { LABELS_QUOTATIONS_LIST_PAGE, PATHS } from "../shared/data";
import { useCompanyRequiredGuard } from "../shared/hooks";
import { useQuotationDraftStore } from "../shared/store";
import QuotationPage from "./QuotationPage";
import QuotationPreviewPage from "./QuotationPreviewPage";

const QuotationCreatorPage = () => {
  const navigate = useNavigate();
  const { isPreviewMode } = useQuotationDraftStore();
  const { isCompanyConfigured, isLoadingCompany } = useCompanyRequiredGuard();

  if (isLoadingCompany) {
    return (
      <div className="flex items-center justify-center py-20 text-sm text-slate-500">
        {LABELS_QUOTATIONS_LIST_PAGE.loading}
      </div>
    );
  }

  if (!isCompanyConfigured) {
    return (
      <CompanyRequiredModal
        isOpen
        onClose={() => navigate(PATHS.QUOTATIONS, { replace: true })}
      />
    );
  }

  return isPreviewMode ? <QuotationPreviewPage /> : <QuotationPage />;
};

export default QuotationCreatorPage;
