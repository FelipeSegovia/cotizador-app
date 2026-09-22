import {
  HiCheckCircle,
  HiClipboardDocumentList,
  HiOutlineDocumentPlus,
  HiUsers,
} from "react-icons/hi2";
import { LABELS_ROOT_PAGE, PATHS } from "../shared/data";
import { useQuotations } from "../shared/hooks";
import { useQuotationDraftStore } from "../shared/store";
import type { QuotationStatus } from "../shared/types/quotation";
import { QUOTATION_STATUS_BADGE_CLASSES } from "../shared/utils";
import { Link, useNavigate } from "react-router";

const currencyFormatter = new Intl.NumberFormat("es-CL", {
  style: "currency",
  currency: "CLP",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("es-CL", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

const statusLabelMap: Record<QuotationStatus, string> = {
  approved: LABELS_ROOT_PAGE.statusLabels.approved,
  draft: LABELS_ROOT_PAGE.statusLabels.draft,
  rejected: LABELS_ROOT_PAGE.statusLabels.rejected,
  sent: LABELS_ROOT_PAGE.statusLabels.sent,
  expired: LABELS_ROOT_PAGE.statusLabels.expired,
};

const statusClassMap = QUOTATION_STATUS_BADGE_CLASSES;

const RootPage = () => {
  const { data: quotations = [], isError, isLoading, error } = useQuotations();
  const navigate = useNavigate();
  const resetDraft = useQuotationDraftStore((state) => state.resetDraft);

  const totalQuoted = quotations
    .filter((quotation) => quotation.status === "approved")
    .reduce((sum, quotation) => sum + quotation.total, 0);
  const pendingQuotes = quotations.filter(
    (quotation) => quotation.status === "draft" || quotation.status === "sent",
  ).length;
  const acceptedQuotes = quotations.filter(
    (quotation) => quotation.status === "approved",
  ).length;
  const conversionRate =
    quotations.length === 0
      ? 0
      : Math.round((acceptedQuotes / quotations.length) * 100);
  const recentQuotations = [...quotations]
    .sort(
      (first, second) =>
        new Date(second.updatedAt).getTime() -
        new Date(first.updatedAt).getTime(),
    )
    .slice(0, 5);

  const hasData = recentQuotations.length > 0;

  const handleCreateQuotation = () => {
    resetDraft();
    navigate(PATHS.NEW_QUOTATION);
  };

  return (
    <>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="text-3xl font-extrabold tracking-[-0.03em] text-foreground">
            {LABELS_ROOT_PAGE.title}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {LABELS_ROOT_PAGE.welcome}
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
          onClick={handleCreateQuotation}
        >
          <HiOutlineDocumentPlus className="text-base" />
          {LABELS_ROOT_PAGE.newQuotationButton}
        </button>
      </div>

      <section className="mt-7 grid gap-4 lg:grid-cols-3">
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary">
            <HiClipboardDocumentList className="text-xl" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {LABELS_ROOT_PAGE.metrics.totalQuoted}
          </p>
          <p className="mt-1 text-4xl font-black tracking-[-0.03em] text-foreground">
            {currencyFormatter.format(totalQuoted)}
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-3/10 text-chart-3">
            <HiUsers className="text-xl" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {LABELS_ROOT_PAGE.metrics.pendingQuotes}
          </p>
          <p className="mt-1 text-4xl font-black tracking-[-0.03em] text-foreground">
            {pendingQuotes}
          </p>
        </article>

        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-chart-5/15 text-chart-5">
            <HiCheckCircle className="text-xl" />
          </div>
          <p className="mt-4 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
            {LABELS_ROOT_PAGE.metrics.acceptedQuotes}
          </p>
          <p className="mt-1 text-4xl font-black tracking-[-0.03em] text-foreground">
            {acceptedQuotes}
          </p>
        </article>
      </section>

      <section className="mt-6 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <h3 className="text-3xl font-bold tracking-[-0.03em] text-foreground">
              {LABELS_ROOT_PAGE.recentQuotations.title}
            </h3>
            <Link
              to={PATHS.QUOTATIONS}
              className="text-sm font-semibold text-primary transition hover:text-primary/80"
            >
              {LABELS_ROOT_PAGE.recentQuotations.viewAll}
            </Link>
          </div>

          <div className="mt-5 overflow-x-auto">
            {isLoading ? (
              <p className="text-sm text-muted-foreground">
                {LABELS_ROOT_PAGE.recentQuotations.loading}
              </p>
            ) : null}

            {isError ? (
              <p className="text-sm text-destructive">
                {(error as Error).message ||
                  LABELS_ROOT_PAGE.recentQuotations.loadError}
              </p>
            ) : null}

            {!isLoading && !isError && hasData ? (
              <table className="min-w-full border-separate border-spacing-y-3 text-sm">
                <thead className="text-left text-xs uppercase tracking-[0.07em] text-muted-foreground">
                  <tr>
                    <th className="pb-1 pr-3">
                      {LABELS_ROOT_PAGE.recentQuotations.headers.client}
                    </th>
                    <th className="pb-1 pr-3">
                      {LABELS_ROOT_PAGE.recentQuotations.headers.date}
                    </th>
                    <th className="pb-1 pr-3">
                      {LABELS_ROOT_PAGE.recentQuotations.headers.amount}
                    </th>
                    <th className="pb-1 pr-3">
                      {LABELS_ROOT_PAGE.recentQuotations.headers.status}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentQuotations.map((quotation) => (
                    <tr
                      key={quotation.id}
                      className="rounded-xl bg-muted text-foreground"
                    >
                      <td className="rounded-l-xl px-3 py-2.5 font-medium">
                        {quotation.clientName}
                      </td>
                      <td className="px-3 py-2.5">
                        {dateFormatter.format(new Date(quotation.updatedAt))}
                      </td>
                      <td className="px-3 py-2.5">
                        {currencyFormatter.format(quotation.total)}
                      </td>
                      <td className="rounded-r-xl px-3 py-2.5">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassMap[quotation.status]}`}
                        >
                          {statusLabelMap[quotation.status]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : null}

            {!isLoading && !isError && !hasData ? (
              <p className="text-sm text-muted-foreground">
                {LABELS_ROOT_PAGE.recentQuotations.empty}
              </p>
            ) : null}
          </div>
        </article>

        <div className="space-y-4">
          <article className="rounded-2xl border border-border bg-card p-5 text-card-foreground shadow-sm">
            <p className="text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
              {LABELS_ROOT_PAGE.conversionCard.title}
            </p>
            <p className="mt-2 text-5xl font-black tracking-[-0.03em] text-foreground">
              {conversionRate}%
            </p>
            <p className="mt-2 text-sm font-medium text-primary">
              {LABELS_ROOT_PAGE.conversionCard.subtitle}
            </p>
            <div className="mt-4 h-2 rounded-full bg-muted">
              <div
                className="h-2 rounded-full bg-primary"
                style={{ width: `${conversionRate}%` }}
              />
            </div>
          </article>
          {/*
          <article className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <h4 className="text-lg font-bold text-foreground">
              {LABELS_ROOT_PAGE.activity.title}
            </h4>
            <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
              <li>Cotizacion #4592 aceptada</li>
              <li>Nueva cotizacion enviada a CCU</li>
              <li>Borrador creado para Walmart Chile</li>
            </ul>
          </article>
          */}
        </div>
      </section>
    </>
  );
};

export default RootPage;
