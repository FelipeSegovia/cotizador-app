import { HiTrash } from "react-icons/hi2";
import { RoleBadge } from "../../shared/components/ui";
import LABELS_ADMIN_USERS_PAGE from "../../shared/data/labels-admin-users-page";
import type { Invitation } from "../../shared/types/auth";
import { formatDateTime } from "../../shared/utils";

type InvitationsTableProps = {
  invitations: Invitation[];
  pendingRevokeId: string | null;
  onRevoke: (invitation: Invitation) => void;
};

const InvitationsTable = ({
  invitations,
  pendingRevokeId,
  onRevoke,
}: InvitationsTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-6 py-4">
              {LABELS_ADMIN_USERS_PAGE.invitations.name}
            </th>
            <th className="px-6 py-4">
              {LABELS_ADMIN_USERS_PAGE.invitations.email}
            </th>
            <th className="px-6 py-4">
              {LABELS_ADMIN_USERS_PAGE.invitations.role}
            </th>
            <th className="px-6 py-4">
              {LABELS_ADMIN_USERS_PAGE.invitations.expiresAt}
            </th>
            <th className="px-6 py-4">
              {LABELS_ADMIN_USERS_PAGE.table.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {invitations.map((invitation) => (
            <tr
              key={invitation.id}
              className="border-b border-border transition hover:bg-muted/60"
            >
              <td className="px-6 py-4 font-medium text-foreground">
                {invitation.name}
              </td>
              <td className="px-6 py-4 text-muted-foreground">
                {invitation.email}
              </td>
              <td className="px-6 py-4">
                <RoleBadge role={invitation.role} />
              </td>
              <td className="px-6 py-4 text-muted-foreground">
                {formatDateTime(invitation.expiresAt)}
              </td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  title={LABELS_ADMIN_USERS_PAGE.invitations.revoke}
                  disabled={pendingRevokeId === invitation.id}
                  onClick={() => onRevoke(invitation)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-destructive/10 hover:text-destructive disabled:opacity-50"
                >
                  <HiTrash className="text-lg" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default InvitationsTable;
