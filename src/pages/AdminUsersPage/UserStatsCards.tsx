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
      iconBg: "bg-emerald-50 text-emerald-700",
    },
    {
      label: LABELS_ADMIN_USERS_PAGE.stats.admins,
      value: String(admins),
      hint: LABELS_ADMIN_USERS_PAGE.stats.adminsHint,
      icon: HiShieldCheck,
      iconBg: "bg-slate-100 text-slate-700",
    },
    {
      label: LABELS_ADMIN_USERS_PAGE.stats.commons,
      value: String(commons),
      hint: LABELS_ADMIN_USERS_PAGE.stats.commonsHint,
      icon: HiUsers,
      iconBg: "bg-sky-50 text-sky-700",
    },
    {
      label: LABELS_ADMIN_USERS_PAGE.stats.activeSessions,
      value: String(activeCount),
      hint: LABELS_ADMIN_USERS_PAGE.stats.activeSessionsHint,
      icon: HiUsers,
      iconBg: "bg-emerald-50 text-emerald-700",
      live: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
        >
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                {card.label}
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {card.value}
              </p>
              {card.hint ? (
                <p className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                  {card.live ? (
                    <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
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
