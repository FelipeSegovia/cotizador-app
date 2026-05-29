import { LABELS_FEEDBACK_MANAGEMENT_PAGE } from "../../shared/data";

type FeedbackPaginationProps = {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const FeedbackPagination = ({
  page,
  totalPages,
  onPageChange,
}: FeedbackPaginationProps) => {
  if (totalPages <= 1) {
    return null;
  }

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  );

  const items: (number | "ellipsis")[] = [];
  pageNumbers.forEach((p, index) => {
    if (index > 0 && p - pageNumbers[index - 1] > 1) {
      items.push("ellipsis");
    }
    items.push(p);
  });

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 px-6 py-4">
      <p className="text-sm text-slate-500">
        {LABELS_FEEDBACK_MANAGEMENT_PAGE.table.pageOf
          .replace("{page}", String(page))
          .replace("{totalPages}", String(totalPages))}
      </p>
      <div className="flex items-center gap-1">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
        >
          {LABELS_FEEDBACK_MANAGEMENT_PAGE.table.previous}
        </button>
        {items.map((item, index) =>
          item === "ellipsis" ? (
            <span key={`ellipsis-${index}`} className="px-2 text-slate-400">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={`min-w-[36px] rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                item === page
                  ? "bg-emerald-700 text-white"
                  : "border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-50 disabled:opacity-40"
        >
          {LABELS_FEEDBACK_MANAGEMENT_PAGE.table.next}
        </button>
      </div>
    </div>
  );
};

export default FeedbackPagination;
