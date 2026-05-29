import { LABELS_FEEDBACK_MANAGEMENT_PAGE } from "../../shared/data";
import type { Feedback } from "../../shared/types/feedback";
import {
  categoryClassMap,
  formatRelativeDate,
  getAuthorDisplayName,
  getInitials,
  priorityDotClassMap,
  truncateText,
} from "./feedback-utils";

type FeedbackTableProps = {
  feedbacks: Feedback[];
  onViewDetail: (feedback: Feedback) => void;
};

const FeedbackTable = ({ feedbacks, onViewDetail }: FeedbackTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-slate-100 text-xs font-semibold uppercase tracking-wide text-slate-500">
            <th className="px-6 py-4">
              {LABELS_FEEDBACK_MANAGEMENT_PAGE.table.author}
            </th>
            <th className="px-6 py-4">
              {LABELS_FEEDBACK_MANAGEMENT_PAGE.table.feedback}
            </th>
            <th className="px-6 py-4">
              {LABELS_FEEDBACK_MANAGEMENT_PAGE.table.category}
            </th>
            <th className="px-6 py-4">
              {LABELS_FEEDBACK_MANAGEMENT_PAGE.table.priority}
            </th>
            <th className="px-6 py-4">
              {LABELS_FEEDBACK_MANAGEMENT_PAGE.table.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {feedbacks.map((feedback) => {
            const authorName = getAuthorDisplayName(feedback);

            return (
              <tr
                key={feedback.id}
                className="border-b border-slate-50 transition hover:bg-slate-50/60"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-800">
                      {getInitials(authorName)}
                    </span>
                    <div>
                      <p className="font-medium text-slate-800">{authorName}</p>
                      <p className="text-xs text-slate-500">
                        {formatRelativeDate(feedback.createdAt)}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="max-w-xs px-6 py-4 text-slate-600">
                  {truncateText(feedback.title, 60)}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${categoryClassMap[feedback.category]}`}
                  >
                    {LABELS_FEEDBACK_MANAGEMENT_PAGE.category[feedback.category]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <span className="inline-flex items-center gap-2 text-slate-700">
                    <span
                      className={`h-2 w-2 rounded-full ${priorityDotClassMap[feedback.priority]}`}
                    />
                    {LABELS_FEEDBACK_MANAGEMENT_PAGE.priority[feedback.priority]}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onViewDetail(feedback)}
                    className="text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
                  >
                    {LABELS_FEEDBACK_MANAGEMENT_PAGE.table.viewDetail}
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default FeedbackTable;
