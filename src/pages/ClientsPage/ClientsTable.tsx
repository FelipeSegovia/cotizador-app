import {
  HiGlobeAlt,
  HiOutlineEnvelope,
  HiOutlinePencilSquare,
  HiOutlinePhone,
  HiOutlineTrash,
} from "react-icons/hi2";
import { LABELS_CLIENTS_PAGE } from "../../shared/data";
import { formatDateTime } from "../../shared/utils";
import type {
  Client,
  ClientContactChannel,
  ClientStatus,
} from "../../shared/types/client";
import ClientStatusBadge from "./ClientStatusBadge";
import ClientTagChips from "./ClientTagChips";
import { CLIENT_STATUS_OPTIONS, formatContactPreview } from "./client-utils";

type ClientsTableProps = {
  clients: Client[];
  pendingId: string | null;
  onOpenDetail: (client: Client) => void;
  onStatusChange: (client: Client, status: ClientStatus) => void;
  onChannelToggle: (
    client: Client,
    channel: ClientContactChannel,
    value: boolean,
  ) => void;
  onEdit: (client: Client) => void;
  onRequestDelete: (client: Client) => void;
};

const displayWebsite = (website?: string) => {
  if (!website) return null;
  return website.replace(/^https?:\/\//, "");
};

const ContactLines = ({
  values,
  icon: Icon,
}: {
  values: string[];
  icon: typeof HiOutlineEnvelope;
}) => {
  const { visible, extra } = formatContactPreview(values);
  if (visible.length === 0) return null;

  return (
    <>
      {visible.map((value) => (
        <p key={value} className="flex items-center gap-1.5">
          <Icon className="shrink-0" />
          {value}
        </p>
      ))}
      {extra > 0 ? (
        <p className="pl-5 text-muted-foreground/80">
          {LABELS_CLIENTS_PAGE.table.moreContacts.replace(
            "{count}",
            String(extra),
          )}
        </p>
      ) : null}
    </>
  );
};

const ClientsTable = ({
  clients,
  pendingId,
  onOpenDetail,
  onStatusChange,
  onChannelToggle,
  onEdit,
  onRequestDelete,
}: ClientsTableProps) => {
  return (
    <div className="hidden overflow-x-auto md:block">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-6 py-4">{LABELS_CLIENTS_PAGE.table.client}</th>
            <th className="px-6 py-4">{LABELS_CLIENTS_PAGE.table.status}</th>
            <th className="px-6 py-4">{LABELS_CLIENTS_PAGE.table.created}</th>
            <th className="px-6 py-4 text-center">
              {LABELS_CLIENTS_PAGE.table.email}
            </th>
            <th className="px-6 py-4 text-center">
              {LABELS_CLIENTS_PAGE.table.phone}
            </th>
            <th className="px-6 py-4 text-center">
              {LABELS_CLIENTS_PAGE.table.whatsapp}
            </th>
            <th className="px-6 py-4">
              <span className="sr-only">{LABELS_CLIENTS_PAGE.table.actions}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => {
            const isPending = pendingId === client.id;
            const hasEmails = client.emails.length > 0;
            const hasPhones = client.phones.length > 0;
            return (
              <tr
                key={client.id}
                className="border-b border-border transition hover:bg-muted/60"
              >
                <td className="px-6 py-4">
                  <button
                    type="button"
                    onClick={() => onOpenDetail(client)}
                    className="text-left"
                    title={LABELS_CLIENTS_PAGE.table.openDetail}
                  >
                    <p className="font-semibold text-foreground hover:text-primary">
                      {client.name}
                    </p>
                    <div className="mt-1 space-y-0.5 text-xs text-muted-foreground">
                      {client.website ? (
                        <p className="flex items-center gap-1.5">
                          <HiGlobeAlt className="shrink-0" />
                          {displayWebsite(client.website)}
                        </p>
                      ) : null}
                      <ContactLines
                        values={client.emails}
                        icon={HiOutlineEnvelope}
                      />
                      <ContactLines
                        values={client.phones}
                        icon={HiOutlinePhone}
                      />
                    </div>
                    <ClientTagChips tags={client.tags} className="mt-2" />
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="relative inline-flex items-center">
                    <ClientStatusBadge status={client.status} />
                    <select
                      aria-label={LABELS_CLIENTS_PAGE.table.status}
                      value={client.status}
                      disabled={isPending}
                      onChange={(e) =>
                        onStatusChange(
                          client,
                          e.target.value as ClientStatus,
                        )
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
                </td>
                <td className="px-6 py-4 text-muted-foreground">
                  {formatDateTime(client.createdAt)}
                </td>
                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={client.contacts.email}
                    disabled={isPending || !hasEmails}
                    onChange={(e) =>
                      onChannelToggle(client, "email", e.target.checked)
                    }
                    aria-label={LABELS_CLIENTS_PAGE.table.email}
                    className="h-4 w-4 rounded border-border accent-primary disabled:opacity-40"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={client.contacts.phone}
                    disabled={isPending || !hasPhones}
                    onChange={(e) =>
                      onChannelToggle(client, "phone", e.target.checked)
                    }
                    aria-label={LABELS_CLIENTS_PAGE.table.phone}
                    className="h-4 w-4 rounded border-border accent-primary disabled:opacity-40"
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  <input
                    type="checkbox"
                    checked={client.contacts.whatsapp}
                    disabled={isPending || !hasPhones}
                    onChange={(e) =>
                      onChannelToggle(client, "whatsapp", e.target.checked)
                    }
                    aria-label={LABELS_CLIENTS_PAGE.table.whatsapp}
                    className="h-4 w-4 rounded border-border accent-primary disabled:opacity-40"
                  />
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
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
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsTable;
