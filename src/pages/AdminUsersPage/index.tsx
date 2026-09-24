import { useMemo, useState } from "react";
import { HiMagnifyingGlass, HiPlus } from "react-icons/hi2";
import { toast } from "sonner";
import { Alert } from "../../shared/components/ui";
import LABELS_ADMIN_USERS_PAGE from "../../shared/data/labels-admin-users-page";
import { useCompany } from "../../shared/hooks/useCompany";
import { useCompanies } from "../../shared/hooks/useCompanies";
import {
  useInvitations,
  useRevokeInvitation,
} from "../../shared/hooks/useInvitations";
import { useUsers } from "../../shared/hooks/useUsers";
import { useToggleUserStatus } from "../../shared/hooks/useUserMutations";
import useAuthStore from "../../shared/store/useAuthStore";
import type { Invitation, User } from "../../shared/types/auth";
import EditUserModal from "./EditUserModal";
import InviteUserModal from "./InviteUserModal";
import InvitationsTable from "./InvitationsTable";
import UserStatsCards from "./UserStatsCards";
import UsersTable from "./UsersTable";

type TabId = "users" | "invitations";

const AdminUsersPage = () => {
  const currentUser = useAuthStore((s) => s.user);
  const actorRole = currentUser?.role === "admin" ? "admin" : "business";
  const isAdmin = actorRole === "admin";

  const [companyFilter, setCompanyFilter] = useState("");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<TabId>("users");
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [pendingToggleId, setPendingToggleId] = useState<string | null>(null);
  const [pendingRevokeId, setPendingRevokeId] = useState<string | null>(null);

  const companyQuery = useCompany();
  const companiesQuery = useCompanies();
  const filterCompanyId = isAdmin && companyFilter ? companyFilter : undefined;

  const { data: users = [], isLoading, isError, error } = useUsers(filterCompanyId);
  const {
    data: invitations = [],
    isLoading: invitationsLoading,
    isError: invitationsError,
  } = useInvitations(filterCompanyId);
  const toggleStatus = useToggleUserStatus();
  const revokeInvitation = useRevokeInvitation();

  const companyBlocking =
    !isAdmin &&
    !companyQuery.isPending &&
    (companyQuery.isError || !companyQuery.data);

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
      onError: (err) => {
        toast.error((err as Error).message);
      },
      onSettled: () => {
        setPendingToggleId(null);
      },
    });
  };

  const handleRevoke = (invitation: Invitation) => {
    setPendingRevokeId(invitation.id);
    revokeInvitation.mutate(invitation.id, {
      onSuccess: () => {
        toast.success(LABELS_ADMIN_USERS_PAGE.invitations.revokeSuccess);
      },
      onError: (err) => {
        toast.error((err as Error).message);
      },
      onSettled: () => {
        setPendingRevokeId(null);
      },
    });
  };

  const handleOpenInvite = () => {
    if (companyBlocking) {
      toast.error(LABELS_ADMIN_USERS_PAGE.companyRequired);
      return;
    }
    setIsInviteOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            {LABELS_ADMIN_USERS_PAGE.title}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {LABELS_ADMIN_USERS_PAGE.subtitle}
          </p>
        </div>
        <button
          type="button"
          onClick={handleOpenInvite}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
        >
          <HiPlus className="text-base" />
          {LABELS_ADMIN_USERS_PAGE.newUserButton}
        </button>
      </div>

      {companyBlocking ? (
        <Alert variant="error">{LABELS_ADMIN_USERS_PAGE.companyRequired}</Alert>
      ) : null}

      {isAdmin ? (
        <div className="max-w-xs">
          <label
            htmlFor="companyFilter"
            className="mb-1 block text-sm font-semibold text-foreground"
          >
            {LABELS_ADMIN_USERS_PAGE.companyFilter.label}
          </label>
          <select
            id="companyFilter"
            value={companyFilter}
            onChange={(e) => setCompanyFilter(e.target.value)}
            className="w-full rounded-xl border border-border bg-card px-3 py-2.5 text-sm text-foreground outline-none focus:border-ring"
          >
            <option value="">
              {LABELS_ADMIN_USERS_PAGE.companyFilter.all}
            </option>
            {(companiesQuery.data ?? []).map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>
      ) : null}

      {!isLoading && !isError && users.length > 0 ? (
        <UserStatsCards users={users} />
      ) : null}

      <div className="rounded-2xl border border-border bg-card shadow-sm">
        <div className="flex flex-col gap-3 border-b border-border px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setTab("users")}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                tab === "users"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {LABELS_ADMIN_USERS_PAGE.tabs.users}
            </button>
            <button
              type="button"
              onClick={() => setTab("invitations")}
              className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition ${
                tab === "invitations"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              {LABELS_ADMIN_USERS_PAGE.tabs.invitations}
            </button>
          </div>
          {tab === "users" ? (
            <label className="relative w-full max-w-xs">
              <HiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                type="search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={LABELS_ADMIN_USERS_PAGE.searchPlaceholder}
                className="w-full rounded-xl border border-border bg-muted py-2 pl-10 pr-4 text-sm text-foreground outline-none transition focus:border-ring focus:bg-card"
              />
            </label>
          ) : null}
        </div>

        {tab === "users" ? (
          <>
            {isLoading ? (
              <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
                {LABELS_ADMIN_USERS_PAGE.loading}
              </div>
            ) : null}

            {isError ? (
              <div className="p-6">
                <Alert variant="error">
                  {(error as Error)?.message ||
                    LABELS_ADMIN_USERS_PAGE.loadError}
                </Alert>
              </div>
            ) : null}

            {!isLoading && !isError && filteredUsers.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
                {LABELS_ADMIN_USERS_PAGE.empty}
              </div>
            ) : null}

            {!isLoading && !isError && filteredUsers.length > 0 ? (
              <UsersTable
                users={filteredUsers}
                currentUserId={currentUser?.id}
                pendingToggleId={pendingToggleId}
                onEdit={setEditingUser}
                onToggleStatus={handleToggleStatus}
              />
            ) : null}
          </>
        ) : (
          <>
            {invitationsLoading ? (
              <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
                {LABELS_ADMIN_USERS_PAGE.invitations.loading}
              </div>
            ) : null}

            {invitationsError ? (
              <div className="p-6">
                <Alert variant="error">
                  {LABELS_ADMIN_USERS_PAGE.invitations.loadError}
                </Alert>
              </div>
            ) : null}

            {!invitationsLoading &&
            !invitationsError &&
            invitations.length === 0 ? (
              <div className="flex items-center justify-center py-20 text-sm text-muted-foreground">
                {LABELS_ADMIN_USERS_PAGE.invitations.empty}
              </div>
            ) : null}

            {!invitationsLoading &&
            !invitationsError &&
            invitations.length > 0 ? (
              <InvitationsTable
                invitations={invitations}
                pendingRevokeId={pendingRevokeId}
                onRevoke={handleRevoke}
              />
            ) : null}
          </>
        )}
      </div>

      <InviteUserModal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        actorRole={actorRole}
        companies={companiesQuery.data ?? []}
      />
      <EditUserModal
        user={editingUser}
        onClose={() => setEditingUser(null)}
        actorRole={actorRole}
      />
    </div>
  );
};

export default AdminUsersPage;
