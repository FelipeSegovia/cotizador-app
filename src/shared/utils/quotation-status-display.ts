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
  draft: "bg-slate-100 text-slate-600",
  sent: "bg-blue-50 text-blue-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-600",
  expired: "bg-amber-50 text-amber-800",
};

/** Pills del modal: fondo/texto alineados al badge + punto más oscuro del mismo tono. */
export const QUOTATION_STATUS_MODAL_PILL: Record<
  QuotationStatus,
  { container: string; dot: string }
> = {
  draft: {
    container: QUOTATION_STATUS_BADGE_CLASSES.draft,
    dot: "bg-slate-500",
  },
  sent: {
    container: QUOTATION_STATUS_BADGE_CLASSES.sent,
    dot: "bg-blue-600",
  },
  approved: {
    container: QUOTATION_STATUS_BADGE_CLASSES.approved,
    dot: "bg-emerald-600",
  },
  rejected: {
    container: QUOTATION_STATUS_BADGE_CLASSES.rejected,
    dot: "bg-red-600",
  },
  expired: {
    container: QUOTATION_STATUS_BADGE_CLASSES.expired,
    dot: "bg-amber-600",
  },
};
