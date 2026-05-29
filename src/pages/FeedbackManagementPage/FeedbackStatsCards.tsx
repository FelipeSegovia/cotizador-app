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
      iconClass: "bg-emerald-50 text-emerald-700",
    },
    {
      label: LABELS_FEEDBACK_MANAGEMENT_PAGE.stats.high,
      value: high.toLocaleString("es-CL"),
      iconClass: "bg-rose-50 text-rose-600",
      badge: high > 0 ? "Acción Requerida" : undefined,
      badgeClass: "bg-rose-100 text-rose-700",
    },
    {
      label: LABELS_FEEDBACK_MANAGEMENT_PAGE.stats.medium,
      value: medium.toLocaleString("es-CL"),
      iconClass: "bg-amber-50 text-amber-600",
    },
    {
      label: LABELS_FEEDBACK_MANAGEMENT_PAGE.stats.low,
      value: low.toLocaleString("es-CL"),
      iconClass: "bg-sky-50 text-sky-700",
    },
  ];

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article
          key={card.label}
          className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
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
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
            {card.label}
          </p>
          <p className="mt-1 text-3xl font-black tracking-[-0.03em] text-slate-900">
            {card.value}
          </p>
        </article>
      ))}
    </section>
  );
};

export default FeedbackStatsCards;
