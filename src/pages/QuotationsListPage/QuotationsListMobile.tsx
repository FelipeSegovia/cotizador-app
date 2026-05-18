import {
  QuotationRowActions,
  QuotationStatusBadge,
} from "../../shared/components/ui";
import LABELS_QUOTATIONS_LIST_PAGE from "../../shared/data/labels-quotations-list-page";
import { formatCLP, formatDate, getEffectiveQuotationStatus } from "../../shared/utils";
import type { QuotationsListViewProps } from "./types";

const QuotationsListMobile = ({
  quotations,
  pendingStatusId,
  isUpdating,
  onEditDraft,
  onViewPreview,
  onRequestStatusChange,
}: QuotationsListViewProps) => (
  <ul className="divide-y divide-slate-100 md:hidden">
    {quotations.map((q, index) => {
      const effectiveStatus = getEffectiveQuotationStatus(q);
      const isUpdatingRow = pendingStatusId === q.id && isUpdating;

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
              <p className="truncate text-sm text-slate-600">{q.projectTitle}</p>
            </div>
            <QuotationStatusBadge
              status={effectiveStatus}
              className="shrink-0"
            />
          </div>
          <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {LABELS_QUOTATIONS_LIST_PAGE.table.total}
              </dt>
              <dd className="font-bold text-slate-800">{formatCLP(q.total)}</dd>
            </div>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-slate-400">
                {LABELS_QUOTATIONS_LIST_PAGE.table.date}
              </dt>
              <dd className="text-slate-600">{formatDate(q.createdAt)}</dd>
            </div>
          </dl>
          <QuotationRowActions
            quotationId={q.id}
            effectiveStatus={effectiveStatus}
            isUpdatingRow={isUpdatingRow}
            layout="stacked"
            onEditDraft={onEditDraft}
            onViewPreview={onViewPreview}
            onRequestStatusChange={onRequestStatusChange}
          />
        </li>
      );
    })}
  </ul>
);

export default QuotationsListMobile;
