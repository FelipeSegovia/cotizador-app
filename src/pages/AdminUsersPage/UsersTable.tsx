import { HiOutlinePencilSquare } from "react-icons/hi2";
import { RoleBadge } from "../../shared/components/ui";
import LABELS_ADMIN_USERS_PAGE from "../../shared/data/labels-admin-users-page";
import type { User } from "../../shared/types/auth";
import UserStatusToggle from "./UserStatusToggle";

const getInitials = (name: string): string => {
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
};

type UsersTableProps = {
  users: User[];
  currentUserId?: string;
  pendingToggleId: string | null;
  onEdit: (user: User) => void;
  onToggleStatus: (user: User) => void;
};

const UsersTable = ({
  users,
  currentUserId,
  pendingToggleId,
  onEdit,
  onToggleStatus,
}: UsersTableProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            <th className="px-6 py-4">{LABELS_ADMIN_USERS_PAGE.table.name}</th>
            <th className="px-6 py-4">{LABELS_ADMIN_USERS_PAGE.table.email}</th>
            <th className="px-6 py-4">{LABELS_ADMIN_USERS_PAGE.table.role}</th>
            <th className="px-6 py-4">
              {LABELS_ADMIN_USERS_PAGE.table.status}
            </th>
            <th className="px-6 py-4">
              {LABELS_ADMIN_USERS_PAGE.table.actions}
            </th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              className="border-b border-border transition hover:bg-muted/60"
            >
              <td className="px-6 py-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-bold text-accent-foreground">
                    {getInitials(user.name)}
                  </span>
                  <span className="font-medium text-foreground">{user.name}</span>
                </div>
              </td>
              <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
              <td className="px-6 py-4">
                <RoleBadge role={user.role} />
              </td>
              <td className="px-6 py-4">
                <UserStatusToggle
                  isActive={user.isActive}
                  disabled={
                    pendingToggleId === user.id || user.id === currentUserId
                  }
                  onToggle={() => onToggleStatus(user)}
                />
              </td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  title={LABELS_ADMIN_USERS_PAGE.table.edit}
                  onClick={() => onEdit(user)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  <HiOutlinePencilSquare className="text-lg" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border px-6 py-4 text-xs text-muted-foreground">
        <span>
          {LABELS_ADMIN_USERS_PAGE.table.showing
            .replace("{count}", String(users.length))
            .replace("{total}", String(users.length))}
        </span>
      </div>
    </div>
  );
};

export default UsersTable;
