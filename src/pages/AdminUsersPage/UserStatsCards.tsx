import { HiUsers, HiShieldCheck, HiBriefcase, HiCheckCircle } from "react-icons/hi2";
import LABELS_ADMIN_USERS_PAGE from "../../shared/data/labels-admin-users-page";
import type { User } from "../../shared/types/auth";

type UserStatsCardsProps = {
  users: User[];
};

const UserStatsCards = ({ users }: UserStatsCardsProps) => {
  const admins = users.filter((u) => u.role === "admin").length;
  const business = users.filter((u) => u.role === "business").length;
  const commons = users.filter((u) => u.role === "common").length;
  const active = users.filter((u) => u.isActive).length;

  const cards = [
    {
      label: LABELS_ADMIN_USERS_PAGE.stats.total,
      value: users.length,
      hint: LABELS_ADMIN_USERS_PAGE.stats.activeSessionsHint,
      icon: HiUsers,
    },
    {
      label: LABELS_ADMIN_USERS_PAGE.stats.admins,
      value: admins,
      hint: LABELS_ADMIN_USERS_PAGE.stats.adminsHint,
      icon: HiShieldCheck,
    },
    {
      label: LABELS_ADMIN_USERS_PAGE.stats.business,
      value: business,
      hint: LABELS_ADMIN_USERS_PAGE.stats.businessHint,
      icon: HiBriefcase,
    },
    {
      label: LABELS_ADMIN_USERS_PAGE.stats.commons,
      value: commons,
      hint: LABELS_ADMIN_USERS_PAGE.stats.commonsHint,
      icon: HiCheckCircle,
      extra: `${active} ${LABELS_ADMIN_USERS_PAGE.stats.activeSessions.toLowerCase()}`,
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
            <card.icon className="text-xl" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {card.label}
          </p>
          <p className="mt-1 text-3xl font-black tracking-[-0.03em] text-foreground">
            {card.value}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {card.extra ?? card.hint}
          </p>
        </article>
      ))}
    </section>
  );
};

export default UserStatsCards;
