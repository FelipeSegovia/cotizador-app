import { useEffect, useMemo, useState } from "react";
import { HiArrowDownTray } from "react-icons/hi2";
import { Alert } from "../../shared/components/ui";
import { LABELS_FEEDBACK_MANAGEMENT_PAGE } from "../../shared/data";
import { useFeedbacks } from "../../shared/hooks";
import type { Feedback } from "../../shared/types/feedback";
import FeedbackDetailModal from "./FeedbackDetailModal";
import FeedbackFilters, {
  type FeedbackFiltersState,
} from "./FeedbackFilters";
import FeedbackPagination from "./FeedbackPagination";
import FeedbackStatsCards from "./FeedbackStatsCards";
import FeedbackTable from "./FeedbackTable";
import { exportFeedbacksToCsv } from "./export-feedbacks-csv";
import { PAGE_SIZE } from "./feedback-utils";

const defaultFilters: FeedbackFiltersState = {
  category: "all",
  priority: "all",
};

const FeedbackManagementPage = () => {
  const { data: feedbacks = [], isLoading, isError } = useFeedbacks();
  const [filters, setFilters] = useState<FeedbackFiltersState>(defaultFilters);
  const [page, setPage] = useState(1);
  const [selectedFeedback, setSelectedFeedback] = useState<Feedback | null>(
    null,
  );

  const filteredFeedbacks = useMemo(() => {
    return feedbacks.filter((feedback) => {
      if (
        filters.category !== "all" &&
        feedback.category !== filters.category
      ) {
        return false;
      }
      if (
        filters.priority !== "all" &&
        feedback.priority !== filters.priority
      ) {
        return false;
      }
      return true;
    });
  }, [feedbacks, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredFeedbacks.length / PAGE_SIZE));

  const paginatedFeedbacks = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filteredFeedbacks.slice(start, start + PAGE_SIZE);
  }, [filteredFeedbacks, page]);

  useEffect(() => {
    setPage(1);
  }, [filters]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const showingFrom =
    filteredFeedbacks.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const showingTo = Math.min(page * PAGE_SIZE, filteredFeedbacks.length);

  const handleExportCsv = () => {
    exportFeedbacksToCsv(filteredFeedbacks);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {LABELS_FEEDBACK_MANAGEMENT_PAGE.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {LABELS_FEEDBACK_MANAGEMENT_PAGE.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={handleExportCsv}
          disabled={filteredFeedbacks.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 disabled:opacity-50"
        >
          <HiArrowDownTray className="text-base" />
          {LABELS_FEEDBACK_MANAGEMENT_PAGE.exportCsv}
        </button>
      </div>

      {!isLoading && !isError && feedbacks.length > 0 ? (
        <FeedbackStatsCards feedbacks={feedbacks} />
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <FeedbackFilters
          filters={filters}
          onChange={setFilters}
          showingFrom={showingFrom}
          showingTo={showingTo}
          totalFiltered={filteredFeedbacks.length}
        />

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-sm text-slate-500">
            {LABELS_FEEDBACK_MANAGEMENT_PAGE.loading}
          </div>
        ) : null}

        {isError ? (
          <div className="p-6">
            <Alert variant="error">
              {LABELS_FEEDBACK_MANAGEMENT_PAGE.loadError}
            </Alert>
          </div>
        ) : null}

        {!isLoading && !isError && filteredFeedbacks.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-sm text-slate-500">
            {LABELS_FEEDBACK_MANAGEMENT_PAGE.empty}
          </div>
        ) : null}

        {!isLoading && !isError && paginatedFeedbacks.length > 0 ? (
          <>
            <FeedbackTable
              feedbacks={paginatedFeedbacks}
              onViewDetail={setSelectedFeedback}
            />
            <FeedbackPagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        ) : null}
      </div>

      <FeedbackDetailModal
        feedback={selectedFeedback}
        onClose={() => setSelectedFeedback(null)}
      />
    </div>
  );
};

export default FeedbackManagementPage;
