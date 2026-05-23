import {
  HiOutlineCheckCircle,
  HiOutlineEye,
  HiOutlinePencil,
  HiOutlineXCircle,
} from "react-icons/hi2";
import LABELS_QUOTATIONS_LIST_PAGE from "../../data/labels-quotations-list-page";
import type {
  ManualQuotationStatusTransition,
  QuotationStatus,
} from "../../types/quotation";

export type QuotationRowActionsProps = {
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
  emerald: "text-emerald-700 hover:border-emerald-200 hover:bg-emerald-50",
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
          <HiOutlinePencil className="h-4 w-4" />
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

export default QuotationRowActions;
