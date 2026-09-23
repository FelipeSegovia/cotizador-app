import { Modal } from "../../shared/components/ui";
import { LABELS_CLIENTS_PAGE } from "../../shared/data";
import type { Client } from "../../shared/types/client";

type DeleteClientModalProps = {
  client: Client | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteClientModal = ({
  client,
  isDeleting,
  onClose,
  onConfirm,
}: DeleteClientModalProps) => {
  if (!client) {
    return null;
  }

  return (
    <Modal
      isOpen={Boolean(client)}
      onClose={isDeleting ? undefined : onClose}
      dismissible={!isDeleting}
      title={LABELS_CLIENTS_PAGE.deleteModal.title}
      subtitle={LABELS_CLIENTS_PAGE.deleteModal.subtitle}
      maxWidthClass="max-w-md"
    >
      <div className="space-y-5">
        <p className="text-sm text-muted-foreground">
          {LABELS_CLIENTS_PAGE.deleteModal.confirm.replace(
            "{name}",
            client.name,
          )}
        </p>
        <div className="flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isDeleting}
            className="rounded-xl border border-border px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:opacity-60"
          >
            {LABELS_CLIENTS_PAGE.deleteModal.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="rounded-xl bg-destructive px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-destructive/90 disabled:opacity-60"
          >
            {isDeleting
              ? LABELS_CLIENTS_PAGE.deleteModal.submitting
              : LABELS_CLIENTS_PAGE.deleteModal.submit}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default DeleteClientModal;
