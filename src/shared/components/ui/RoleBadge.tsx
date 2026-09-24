import type { UserRole } from "../../types/auth";
import LABELS_ADMIN_USERS_PAGE from "../../data/labels-admin-users-page";

type RoleBadgeProps = {
  role: UserRole;
};

const ROLE_CLASSES: Record<UserRole, string> = {
  admin: "bg-secondary text-secondary-foreground",
  business:
    "bg-primary/15 text-primary dark:bg-primary/25 dark:text-primary-foreground",
  common:
    "bg-chart-3/15 text-chart-3 dark:bg-chart-2/20 dark:text-chart-2",
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
