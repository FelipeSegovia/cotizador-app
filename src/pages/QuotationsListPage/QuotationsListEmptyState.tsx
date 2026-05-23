import { HiOutlineDocumentPlus, HiOutlineDocumentText } from "react-icons/hi2";
import LABELS_QUOTATIONS_LIST_PAGE from "../../shared/data/labels-quotations-list-page";

type QuotationsListEmptyStateProps = {
  onCreateClick: () => void;
};

const QuotationsListEmptyState = ({
  onCreateClick,
}: QuotationsListEmptyStateProps) => (
  <div className="flex flex-col items-center justify-center gap-4 py-20">
    <HiOutlineDocumentText className="text-5xl text-slate-300" />
    <p className="text-sm text-slate-500">
      {LABELS_QUOTATIONS_LIST_PAGE.emptyState.title}
    </p>
    <button
      type="button"
      onClick={onCreateClick}
      className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
    >
      <HiOutlineDocumentPlus className="text-base" />
      {LABELS_QUOTATIONS_LIST_PAGE.emptyState.action}
    </button>
  </div>
);

export default QuotationsListEmptyState;
