import { LABELS_FEEDBACK_MANAGEMENT_PAGE } from "../../shared/data";
import type {
  FeedbackCategory,
  FeedbackPriority,
} from "../../shared/types/feedback";

export type FeedbackFiltersState = {
  category: FeedbackCategory | "all";
  priority: FeedbackPriority | "all";
};

type FeedbackFiltersProps = {
  filters: FeedbackFiltersState;
  onChange: (filters: FeedbackFiltersState) => void;
  showingFrom: number;
  showingTo: number;
  totalFiltered: number;
};

const FeedbackFilters = ({
  filters,
  onChange,
  showingFrom,
  showingTo,
  totalFiltered,
}: FeedbackFiltersProps) => {
  const showingText = LABELS_FEEDBACK_MANAGEMENT_PAGE.filters.showing
    .replace("{from}", String(showingFrom))
    .replace("{to}", String(showingTo))
    .replace("{total}", String(totalFiltered));

  return (
    <div className="flex flex-col gap-4 border-b border-slate-100 px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-3">
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
          {LABELS_FEEDBACK_MANAGEMENT_PAGE.filters.category}
          <select
            value={filters.category}
            onChange={(e) =>
              onChange({
                ...filters,
                category: e.target.value as FeedbackFiltersState["category"],
              })
            }
            className="min-w-[140px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-300"
          >
            <option value="all">
              {LABELS_FEEDBACK_MANAGEMENT_PAGE.filters.allFeminine}
            </option>
            {(Object.keys(
              LABELS_FEEDBACK_MANAGEMENT_PAGE.category,
            ) as FeedbackCategory[]).map((category) => (
              <option key={category} value={category}>
                {LABELS_FEEDBACK_MANAGEMENT_PAGE.category[category]}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-500">
          {LABELS_FEEDBACK_MANAGEMENT_PAGE.filters.priority}
          <select
            value={filters.priority}
            onChange={(e) =>
              onChange({
                ...filters,
                priority: e.target.value as FeedbackFiltersState["priority"],
              })
            }
            className="min-w-[140px] rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none focus:border-emerald-300"
          >
            <option value="all">
              {LABELS_FEEDBACK_MANAGEMENT_PAGE.filters.allFeminine}
            </option>
            {(Object.keys(
              LABELS_FEEDBACK_MANAGEMENT_PAGE.priority,
            ) as FeedbackPriority[]).map((priority) => (
              <option key={priority} value={priority}>
                {LABELS_FEEDBACK_MANAGEMENT_PAGE.priority[priority]}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-sm text-slate-500">{showingText}</p>
    </div>
  );
};

export default FeedbackFilters;
