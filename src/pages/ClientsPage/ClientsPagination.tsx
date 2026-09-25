import { LABELS_CLIENTS_PAGE } from "../../shared/data";

type ClientsPaginationProps = {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
};

const ClientsPagination = ({
  page,
  pageSize,
  total,
  onPageChange,
}: ClientsPaginationProps) => {
  if (total === 0) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

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
    <div className="relative flex flex-col items-center gap-3 border-t border-border px-6 py-4 sm:flex-row sm:justify-center">
      <p className="text-xs text-muted-foreground sm:absolute sm:left-6 sm:top-1/2 sm:-translate-y-1/2">
        {LABELS_CLIENTS_PAGE.table.showing
          .replace("{from}", String(from))
          .replace("{to}", String(to))
          .replace("{total}", String(total))}
      </p>
      {totalPages > 1 ? (
        <div className="flex items-center justify-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted disabled:opacity-40"
          >
            {LABELS_CLIENTS_PAGE.table.previous}
          </button>
          {items.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-muted-foreground"
              >
                …
              </span>
            ) : (
              <button
                key={item}
                type="button"
                onClick={() => onPageChange(item)}
                className={`min-w-9 rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                  item === page
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:bg-muted"
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
            className="rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition hover:bg-muted disabled:opacity-40"
          >
            {LABELS_CLIENTS_PAGE.table.next}
          </button>
        </div>
      ) : (
        <p className="text-xs text-muted-foreground">
          {LABELS_CLIENTS_PAGE.table.pageOf
            .replace("{page}", String(page))
            .replace("{totalPages}", String(totalPages))}
        </p>
      )}
    </div>
  );
};

export default ClientsPagination;
