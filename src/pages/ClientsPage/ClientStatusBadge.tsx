import { LABELS_CLIENTS_PAGE } from "../../shared/data";
import type { ClientStatus } from "../../shared/types/client";
import {
  CLIENT_STATUS_BADGE_CLASSES,
  CLIENT_STATUS_DOT_CLASSES,
} from "./client-utils";

type ClientStatusBadgeProps = {
  status: ClientStatus;
  className?: string;
};

const ClientStatusBadge = ({
  status,
  className = "",
}: ClientStatusBadgeProps) => (
  <span
    className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${CLIENT_STATUS_BADGE_CLASSES[status]} ${className}`.trim()}
  >
    <span
      className={`h-2 w-2 shrink-0 rounded-full ${CLIENT_STATUS_DOT_CLASSES[status]}`}
    />
    {LABELS_CLIENTS_PAGE.status[status]}
  </span>
);

export default ClientStatusBadge;
