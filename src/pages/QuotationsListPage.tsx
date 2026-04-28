import { useNavigate } from "react-router";
import {
  HiInformationCircle,
  HiOutlineDocumentPlus,
  HiOutlineEye,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import { useQuotations } from "../shared/hooks";
import { LABELS_QUOTATIONS_LIST_PAGE, PATHS } from "../shared/data";
import { useQuotationDraftStore } from "../shared/store";
import type { QuotationStatus } from "../shared/types/quotation";

const STATUS_LABELS: Record<QuotationStatus, string> = {
  draft: LABELS_QUOTATIONS_LIST_PAGE.statusLabels.draft,
  sent: LABELS_QUOTATIONS_LIST_PAGE.statusLabels.sent,
  approved: LABELS_QUOTATIONS_LIST_PAGE.statusLabels.approved,
  rejected: LABELS_QUOTATIONS_LIST_PAGE.statusLabels.rejected,
};

const STATUS_CLASSES: Record<QuotationStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  sent: "bg-blue-50 text-blue-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-600",
};

const formatCLP = (value: number) =>
  `$${Math.round(value).toLocaleString("es-CL")}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const QuotationsListPage = () => {
  const navigate = useNavigate();
  const { data: quotations, isLoading, isError } = useQuotations();
  const {
    setDraft,
    setPreviewMode,
    setPreviewStatus,
    setReadOnlyPreview,
    setSavedQuotationId,
  } = useQuotationDraftStore();

  const handleEditDraftQuotation = (quotationId: string) => {
    const quotation = quotations?.find((item) => item.id === quotationId);

    if (!quotation || quotation.status !== "draft") {
      return;
    }

    setDraft({
      clientName: quotation.clientName,
      clientRut: quotation.clientRut ?? "",
      clientEmail: quotation.clientEmail ?? "",
      projectTitle: quotation.projectTitle,
      projectDeadline: quotation.projectDeadline ?? "",
      projectNotes: quotation.projectNotes ?? "",
      items: quotation.items.map((item) => ({
        description: item.description,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
    });
    setSavedQuotationId(quotation.id);
    setPreviewStatus("draft");
    setReadOnlyPreview(false);
    setPreviewMode(false);
    navigate(PATHS.NEW_QUOTATION);
  };

  const handleViewReadonlyPreview = (quotationId: string) => {
    const quotation = quotations?.find((item) => item.id === quotationId);

    if (
      !quotation ||
      (quotation.status !== "sent" && quotation.status !== "approved")
    ) {
      return;
    }

    setDraft({
      clientName: quotation.clientName,
      clientRut: quotation.clientRut ?? "",
      clientEmail: quotation.clientEmail ?? "",
      projectTitle: quotation.projectTitle,
      projectDeadline: quotation.projectDeadline ?? "",
      projectNotes: quotation.projectNotes ?? "",
      items: quotation.items.map((item) => ({
        description: item.description,
        unitPrice: item.unitPrice,
        quantity: item.quantity,
      })),
    });
    setSavedQuotationId(quotation.id);
    setPreviewStatus(quotation.status);
    setReadOnlyPreview(true);
    setPreviewMode(true);
    navigate(PATHS.NEW_QUOTATION);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
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
          onClick={() => navigate(PATHS.NEW_QUOTATION)}
          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <HiOutlineDocumentPlus className="text-base" />
          {LABELS_QUOTATIONS_LIST_PAGE.newQuotationButton}
        </button>
      </div>

      <div className="flex items-start gap-2 rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
        <HiInformationCircle className="mt-0.5 shrink-0 text-base" />
        <p>{LABELS_QUOTATIONS_LIST_PAGE.draftEditInfo}</p>
      </div>

      {/* Table */}
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
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <HiOutlineDocumentText className="text-5xl text-slate-300" />
            <p className="text-sm text-slate-500">
              {LABELS_QUOTATIONS_LIST_PAGE.emptyState.title}
            </p>
            <button
              type="button"
              onClick={() => navigate(PATHS.NEW_QUOTATION)}
              className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <HiOutlineDocumentPlus className="text-base" />
              {LABELS_QUOTATIONS_LIST_PAGE.emptyState.action}
            </button>
          </div>
        )}

        {!isLoading && !isError && quotations && quotations.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-150">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 pb-3 pt-5">
                    {LABELS_QUOTATIONS_LIST_PAGE.table.number}
                  </th>
                  <th className="px-4 pb-3 pt-5">
                    {LABELS_QUOTATIONS_LIST_PAGE.table.client}
                  </th>
                  <th className="px-4 pb-3 pt-5">
                    {LABELS_QUOTATIONS_LIST_PAGE.table.project}
                  </th>
                  <th className="px-4 pb-3 pt-5">
                    {LABELS_QUOTATIONS_LIST_PAGE.table.status}
                  </th>
                  <th className="px-4 pb-3 pt-5 text-right">
                    {LABELS_QUOTATIONS_LIST_PAGE.table.total}
                  </th>
                  <th className="px-4 pb-3 pt-5">
                    {LABELS_QUOTATIONS_LIST_PAGE.table.date}
                  </th>
                  <th className="px-6 pb-3 pt-5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotations.map((q, index) => (
                  <tr key={q.id} className="group transition hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-400">
                      {String(index + 1).padStart(3, "0")}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                      {q.clientName}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {q.projectTitle}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASSES[q.status]}`}
                      >
                        {STATUS_LABELS[q.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-bold text-slate-800">
                      {formatCLP(q.total)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      {formatDate(q.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {q.status === "draft" ? (
                        <button
                          type="button"
                          onClick={() => handleEditDraftQuotation(q.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-emerald-700 opacity-0 transition hover:text-emerald-800 group-hover:opacity-100"
                        >
                          <HiOutlineEye className="text-sm" />
                          {LABELS_QUOTATIONS_LIST_PAGE.table.actionEditDraft}
                        </button>
                      ) : null}

                      {q.status === "sent" || q.status === "approved" ? (
                        <button
                          type="button"
                          onClick={() => handleViewReadonlyPreview(q.id)}
                          className="flex items-center gap-1 text-xs font-semibold text-blue-700 opacity-0 transition hover:text-blue-800 group-hover:opacity-100"
                        >
                          <HiOutlineEye className="text-sm" />
                          {LABELS_QUOTATIONS_LIST_PAGE.table.actionViewPreview}
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationsListPage;
