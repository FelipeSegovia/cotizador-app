import { HiOutlineDocumentPlus, HiOutlineDocumentText } from "react-icons/hi2";
import LABELS_QUOTATIONS_LIST_PAGE from "../../shared/data/labels-quotations-list-page";

type QuotationsListEmptyStateProps = {
  onCreateClick: () => void;
};

const QuotationsListEmptyState = ({
  onCreateClick,
}: QuotationsListEmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-4 py-20">
    <HiOutlineDocumentText className="text-5xl text-muted-foreground" />
    <p className="text-sm text-muted-foreground">
      {LABELS_QUOTATIONS_LIST_PAGE.emptyState.title}
    </p>
    <button
      type="button"
      onClick={onCreateClick}
      className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
    >
      <HiOutlineDocumentPlus className="text-base" />
      {LABELS_QUOTATIONS_LIST_PAGE.emptyState.action}
    </button>
  </div>
);

export default QuotationsListEmptyState;
