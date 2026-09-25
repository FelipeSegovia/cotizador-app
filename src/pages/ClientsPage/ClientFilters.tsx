import { HiMagnifyingGlass } from "react-icons/hi2";
import { LABELS_CLIENTS_PAGE } from "../../shared/data";
import type { ClientStatus } from "../../shared/types/client";
import { searchQueryAsTagHint } from "./client-utils";

export type ClientStatusFilter = ClientStatus | "all";

type ClientFiltersProps = {
  search: string;
  onSearchChange: (value: string) => void;
  statusFilter: ClientStatusFilter;
  onStatusFilterChange: (value: ClientStatusFilter) => void;
  availableTags: string[];
  selectedTags: string[];
  onSelectedTagsChange: (tags: string[]) => void;
};

const FILTER_OPTIONS: { value: ClientStatusFilter; label: string }[] = [
  { value: "all", label: LABELS_CLIENTS_PAGE.filters.all },
  { value: "not_contacted", label: LABELS_CLIENTS_PAGE.filters.notContacted },
  { value: "pending", label: LABELS_CLIENTS_PAGE.filters.pending },
  { value: "no_answer", label: LABELS_CLIENTS_PAGE.filters.noAnswer },
  { value: "approved", label: LABELS_CLIENTS_PAGE.filters.approved },
  { value: "rejected", label: LABELS_CLIENTS_PAGE.filters.rejected },
];

const ClientFilters = ({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  availableTags,
  selectedTags,
  onSelectedTagsChange,
}: ClientFiltersProps) => {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onSelectedTagsChange(selectedTags.filter((item) => item !== tag));
      return;
    }
    onSelectedTagsChange([...selectedTags, tag]);
  };

  const selectTagFromSearch = (tag: string) => {
    if (!selectedTags.includes(tag)) {
      onSelectedTagsChange([...selectedTags, tag]);
    }
    onSearchChange("");
  };

  const query = search.trim().toLowerCase();
  const tagHint = searchQueryAsTagHint(search);
  const suggestedTags =
    query.length > 0
      ? availableTags.filter(
          (tag) =>
            !selectedTags.includes(tag) &&
            (tag.includes(query) ||
              (tagHint.length > 0 && tag.includes(tagHint))),
        )
      : [];

  return (
    <div className="flex flex-col gap-3 border-b border-border px-4 py-4 sm:px-6">
      <div className="relative w-full">
        <label className="relative block w-full">
          <HiMagnifyingGlass className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            type="search"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={LABELS_CLIENTS_PAGE.searchPlaceholder}
            className="w-full rounded-full border border-border bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-ring focus:bg-card"
          />
        </label>
        {suggestedTags.length > 0 ? (
          <div
            role="listbox"
            aria-label={LABELS_CLIENTS_PAGE.filters.tagSuggestions}
            className="absolute left-0 right-0 top-[calc(100%+0.35rem)] z-20 overflow-hidden rounded-xl border border-border bg-card shadow-lg"
          >
            <p className="border-b border-border px-3.5 py-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
              {LABELS_CLIENTS_PAGE.filters.tagSuggestions}
            </p>
            <ul className="max-h-40 overflow-y-auto py-1">
              {suggestedTags.map((tag) => (
                <li key={tag}>
                  <button
                    type="button"
                    role="option"
                    onClick={() => selectTagFromSearch(tag)}
                    className="flex w-full items-center gap-2 px-3.5 py-2 text-left text-sm text-foreground transition hover:bg-muted"
                  >
                    <span className="rounded-full bg-muted px-2 py-0.5 text-xs font-semibold text-muted-foreground">
                      {tag}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {LABELS_CLIENTS_PAGE.filters.filterByTag}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

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

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          {LABELS_CLIENTS_PAGE.filters.tags}
        </p>
        {availableTags.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            {LABELS_CLIENTS_PAGE.filters.noTags}
          </p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "border border-border bg-card text-foreground hover:bg-muted"
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientFilters;
