export type QuotationStatus =
  | "draft"
  | "sent"
  | "approved"
  | "rejected"
  | "expired";

export interface QuotationItem {
  id: string;
  description: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Quotation {
  id: string;
  clientName: string;
  clientRut?: string;
  clientEmail?: string;
  projectTitle: string;
  projectDeadline?: string;
  projectNotes?: string;
  /** Fecha ISO hasta la cual la oferta es válida (validez comercial). */
  validUntil?: string;
  items: QuotationItem[];
  total: number;
  status: QuotationStatus;
  createdAt: string;
  updatedAt: string;
}

export type QuotationItemFormRow = {
  description: string;
  unitPrice: number;
  quantity: number;
};

export type QuotationFormData = {
  clientName: string;
  clientRut: string;
  clientEmail: string;
  projectTitle: string;
  projectDeadline: string;
  projectNotes: string;
  validUntil?: string;
  items: QuotationItemFormRow[];
};

export type CreateQuotationDto = Omit<
  Quotation,
  "id" | "total" | "createdAt" | "updatedAt"
>;
export type UpdateQuotationDto = Partial<CreateQuotationDto>;

/**
 * Estados a los que una cotización `sent` puede transicionar de forma manual.
 * La transición a `expired` se realiza automáticamente en el backend cuando
 * `validUntil` ya pasó.
 */
export type ManualQuotationStatusTransition = "approved" | "rejected";

export interface UpdateQuotationStatusDto {
  status: ManualQuotationStatusTransition;
}
