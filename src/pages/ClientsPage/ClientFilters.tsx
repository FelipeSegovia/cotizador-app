import { HiMagnifyingGlass } from "react-icons/hi2";
import { LABELS_CLIENTS_PAGE } from "../../shared/data";
import type { ClientStatus } from "../../shared/types/client";

export type ClientStatusFilter = ClientStatus | "all";

type ClientFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: ClientStatusFilter;
  onStatusFilterChange: (value: ClientStatusFilter) => void;
};

const FILTER_OPTIONS: { value: ClientStatusFilter; label: string }[] = [
  { value: "all", label: LABELS_CLIENTS_PAGE.filters.all },
  { value: "not_contacted", label: LABELS_CLIENTS_PAGE.filters.notContacted },
  { value: "approved", label: LABELS_CLIENTS_PAGE.filters.approved },
  { value: "rejected", label: LABELS_CLIENTS_PAGE.filters.rejected },
];

const ClientFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
}: ClientFiltersProps) => {
  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:px-6">
      <label className="relative w-full">
        <HiMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={LABELS_CLIENTS_PAGE.searchPlaceholder}
          className="w-full rounded-full border border-border bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-ring focus:bg-card"
        />
      </label>

      <div className="flex flex-wrap gap-2">
        {FILTER_OPTIONS.map((option) => {
          const isActive = statusFilter === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onStatusFilterChange(option.value)}
              className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "border border-border bg-card text-foreground hover:bg-muted"
              }`}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ClientFilters;
