import type { UserRole } from "../../types/auth";
import LABELS_ADMIN_USERS_PAGE from "../../data/labels-admin-users-page";

type RoleBadgeProps = {
  role: UserRole;
};

const ROLE_CLASSES: Record<UserRole, string> = {
  admin: "bg-slate-800 text-white",
  common: "bg-sky-100 text-sky-800",
};

const RoleBadge = ({ role }: RoleBadgeProps) => {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${ROLE_CLASSES[role]}`}
    >
      {LABELS_ADMIN_USERS_PAGE.roles[role]}
    </span>
  );
};

export default RoleBadge;
