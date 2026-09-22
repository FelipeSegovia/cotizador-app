import { HiOutlineUserGroup, HiShieldCheck, HiUsers } from "react-icons/hi2";
import LABELS_ADMIN_USERS_PAGE from "../../shared/data/labels-admin-users-page";
import type { User } from "../../shared/types/auth";

type UserStatsCardsProps = {
  users: User[];
};

const UserStatsCards = ({ users }: UserStatsCardsProps) => {
  const total = users.length;
  const admins = users.filter((u) => u.role === "admin").length;
  const commons = users.filter((u) => u.role === "common").length;
  const activeCount = users.filter((u) => u.isActive).length;

  const cards = [
    {
      label: LABELS_ADMIN_USERS_PAGE.stats.total,
      value: String(total),
      hint: null,
      icon: HiOutlineUserGroup,
      iconBg: "bg-accent text-primary",
    },
    {
      label: LABELS_ADMIN_USERS_PAGE.stats.admins,
      value: String(admins),
      hint: LABELS_ADMIN_USERS_PAGE.stats.adminsHint,
      icon: HiShieldCheck,
      iconBg: "bg-muted text-foreground",
    },
    {
      label: LABELS_ADMIN_USERS_PAGE.stats.commons,
      value: String(commons),
      hint: LABELS_ADMIN_USERS_PAGE.stats.commonsHint,
      icon: HiUsers,
      iconBg: "bg-chart-3/10 text-chart-3",
    },
    {
      label: LABELS_ADMIN_USERS_PAGE.stats.activeSessions,
      value: String(activeCount),
      hint: LABELS_ADMIN_USERS_PAGE.stats.activeSessionsHint,
      icon: HiUsers,
      iconBg: "bg-accent text-primary",
      live: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-foreground">
                {card.value}
              </p>
              {card.hint ? (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-muted-foreground">
                  {card.live ? (
                    <span className="inline-block h-2 w-2 rounded-full bg-primary" />
                  ) : null}
                  {card.hint}
                </p>
              ) : null}
            </div>
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconBg}`}
            >
              <card.icon className="text-lg" />
            </div>
          </div>
        </article>
      ))}
    </div>
  );
};

export default UserStatsCards;
