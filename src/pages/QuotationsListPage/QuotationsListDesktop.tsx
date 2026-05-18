import {
  QuotationRowActions,
  QuotationStatusBadge,
} from "../../shared/components/ui";
import LABELS_QUOTATIONS_LIST_PAGE from "../../shared/data/labels-quotations-list-page";
import { formatCLP, formatDate, getEffectiveQuotationStatus } from "../../shared/utils";
import type { QuotationsListViewProps } from "./types";

const QuotationsListDesktop = ({
  quotations,
  pendingStatusId,
  isUpdating,
  onEditDraft,
  onViewPreview,
  onRequestStatusChange,
}: QuotationsListViewProps) => (
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
          const isUpdatingRow = pendingStatusId === q.id && isUpdating;

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
                <QuotationStatusBadge status={effectiveStatus} />
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
                  onEditDraft={onEditDraft}
                  onViewPreview={onViewPreview}
                  onRequestStatusChange={onRequestStatusChange}
                />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  </div>
);

export default QuotationsListDesktop;
