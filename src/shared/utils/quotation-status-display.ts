import type { QuotationStatus } from "../types/quotation";

export const QUOTATION_STATUS_LABELS: Record<QuotationStatus, string> = {
  draft: "Borrador",
  sent: "Enviada",
  approved: "Aprobada",
  rejected: "Rechazada",
  expired: "Expirado",
};

/** Mismos colores que los badges de estado en listado y tablas. */
export const QUOTATION_STATUS_BADGE_CLASSES: Record<QuotationStatus, string> = {
  draft: "bg-muted text-muted-foreground",
  sent: "bg-chart-3/15 text-chart-3 dark:bg-chart-2/20 dark:text-chart-2",
  approved: "bg-accent text-accent-foreground dark:bg-primary/20 dark:text-primary-foreground",
  rejected: "bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive-foreground",
  expired: "bg-chart-4/15 text-chart-4",
};

/** Pills del modal: fondo/texto alineados al badge + punto más oscuro del mismo tono. */
export const QUOTATION_STATUS_MODAL_PILL: Record<
  QuotationStatus,
  { container: string; dot: string }
> = {
  draft: {
    container: QUOTATION_STATUS_BADGE_CLASSES.draft,
    dot: "bg-muted-foreground",
  },
  sent: {
    container: QUOTATION_STATUS_BADGE_CLASSES.sent,
    dot: "bg-chart-3 dark:bg-chart-2",
  },
  approved: {
    container: QUOTATION_STATUS_BADGE_CLASSES.approved,
    dot: "bg-primary",
  },
  rejected: {
    container: QUOTATION_STATUS_BADGE_CLASSES.rejected,
    dot: "bg-destructive",
  },
  expired: {
    container: QUOTATION_STATUS_BADGE_CLASSES.expired,
    dot: "bg-chart-4",
  },
};
