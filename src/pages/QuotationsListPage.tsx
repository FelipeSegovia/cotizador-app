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

type QuotationRowActionsProps = {
  quotationId: string;
  effectiveStatus: QuotationStatus;
  isUpdatingRow: boolean;
  layout: "compact" | "stacked";
  onEditDraft: (quotationId: string) => void;
  onViewPreview: (quotationId: string) => void;
  onRequestStatusChange: (
    quotationId: string,
    fromStatus: QuotationStatus,
    nextStatus: ManualQuotationStatusTransition,
  ) => void;
};

const STACKED_ACTION_TONES = {
  emerald:
    "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100",
  blue: "border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100",
  rose: "border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100",
} as const;

const stackedActionButtonClass = (tone: keyof typeof STACKED_ACTION_TONES) =>
  `flex min-w-[calc(50%-0.25rem)] flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${STACKED_ACTION_TONES[tone]}`;

const COMPACT_ICON_TONES = {
  emerald:
    "text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50",
  blue: "text-blue-700 hover:border-blue-200 hover:bg-blue-50",
} as const;

const QuotationRowActions = ({
  quotationId,
  effectiveStatus,
  isUpdatingRow,
  layout,
  onEditDraft,
  onViewPreview,
  onRequestStatusChange,
}: QuotationRowActionsProps) => {
  const canChangeStatus = effectiveStatus === "sent";
  const canViewPreview =
    effectiveStatus === "sent" ||
    effectiveStatus === "approved" ||
    effectiveStatus === "rejected" ||
    effectiveStatus === "expired";

  if (layout === "stacked") {
    return (
      <div className="flex flex-wrap gap-2">
        {effectiveStatus === "draft" ? (
          <button
            type="button"
            onClick={() => onEditDraft(quotationId)}
            className={stackedActionButtonClass("emerald")}
          >
            <HiOutlineEye className="shrink-0 text-sm" />
            {LABELS_QUOTATIONS_LIST_PAGE.table.actionEditDraft}
          </button>
        ) : null}

        {canViewPreview ? (
          <button
            type="button"
            onClick={() => onViewPreview(quotationId)}
            className={stackedActionButtonClass("blue")}
          >
            <HiOutlineEye className="shrink-0 text-sm" />
            {LABELS_QUOTATIONS_LIST_PAGE.table.actionViewPreview}
          </button>
        ) : null}

        {canChangeStatus ? (
          <>
            <button
              type="button"
              disabled={isUpdatingRow}
              onClick={() =>
                onRequestStatusChange(quotationId, effectiveStatus, "approved")
              }
              className={stackedActionButtonClass("emerald")}
            >
              <HiOutlineCheckCircle className="shrink-0 text-sm" />
              {isUpdatingRow
                ? LABELS_QUOTATIONS_LIST_PAGE.table.actionUpdatingStatus
                : LABELS_QUOTATIONS_LIST_PAGE.table.actionApprove}
            </button>
            <button
              type="button"
              disabled={isUpdatingRow}
              onClick={() =>
                onRequestStatusChange(quotationId, effectiveStatus, "rejected")
              }
              className={stackedActionButtonClass("rose")}
            >
              <HiOutlineXCircle className="shrink-0 text-sm" />
              {LABELS_QUOTATIONS_LIST_PAGE.table.actionReject}
            </button>
          </>
        ) : null}
      </div>
    );
  }

  const compactIconButtonClass = (tone: keyof typeof COMPACT_ICON_TONES) =>
    `inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white p-1.5 transition disabled:cursor-not-allowed disabled:opacity-60 ${COMPACT_ICON_TONES[tone]}`;

  return (
    <div className="flex items-center justify-end gap-1.5">
      {effectiveStatus === "draft" ? (
        <button
          type="button"
          title={LABELS_QUOTATIONS_LIST_PAGE.table.actionEditDraft}
          aria-label={LABELS_QUOTATIONS_LIST_PAGE.table.actionEditDraft}
          onClick={() => onEditDraft(quotationId)}
          className={compactIconButtonClass("emerald")}
        >
          <HiOutlineEye className="h-4 w-4" />
        </button>
      ) : null}

      {canViewPreview ? (
        <button
          type="button"
          title={LABELS_QUOTATIONS_LIST_PAGE.table.actionViewPreview}
          aria-label={LABELS_QUOTATIONS_LIST_PAGE.table.actionViewPreview}
          onClick={() => onViewPreview(quotationId)}
          className={compactIconButtonClass("blue")}
        >
          <HiOutlineEye className="h-4 w-4" />
        </button>
      ) : null}

      {canChangeStatus ? (
        <div
          role="group"
          aria-label={LABELS_QUOTATIONS_LIST_PAGE.table.statusActionsGroup}
          className="inline-flex shrink-0 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <button
            type="button"
            disabled={isUpdatingRow}
            title={
              isUpdatingRow
                ? LABELS_QUOTATIONS_LIST_PAGE.table.actionUpdatingStatus
                : LABELS_QUOTATIONS_LIST_PAGE.table.actionApprove
            }
            aria-label={
              isUpdatingRow
                ? LABELS_QUOTATIONS_LIST_PAGE.table.actionUpdatingStatus
                : LABELS_QUOTATIONS_LIST_PAGE.table.actionApprove
            }
            onClick={() =>
              onRequestStatusChange(quotationId, effectiveStatus, "approved")
            }
            className="inline-flex items-center gap-1 border-r border-slate-200 bg-emerald-50 px-2 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100 disabled:cursor-not-allowed disabled:opacity-60 xl:px-2.5"
          >
            <HiOutlineCheckCircle className="h-4 w-4 shrink-0" />
            <span className="hidden whitespace-nowrap 2xl:inline">
              {isUpdatingRow
                ? LABELS_QUOTATIONS_LIST_PAGE.table.actionUpdatingStatus
                : LABELS_QUOTATIONS_LIST_PAGE.table.actionApprove}
            </span>
          </button>
          <button
            type="button"
            disabled={isUpdatingRow}
            title={LABELS_QUOTATIONS_LIST_PAGE.table.actionReject}
            aria-label={LABELS_QUOTATIONS_LIST_PAGE.table.actionReject}
            onClick={() =>
              onRequestStatusChange(quotationId, effectiveStatus, "rejected")
            }
            className="inline-flex items-center gap-1 bg-rose-50 px-2 py-1.5 text-xs font-semibold text-rose-700 transition hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60 xl:px-2.5"
          >
            <HiOutlineXCircle className="h-4 w-4 shrink-0" />
            <span className="hidden whitespace-nowrap 2xl:inline">
              {LABELS_QUOTATIONS_LIST_PAGE.table.actionReject}
            </span>
          </button>
        </div>
      ) : null}
    </div>
  );
};

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
          <>
            <ul className="divide-y divide-slate-100 md:hidden">
              {quotations.map((q, index) => {
                const effectiveStatus = getEffectiveQuotationStatus(q);
                const isUpdatingRow =
                  pendingStatusId === q.id && updateStatusMutation.isPending;

                return (
                  <li key={q.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-medium text-slate-400">
                          {LABELS_QUOTATIONS_LIST_PAGE.table.number}{" "}
                          {String(index + 1).padStart(3, "0")}
                        </p>
                        <p className="mt-0.5 truncate text-sm font-semibold text-slate-800">
                          {q.clientName}
                        </p>
                        <p className="truncate text-sm text-slate-600">
                          {q.projectTitle}
                        </p>
                      </div>
                      <span
                        className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${QUOTATION_STATUS_BADGE_CLASSES[effectiveStatus]}`}
                      >
                        {STATUS_LABELS[effectiveStatus]}
                      </span>
                    </div>
                    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          {LABELS_QUOTATIONS_LIST_PAGE.table.total}
                        </dt>
                        <dd className="font-bold text-slate-800">
                          {formatCLP(q.total)}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          {LABELS_QUOTATIONS_LIST_PAGE.table.date}
                        </dt>
                        <dd className="text-slate-600">
                          {formatDate(q.createdAt)}
                        </dd>
                      </div>
                    </dl>
                    <QuotationRowActions
                      quotationId={q.id}
                      effectiveStatus={effectiveStatus}
                      isUpdatingRow={isUpdatingRow}
                      layout="stacked"
                      onEditDraft={handleEditDraftQuotation}
                      onViewPreview={handleViewReadonlyPreview}
                      onRequestStatusChange={requestStatusChange}
                    />
                  </li>
                );
              })}
            </ul>

            <div className="hidden md:block">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                    <th className="w-14 whitespace-nowrap px-4 pb-3 pt-5 lg:px-6">
                      {LABELS_QUOTATIONS_LIST_PAGE.table.number}
                    </th>
                    <th className="px-3 pb-3 pt-5 lg:px-4">
                      {LABELS_QUOTATIONS_LIST_PAGE.table.client}
                    </th>
                    <th className="px-3 pb-3 pt-5 lg:px-4">
                      {LABELS_QUOTATIONS_LIST_PAGE.table.project}
                    </th>
                    <th className="whitespace-nowrap px-3 pb-3 pt-5 lg:px-4">
                      {LABELS_QUOTATIONS_LIST_PAGE.table.status}
                    </th>
                    <th className="whitespace-nowrap px-3 pb-3 pt-5 text-right lg:px-4">
                      {LABELS_QUOTATIONS_LIST_PAGE.table.total}
                    </th>
                    <th className="hidden w-px whitespace-nowrap px-3 pb-3 pt-5 lg:table-cell lg:px-4">
                      {LABELS_QUOTATIONS_LIST_PAGE.table.date}
                    </th>
                    <th className="w-px whitespace-nowrap px-3 pb-3 pt-5 text-right lg:px-6">
                      <span className="sr-only">
                        {LABELS_QUOTATIONS_LIST_PAGE.table.actions}
                      </span>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {quotations.map((q, index) => {
                    const effectiveStatus = getEffectiveQuotationStatus(q);
                    const isUpdatingRow =
                      pendingStatusId === q.id &&
                      updateStatusMutation.isPending;

                    return (
                      <tr key={q.id} className="transition hover:bg-slate-50">
                        <td className="px-4 py-4 text-sm font-medium text-slate-400 lg:px-6">
                          {String(index + 1).padStart(3, "0")}
                        </td>
                        <td className="max-w-0 truncate px-3 py-4 text-sm font-semibold text-slate-800 lg:px-4">
                          {q.clientName}
                        </td>
                        <td className="max-w-0 truncate px-3 py-4 text-sm text-slate-600 lg:px-4">
                          {q.projectTitle}
                        </td>
                        <td className="px-3 py-4 lg:px-4">
                          <span
                            className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${QUOTATION_STATUS_BADGE_CLASSES[effectiveStatus]}`}
                          >
                            {STATUS_LABELS[effectiveStatus]}
                          </span>
                        </td>
                        <td className="px-3 py-4 text-right text-sm font-bold text-slate-800 lg:px-4">
                          {formatCLP(q.total)}
                        </td>
                        <td className="hidden w-px whitespace-nowrap px-3 py-4 text-sm text-slate-500 lg:table-cell lg:px-4">
                          {formatDate(q.createdAt)}
                        </td>
                        <td className="w-px whitespace-nowrap px-3 py-4 text-right lg:px-6">
                          <QuotationRowActions
                            quotationId={q.id}
                            effectiveStatus={effectiveStatus}
                            isUpdatingRow={isUpdatingRow}
                            layout="compact"
                            onEditDraft={handleEditDraftQuotation}
                            onViewPreview={handleViewReadonlyPreview}
                            onRequestStatusChange={requestStatusChange}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default QuotationsListPage;
