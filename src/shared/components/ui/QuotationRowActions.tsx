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
    "border-primary/30 bg-accent text-accent-foreground hover:bg-primary/10",
  blue: "border-chart-3/40 bg-chart-3/10 text-chart-3 hover:bg-chart-3/20 dark:border-chart-2/40 dark:bg-chart-2/15 dark:text-chart-2",
  rose: "border-destructive/40 bg-destructive/10 text-destructive hover:bg-destructive/20",
} as const;

const stackedActionButtonClass = (tone: keyof typeof STACKED_ACTION_TONES) =>
  `flex min-w-[calc(50%-0.25rem)] flex-1 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${STACKED_ACTION_TONES[tone]}`;

const COMPACT_ICON_TONES = {
  emerald: "text-primary hover:border-primary/30 hover:bg-accent",
  blue: "text-chart-3 hover:border-chart-3/40 hover:bg-chart-3/10 dark:text-chart-2",
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
    `inline-flex shrink-0 items-center justify-center rounded-lg border border-border bg-card p-1.5 transition disabled:cursor-not-allowed disabled:opacity-60 ${COMPACT_ICON_TONES[tone]}`;

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
          className="inline-flex shrink-0 overflow-hidden rounded-lg border border-border bg-card shadow-sm"
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
            className="inline-flex items-center gap-1 border-r border-border bg-accent px-2 py-1.5 text-xs font-semibold text-accent-foreground transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-60 xl:px-2.5"
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
            className="inline-flex items-center gap-1 bg-destructive/10 px-2 py-1.5 text-xs font-semibold text-destructive transition hover:bg-destructive/20 disabled:cursor-not-allowed disabled:opacity-60 xl:px-2.5"
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
