import { LABELS_CLIENTS_PAGE } from "../../shared/data";
import type { Client } from "../../shared/types/client";
import { CLIENT_STATUS_DOT_CLASSES } from "./client-utils";

type ClientStatsCardsProps = {
  clients: Client[];
};

const ClientStatsCards = ({ clients }: ClientStatsCardsProps) => {
  const total = clients.length;
  const notContacted = clients.filter((c) => c.status === "not_contacted").length;
  const approved = clients.filter((c) => c.status === "approved").length;
  const rejected = clients.filter((c) => c.status === "rejected").length;

  const cards = [
    {
      label: LABELS_CLIENTS_PAGE.stats.total,
      value: total,
      dotClass: "bg-foreground",
    },
    {
      label: LABELS_CLIENTS_PAGE.stats.notContacted,
      value: notContacted,
      dotClass: CLIENT_STATUS_DOT_CLASSES.not_contacted,
    },
    {
      label: LABELS_CLIENTS_PAGE.stats.approved,
      value: approved,
      dotClass: CLIENT_STATUS_DOT_CLASSES.approved,
    },
    {
      label: LABELS_CLIENTS_PAGE.stats.rejected,
      value: rejected,
      dotClass: CLIENT_STATUS_DOT_CLASSES.rejected,
    },
  ];

  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            <span className={`h-2 w-2 rounded-full ${card.dotClass}`} />
            {card.label}
          </p>
          <p className="mt-2 text-3xl font-bold text-foreground">{card.value}</p>
        </article>
      ))}
    </div>
  );
};

export default ClientStatsCards;
