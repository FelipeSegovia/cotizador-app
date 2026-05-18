import { useState } from "react";
import { useNavigate } from "react-router";
import {
  HiInformationCircle,
  HiOutlineCheckCircle,
  HiOutlineDocumentPlus,
  HiOutlineEye,
  HiOutlineDocumentText,
  HiOutlineExclamationCircle,
  HiOutlineXCircle,
} from "react-icons/hi2";
import { ConfirmQuotationStatusChangeModal } from "../shared/components/ui";
import { useQuotations, useUpdateQuotationStatus } from "../shared/hooks";
import { LABELS_QUOTATIONS_LIST_PAGE, PATHS } from "../shared/data";
import { useQuotationDraftStore } from "../shared/store";
import type {
  ManualQuotationStatusTransition,
  QuotationStatus,
} from "../shared/types/quotation";
import {
  getEffectiveQuotationStatus,
  QUOTATION_STATUS_BADGE_CLASSES,
} from "../shared/utils";

const STATUS_LABELS: Record<QuotationStatus, string> = {
  draft: LABELS_QUOTATIONS_LIST_PAGE.statusLabels.draft,
  sent: LABELS_QUOTATIONS_LIST_PAGE.statusLabels.sent,
  approved: LABELS_QUOTATIONS_LIST_PAGE.statusLabels.approved,
  rejected: LABELS_QUOTATIONS_LIST_PAGE.statusLabels.rejected,
  expired: LABELS_QUOTATIONS_LIST_PAGE.statusLabels.expired,
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
  const updateStatusMutation = useUpdateQuotationStatus();
  const [statusError, setStatusError] = useState<string | null>(null);
  const [pendingStatusId, setPendingStatusId] = useState<string | null>(null);
  const [pendingStatusChange, setPendingStatusChange] = useState<{
    quotationId: string;
    fromStatus: QuotationStatus;
    nextStatus: ManualQuotationStatusTransition;
  } | null>(null);
  const {
    setDraft,
    setPreviewMode,
    setPreviewStatus,
    setReadOnlyPreview,
    setSavedQuotationId,
    resetDraft,
  } = useQuotationDraftStore();

  const goToNewQuotation = () => {
    resetDraft();
    navigate(PATHS.NEW_QUOTATION);
  };

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
      validUntil: quotation.validUntil ?? "",
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

  const requestStatusChange = (
    quotationId: string,
    fromStatus: QuotationStatus,
    nextStatus: ManualQuotationStatusTransition,
  ) => {
    setPendingStatusChange({ quotationId, fromStatus, nextStatus });
  };

  const confirmStatusChange = () => {
    if (pendingStatusChange === null) return;

    const { quotationId, nextStatus } = pendingStatusChange;
    setStatusError(null);
    setPendingStatusId(quotationId);
    updateStatusMutation.mutate(
      { quotationId, status: nextStatus },
      {
        onSuccess: () => {
          setPendingStatusChange(null);
        },
        onError: (error) => {
          setStatusError(
            error instanceof Error
              ? error.message
              : LABELS_QUOTATIONS_LIST_PAGE.statusUpdate.errorGeneric,
          );
        },
        onSettled: () => {
          setPendingStatusId(null);
        },
      },
    );
  };

  const handleViewReadonlyPreview = (quotationId: string) => {
    const quotation = quotations?.find((item) => item.id === quotationId);

    if (
      !quotation ||
      (quotation.status !== "sent" &&
        quotation.status !== "approved" &&
        quotation.status !== "rejected" &&
        quotation.status !== "expired")
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
      validUntil: quotation.validUntil ?? "",
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
      <ConfirmQuotationStatusChangeModal
        isOpen={pendingStatusChange !== null}
        fromStatus={pendingStatusChange?.fromStatus ?? "sent"}
        toStatus={pendingStatusChange?.nextStatus ?? "sent"}
        isConfirming={updateStatusMutation.isPending}
        onConfirm={confirmStatusChange}
        onCancel={() => {
          if (!updateStatusMutation.isPending) setPendingStatusChange(null);
        }}
      />

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
          onClick={goToNewQuotation}
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

      {statusError ? (
        <div
          role="alert"
          className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-800"
        >
          <HiOutlineExclamationCircle className="mt-0.5 shrink-0 text-base" />
          <p>{statusError}</p>
        </div>
      ) : null}

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
              onClick={goToNewQuotation}
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
                {quotations.map((q, index) => {
                  const effectiveStatus = getEffectiveQuotationStatus(q);
                  const canChangeStatus = effectiveStatus === "sent";
                  const isUpdatingRow =
                    pendingStatusId === q.id && updateStatusMutation.isPending;

                  return (
                    <tr
                      key={q.id}
                      className="group transition hover:bg-slate-50"
                    >
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
                          className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${QUOTATION_STATUS_BADGE_CLASSES[effectiveStatus]}`}
                        >
                          {STATUS_LABELS[effectiveStatus]}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-right text-sm font-bold text-slate-800">
                        {formatCLP(q.total)}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-500">
                        {formatDate(q.createdAt)}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-3">
                          {effectiveStatus === "draft" ? (
                            <button
                              type="button"
                              onClick={() => handleEditDraftQuotation(q.id)}
                              className="flex items-center gap-1 text-xs font-semibold text-emerald-700 opacity-0 transition hover:text-emerald-800 group-hover:opacity-100"
                            >
                              <HiOutlineEye className="text-sm" />
                              {
                                LABELS_QUOTATIONS_LIST_PAGE.table
                                  .actionEditDraft
                              }
                            </button>
                          ) : null}

                          {effectiveStatus === "sent" ||
                          effectiveStatus === "approved" ||
                          effectiveStatus === "rejected" ||
                          effectiveStatus === "expired" ? (
                            <button
                              type="button"
                              onClick={() => handleViewReadonlyPreview(q.id)}
                              className="flex items-center gap-1 text-xs font-semibold text-blue-700 opacity-0 transition hover:text-blue-800 group-hover:opacity-100"
                            >
                              <HiOutlineEye className="text-sm" />
                              {
                                LABELS_QUOTATIONS_LIST_PAGE.table
                                  .actionViewPreview
                              }
                            </button>
                          ) : null}

                          {canChangeStatus ? (
                            <>
                              <button
                                type="button"
                                disabled={isUpdatingRow}
                                onClick={() =>
                                  requestStatusChange(
                                    q.id,
                                    effectiveStatus,
                                    "approved",
                                  )
                                }
                                className="flex items-center gap-1 text-xs font-semibold text-emerald-700 opacity-0 transition hover:text-emerald-800 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <HiOutlineCheckCircle className="text-sm" />
                                {isUpdatingRow
                                  ? LABELS_QUOTATIONS_LIST_PAGE.table
                                      .actionUpdatingStatus
                                  : LABELS_QUOTATIONS_LIST_PAGE.table
                                      .actionApprove}
                              </button>
                              <button
                                type="button"
                                disabled={isUpdatingRow}
                                onClick={() =>
                                  requestStatusChange(
                                    q.id,
                                    effectiveStatus,
                                    "rejected",
                                  )
                                }
                                className="flex items-center gap-1 text-xs font-semibold text-rose-700 opacity-0 transition hover:text-rose-800 group-hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-60"
                              >
                                <HiOutlineXCircle className="text-sm" />
                                {
                                  LABELS_QUOTATIONS_LIST_PAGE.table
                                    .actionReject
                                }
                              </button>
                            </>
                          ) : null}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationsListPage;
