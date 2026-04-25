export type QuotationStatus = "draft" | "sent" | "approved" | "rejected";

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
  clientRut: string;
  clientEmail: string;
  projectTitle: string;
  projectDeadline: string;
  projectNotes: string;
  items: QuotationItem[];
  total: number;
  status: QuotationStatus;
  createdAt: string;
  updatedAt: string;
}

export type CreateQuotationDto = Omit<
  Quotation,
  "id" | "total" | "createdAt" | "updatedAt"
>;
export type UpdateQuotationDto = Partial<CreateQuotationDto>;
