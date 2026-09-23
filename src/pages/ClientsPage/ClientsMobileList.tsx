import {
  HiGlobeAlt,
  HiOutlineEnvelope,
  HiOutlinePencilSquare,
  HiOutlinePhone,
  HiOutlineTrash,
} from "react-icons/hi2";
import { LABELS_CLIENTS_PAGE } from "../../shared/data";
import type { Client, ClientStatus } from "../../shared/types/client";
import ClientStatusBadge from "./ClientStatusBadge";
import { CLIENT_STATUS_OPTIONS } from "./client-utils";

type ClientsMobileListProps = {
  clients: Client[];
  pendingId: string | null;
  onOpenDetail: (client: Client) => void;
  onStatusChange: (client: Client, status: ClientStatus) => void;
  onEdit: (client: Client) => void;
  onRequestDelete: (client: Client) => void;
};

const displayWebsite = (website?: string) => {
  if (!website) return null;
  return website.replace(/^https?:\/\//, "");
};

const ClientsMobileList = ({
  clients,
  pendingId,
  onOpenDetail,
  onStatusChange,
  onEdit,
  onRequestDelete,
}: ClientsMobileListProps) => (
  <ul className="divide-y divide-border md:hidden">
    {clients.map((client) => {
      const isPending = pendingId === client.id;
      return (
        <li key={client.id} className="space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <button
              type="button"
              onClick={() => onOpenDetail(client)}
              className="min-w-0 flex-1 text-left"
            >
              <p className="truncate text-sm font-semibold text-foreground hover:text-primary">
                {client.name}
              </p>
              <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                {client.website ? (
                  <p className="flex items-center gap-1.5 truncate">
                    <HiGlobeAlt className="shrink-0" />
                    {displayWebsite(client.website)}
                  </p>
                ) : null}
                {client.email ? (
                  <p className="flex items-center gap-1.5 truncate">
                    <HiOutlineEnvelope className="shrink-0" />
                    {client.email}
                  </p>
                ) : null}
                {client.phone ? (
                  <p className="flex items-center gap-1.5 truncate">
                    <HiOutlinePhone className="shrink-0" />
                    {client.phone}
                  </p>
                ) : null}
              </div>
            </button>
            <div className="flex shrink-0 flex-col items-end gap-2">
              <div className="relative inline-flex">
                <ClientStatusBadge status={client.status} />
                <select
                  aria-label={LABELS_CLIENTS_PAGE.table.status}
                  value={client.status}
                  disabled={isPending}
                  onChange={(e) =>
                    onStatusChange(client, e.target.value as ClientStatus)
                  }
                  className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                >
                  {CLIENT_STATUS_OPTIONS.map((status) => (
                    <option key={status} value={status}>
                      {LABELS_CLIENTS_PAGE.status[status]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  title={LABELS_CLIENTS_PAGE.table.edit}
                  disabled={isPending}
                  onClick={() => onEdit(client)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50"
                >
                  <HiOutlinePencilSquare className="text-lg" />
                </button>
                <button
                  type="button"
                  title={LABELS_CLIENTS_PAGE.table.delete}
                  disabled={isPending}
                  onClick={() => onRequestDelete(client)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-destructive disabled:opacity-50"
                >
                  <HiOutlineTrash className="text-lg" />
                </button>
              </div>
            </div>
          </div>
        </li>
      );
    })}
  </ul>
);

export default ClientsMobileList;
