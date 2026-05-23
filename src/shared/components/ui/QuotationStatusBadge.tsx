import type { QuotationStatus } from "../../types/quotation";
import {
  QUOTATION_STATUS_BADGE_CLASSES,
  QUOTATION_STATUS_LABELS,
} from "../../utils/quotation-status-display";

type QuotationStatusBadgeProps = {
  status: QuotationStatus;
  className?: string;
};

const QuotationStatusBadge = ({
  status,
  className = "",
}: QuotationStatusBadgeProps) => (
  <span
    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${QUOTATION_STATUS_BADGE_CLASSES[status]} ${className}`.trim()}
  >
    {QUOTATION_STATUS_LABELS[status]}
  </span>
);

export default QuotationStatusBadge;
