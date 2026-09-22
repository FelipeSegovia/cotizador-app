import { HiChatBubbleLeftRight } from "react-icons/hi2";
import { LABELS_FEEDBACK_MANAGEMENT_PAGE } from "../../shared/data";
import type { Feedback } from "../../shared/types/feedback";

type FeedbackStatsCardsProps = {
  feedbacks: Feedback[];
};

const FeedbackStatsCards = ({ feedbacks }: FeedbackStatsCardsProps) => {
  const total = feedbacks.length;
  const high = feedbacks.filter((f) => f.priority === "high").length;
  const medium = feedbacks.filter((f) => f.priority === "medium").length;
  const low = feedbacks.filter((f) => f.priority === "low").length;

  const cards = [
    {
      label: LABELS_FEEDBACK_MANAGEMENT_PAGE.stats.total,
      value: total.toLocaleString("es-CL"),
      iconClass: "bg-accent text-primary",
    },
    {
      label: LABELS_FEEDBACK_MANAGEMENT_PAGE.stats.high,
      value: high.toLocaleString("es-CL"),
      iconClass: "bg-destructive/10 text-destructive",
      badge: high > 0 ? "Acción Requerida" : undefined,
      badgeClass: "bg-destructive/15 text-destructive",
    },
    {
      label: LABELS_FEEDBACK_MANAGEMENT_PAGE.stats.medium,
      value: medium.toLocaleString("es-CL"),
      iconClass: "bg-chart-4/15 text-chart-4",
    },
    {
      label: LABELS_FEEDBACK_MANAGEMENT_PAGE.stats.low,
      value: low.toLocaleString("es-CL"),
      iconClass: "bg-chart-3/10 text-chart-3",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-border bg-card p-5 shadow-sm"
        >
          <div className="flex items-start justify-between gap-2">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${card.iconClass}`}
            >
              <HiChatBubbleLeftRight className="text-xl" />
            </div>
            {card.badge ? (
              <span
                className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${card.badgeClass}`}
              >
                {card.badge}
              </span>
            ) : null}
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {card.label}
          </p>
          <p className="mt-1 text-3xl font-black tracking-[-0.03em] text-foreground">
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
};

export default FeedbackStatsCards;
