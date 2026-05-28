import { HiOutlineDocumentPlus } from "react-icons/hi2";
import {
  Alert,
  CompanyRequiredModal,
  ConfirmQuotationStatusChangeModal,
} from "../../shared/components/ui";
import LABELS_QUOTATIONS_LIST_PAGE from "../../shared/data/labels-quotations-list-page";
import {
  useCompanyRequiredGuard,
  useQuotationDraftNavigation,
  useQuotationStatusChange,
  useQuotations,
} from "../../shared/hooks";
import type { Quotation } from "../../shared/types/quotation";
import QuotationsListDesktop from "./QuotationsListDesktop";
import QuotationsListEmptyState from "./QuotationsListEmptyState";
import QuotationsListMobile from "./QuotationsListMobile";

const findQuotationById = (
  quotations: Quotation[],
  quotationId: string,
): Quotation | undefined =>
  quotations.find((item) => item.id === quotationId);

const QuotationsListPage = () => {
  const { data: quotations, isLoading, isError } = useQuotations();
  const { openDraftForEdit, openReadonlyPreview, startNewQuotation } =
    useQuotationDraftNavigation();
  const { requireCompany, companyRequiredModalProps } =
    useCompanyRequiredGuard();
  const {
    requestStatusChange,
    pendingStatusId,
    isUpdating,
    error,
    modalProps,
  } = useQuotationStatusChange({
    defaultErrorMessage: LABELS_QUOTATIONS_LIST_PAGE.statusUpdate.errorGeneric,
  });

  const handleStartNewQuotation = () => {
    requireCompany(startNewQuotation);
  };

  const handleEditDraft = (quotationId: string) => {
    if (!quotations) return;
    openDraftForEdit(findQuotationById(quotations, quotationId));
  };

  const handleViewPreview = (quotationId: string) => {
    if (!quotations) return;
    openReadonlyPreview(findQuotationById(quotations, quotationId));
  };

  const listViewProps = quotations
    ? {
        quotations,
        pendingStatusId,
        isUpdating,
        onEditDraft: handleEditDraft,
        onViewPreview: handleViewPreview,
        onRequestStatusChange: requestStatusChange,
      }
    : null;

  return (
    <div className="space-y-6">
      <ConfirmQuotationStatusChangeModal {...modalProps} />
      <CompanyRequiredModal {...companyRequiredModalProps} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            {LABELS_QUOTATIONS_LIST_PAGE.title}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {LABELS_QUOTATIONS_LIST_PAGE.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={handleStartNewQuotation}
          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <HiOutlineDocumentPlus className="text-base" />
          {LABELS_QUOTATIONS_LIST_PAGE.newQuotationButton}
        </button>
      </div>

      <Alert variant="info">{LABELS_QUOTATIONS_LIST_PAGE.draftEditInfo}</Alert>

      {error ? <Alert variant="error">{error}</Alert> : null}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-sm text-slate-500">
            {LABELS_QUOTATIONS_LIST_PAGE.loading}
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-20 text-sm text-red-500">
            {LABELS_QUOTATIONS_LIST_PAGE.loadError}
          </div>
        )}

        {!isLoading && !isError && quotations?.length === 0 && (
          <QuotationsListEmptyState onCreateClick={handleStartNewQuotation} />
        )}

        {!isLoading && !isError && listViewProps && listViewProps.quotations.length > 0 && (
          <>
            <QuotationsListMobile {...listViewProps} />
            <QuotationsListDesktop {...listViewProps} />
          </>
        )}
      </div>
    </div>
  );
};

export default QuotationsListPage;
