import { useEffect, useState, type FormEvent } from "react";
import {
  HiGlobeAlt,
  HiOutlineEnvelope,
  HiOutlinePhone,
} from "react-icons/hi2";
import { toast } from "sonner";
import { Modal } from "../../shared/components/ui";
import { LABELS_CLIENTS_PAGE } from "../../shared/data";
import {
  useCreateClientActivity,
  useUpdateClient,
} from "../../shared/hooks";
import { formatDateTime } from "../../shared/utils";
import type {
  Client,
  ClientContactChannel,
  ClientStatus,
} from "../../shared/types/client";
import ClientStatusBadge from "./ClientStatusBadge";
import { CLIENT_STATUS_OPTIONS } from "./client-utils";

type ClientDetailModalProps = {
  client: Client | null;
  onClose: () => void;
  onEdit: (client: Client) => void;
};

const ClientDetailModal = ({
  client,
  onClose,
  onEdit,
}: ClientDetailModalProps) => {
  const updateClient = useUpdateClient();
  const createActivity = useCreateClientActivity();
  const [note, setNote] = useState("");
  const [noteError, setNoteError] = useState<string | null>(null);

  useEffect(() => {
    setNote("");
    setNoteError(null);
  }, [client?.id]);

  if (!client) {
    return null;
  }

  const isPending = updateClient.isPending || createActivity.isPending;

  const handleStatusChange = (status: ClientStatus) => {
    if (status === client.status) return;
    updateClient.mutate(
      { id: client.id, payload: { status } },
      {
        onError: (error) => {
          toast.error(
            (error as Error).message || LABELS_CLIENTS_PAGE.updateError,
          );
        },
      },
    );
  };

  const handleChannelToggle = (
    channel: ClientContactChannel,
    value: boolean,
  ) => {
    updateClient.mutate(
      { id: client.id, payload: { contacts: { [channel]: value } } },
      {
        onError: (error) => {
          toast.error(
            (error as Error).message || LABELS_CLIENTS_PAGE.updateError,
          );
        },
      },
    );
  };

  const onSubmitNote = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const message = note.trim();
    if (!message) {
      setNoteError(LABELS_CLIENTS_PAGE.validation.noteRequired);
      return;
    }

    setNoteError(null);
    createActivity.mutate(
      { id: client.id, payload: { message } },
      {
        onSuccess: () => {
          toast.success(LABELS_CLIENTS_PAGE.detailModal.noteSuccess);
          setNote("");
          setNoteError(null);
        },
        onError: (error) => {
          toast.error((error as Error).message);
        },
      },
    );
  };

  const displayWebsite = client.website?.replace(/^https?:\/\//, "");

  return (
    <Modal
      isOpen={Boolean(client)}
      onClose={onClose}
      title={client.name}
      subtitle={LABELS_CLIENTS_PAGE.detailModal.title}
      maxWidthClass="max-w-2xl"
    >
      <div className="space-y-6">
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => onEdit(client)}
            className="rounded-xl border border-border px-4 py-2 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            {LABELS_CLIENTS_PAGE.detailModal.edit}
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {LABELS_CLIENTS_PAGE.detailModal.status}
            </p>
            <div className="relative mt-1 inline-flex">
              <ClientStatusBadge status={client.status} />
              <select
                aria-label={LABELS_CLIENTS_PAGE.detailModal.status}
                value={client.status}
                disabled={isPending}
                onChange={(e) =>
                  handleStatusChange(e.target.value as ClientStatus)
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
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {LABELS_CLIENTS_PAGE.detailModal.created}
            </p>
            <p className="mt-1 text-sm text-foreground">
              {formatDateTime(client.createdAt)}
            </p>
          </div>
          {client.website ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {LABELS_CLIENTS_PAGE.detailModal.website}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                <HiGlobeAlt className="shrink-0 text-muted-foreground" />
                {displayWebsite}
              </p>
            </div>
          ) : null}
          {client.email ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {LABELS_CLIENTS_PAGE.detailModal.email}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                <HiOutlineEnvelope className="shrink-0 text-muted-foreground" />
                {client.email}
              </p>
            </div>
          ) : null}
          {client.phone ? (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {LABELS_CLIENTS_PAGE.detailModal.phone}
              </p>
              <p className="mt-1 flex items-center gap-1.5 text-sm text-foreground">
                <HiOutlinePhone className="shrink-0 text-muted-foreground" />
                {client.phone}
              </p>
            </div>
          ) : null}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {LABELS_CLIENTS_PAGE.detailModal.channels}
          </p>
          <div className="mt-2 flex flex-wrap gap-4">
            {(
              [
                {
                  channel: "email" as const,
                  label: LABELS_CLIENTS_PAGE.table.email,
                  disabled: !client.email,
                },
                {
                  channel: "phone" as const,
                  label: LABELS_CLIENTS_PAGE.table.phone,
                  disabled: !client.phone,
                },
                {
                  channel: "whatsapp" as const,
                  label: LABELS_CLIENTS_PAGE.table.whatsapp,
                  disabled: !client.phone,
                },
              ] as const
            ).map(({ channel, label, disabled }) => (
              <label
                key={channel}
                className={`inline-flex items-center gap-2 text-sm ${
                  disabled ? "text-muted-foreground/50" : "text-foreground"
                }`}
              >
                <input
                  type="checkbox"
                  checked={client.contacts[channel]}
                  disabled={isPending || disabled}
                  onChange={(e) =>
                    handleChannelToggle(channel, e.target.checked)
                  }
                  className="h-4 w-4 rounded border-border accent-primary disabled:opacity-40"
                />
                {label}
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-foreground">
            {LABELS_CLIENTS_PAGE.detailModal.timeline}
          </h3>
          {client.activities.length === 0 ? (
            <p className="mt-2 text-sm text-muted-foreground">
              {LABELS_CLIENTS_PAGE.detailModal.emptyTimeline}
            </p>
          ) : (
            <ol className="mt-3 max-h-56 space-y-3 overflow-y-auto border-l border-border pl-4">
              {client.activities.map((activity) => (
                <li key={activity.id} className="relative">
                  <span className="absolute -left-[1.3125rem] top-1.5 h-2.5 w-2.5 rounded-full bg-primary" />
                  <p className="text-sm text-foreground">{activity.message}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {formatDateTime(activity.createdAt)}
                    {activity.createdByName
                      ? ` · ${activity.createdByName}`
                      : null}
                  </p>
                </li>
              ))}
            </ol>
          )}
        </div>

        <form
          className="space-y-3 border-t border-border pt-4"
          onSubmit={onSubmitNote}
          noValidate
        >
          <div className="space-y-2">
            <label
              className="block text-sm font-semibold text-foreground"
              htmlFor="clientNote"
            >
              {LABELS_CLIENTS_PAGE.detailModal.noteLabel}
            </label>
            <textarea
              id="clientNote"
              rows={3}
              value={note}
              onChange={(event) => {
                setNote(event.target.value);
                if (noteError) {
                  setNoteError(null);
                }
              }}
              placeholder={LABELS_CLIENTS_PAGE.detailModal.notePlaceholder}
              aria-invalid={noteError ? "true" : "false"}
              className="w-full resize-none rounded-xl border border-input bg-card px-3 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
            {noteError ? (
              <p className="text-xs font-medium text-destructive">{noteError}</p>
            ) : null}
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
            >
              {LABELS_CLIENTS_PAGE.detailModal.close}
            </button>
            <button
              type="submit"
              disabled={createActivity.isPending}
              className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:opacity-60"
            >
              {createActivity.isPending
                ? LABELS_CLIENTS_PAGE.detailModal.addingNote
                : LABELS_CLIENTS_PAGE.detailModal.addNote}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
};

export default ClientDetailModal;
