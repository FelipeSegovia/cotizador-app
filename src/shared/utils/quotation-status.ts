import type { Quotation, QuotationStatus } from "../types/quotation";

/**
 * Retorna `true` si la cotización está en estado `sent` y su fecha de
 * validez ya pasó respecto a `now` (por defecto el momento actual).
 *
 * Esta función no muta la cotización: el caller decide qué hacer
 * (derivar visualmente, llamar a la API para persistir, etc.).
 */
export const isQuotationExpired = (
  quotation: Pick<Quotation, "status" | "validUntil">,
  now: Date = new Date(),
): boolean => {
  if (quotation.status !== "sent") return false;
  if (!quotation.validUntil) return false;

  const validUntilDate = new Date(
    quotation.validUntil.includes("T")
      ? quotation.validUntil
      : `${quotation.validUntil}T23:59:59`,
  );

  if (Number.isNaN(validUntilDate.getTime())) return false;
  return validUntilDate.getTime() < now.getTime();
};

/**
 * Devuelve el estado "efectivo" de la cotización aplicando la regla de
 * expiración automática: una cotización `sent` con `validUntil` vencido
 * se considera `expired`.
 */
export const getEffectiveQuotationStatus = (
  quotation: Pick<Quotation, "status" | "validUntil">,
  now: Date = new Date(),
): QuotationStatus => {
  if (isQuotationExpired(quotation, now)) return "expired";
  return quotation.status;
};
