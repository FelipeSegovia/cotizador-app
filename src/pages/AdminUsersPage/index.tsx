import { useMemo, useState } from "react";
import { HiMagnifyingGlass, HiPlus } from "react-icons/hi2";
import { toast } from "sonner";
import { Alert } from "../../shared/components/ui";
import LABELS_ADMIN_USERS_PAGE from "../../shared/data/labels-admin-users-page";
import { isMswEnabled } from "../../shared/utils";
import { useUsers } from "../../shared/hooks/useUsers";
import {
  useResendProvisionalPassword,
  useToggleUserStatus,
} from "../../shared/hooks/useUserMutations";
import useAuthStore from "../../shared/store/useAuthStore";
import type { User } from "../../shared/types/auth";
import CreateUserModal from "./CreateUserModal";
import EditUserModal from "./EditUserModal";
import UserStatsCards from "./UserStatsCards";
import UsersTable from "./UsersTable";

const AdminUsersPage = () => {
  const currentUser = useAuthStore((s) => s.user);
  const { data: users = [], isLoading, isError } = useUsers();
  const toggleStatus = useToggleUserStatus();
  const resendPassword = useResendProvisionalPassword();

  const [search, setSearch] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const [pendingResendId, setPendingResendId] = useState<string | null>(null);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) {
      return users;
    }
    return users.filter(
      (user) =>
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query),
    );
  }, [users, search]);

  const handleToggleStatus = (user: User) => {
    setPendingToggleId(user.id);
    toggleStatus.mutate(user.id, {
      onSuccess: () => {
        toast.success(LABELS_ADMIN_USERS_PAGE.toggleSuccess);
      },
      onError: (error) => {
        toast.error((error as Error).message);
      },
      onSettled: () => {
        setPendingToggleId(null);
      },
    });
  };

  const handleResendPassword = (user: User) => {
    setPendingResendId(user.id);
    resendPassword.mutate(user.id, {
      onSuccess: () => {
        toast.success(LABELS_ADMIN_USERS_PAGE.resendSuccess);
        if (isMswEnabled()) {
          toast.info(LABELS_ADMIN_USERS_PAGE.createModal.emailSimulated);
        }
      },
      onError: (error) => {
        toast.error((error as Error).message);
      },
      onSettled: () => {
        setPendingResendId(null);
      },
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {LABELS_ADMIN_USERS_PAGE.title}
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {LABELS_ADMIN_USERS_PAGE.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setIsCreateOpen(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900"
        >
          <HiPlus className="text-base" />
          {LABELS_ADMIN_USERS_PAGE.newUserButton}
        </button>
      </div>

      {!isLoading && !isError && users.length > 0 ? (
        <UserStatsCards users={users} />
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-base font-semibold text-slate-800">
            {LABELS_ADMIN_USERS_PAGE.table.title}
          </h2>
          <label className="relative w-full max-w-xs">
            <HiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={LABELS_ADMIN_USERS_PAGE.searchPlaceholder}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-700 outline-none transition focus:border-emerald-300 focus:bg-white"
            />
          </label>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-sm text-slate-500">
            {LABELS_ADMIN_USERS_PAGE.loading}
          </div>
        ) : null}

        {isError ? (
          <div className="p-6">
            <Alert variant="error">{LABELS_ADMIN_USERS_PAGE.loadError}</Alert>
          </div>
        ) : null}

        {!isLoading && !isError && filteredUsers.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-sm text-slate-500">
            {LABELS_ADMIN_USERS_PAGE.empty}
          </div>
        ) : null}

        {!isLoading && !isError && filteredUsers.length > 0 ? (
          <UsersTable
            users={filteredUsers}
            currentUserId={currentUser?.id}
            pendingToggleId={pendingToggleId}
            pendingResendId={pendingResendId}
            onEdit={setEditingUser}
            onToggleStatus={handleToggleStatus}
            onResendPassword={handleResendPassword}
          />
        ) : null}
      </div>

      <CreateUserModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      />
      <EditUserModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
      />
    </div>
  );
};

export default AdminUsersPage;
