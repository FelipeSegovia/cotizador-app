import { http, HttpResponse } from "msw";
import type {
  Quotation,
  CreateQuotationDto,
  UpdateQuotationDto,
} from "../../shared/types/quotation";
import { mockQuotations } from "../data/quotations";
import { mockApiPath } from "../mock-api-path";

const db: Quotation[] = [...mockQuotations];

export const quotationHandlers = [
  // GET /api/quotations
  http.get(mockApiPath("/api/quotations"), () => {
    return HttpResponse.json(db);
  }),

  // GET /api/quotations/:id/pdf
  http.get(mockApiPath("/api/quotations/:id/pdf"), ({ params }) => {
    const exists = db.some((q) => q.id === params.id);

    if (!exists) {
      return HttpResponse.json(
        { message: "Cotización no encontrada" },
        { status: 404 },
      );
    }

    const minimalPdf = new Uint8Array([
      0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x0a, 0x25, 0xe2, 0xe3, 0xcf,
      0xd3, 0x0a,
    ]);

    return new HttpResponse(minimalPdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="cotizacion-${params.id}.pdf"`,
      },
    });
  }),

  // GET /api/quotations/:id
  http.get(mockApiPath("/api/quotations/:id"), ({ params }) => {
    const quotation = db.find((q) => q.id === params.id);

    if (!quotation) {
      return HttpResponse.json(
        { message: "Cotización no encontrada" },
        { status: 404 },
      );
    }

    return HttpResponse.json(quotation);
  }),

  // POST /api/quotations
  http.post(mockApiPath("/api/quotations"), async ({ request }) => {
    const body = (await request.json()) as CreateQuotationDto;
    const total = body.items.reduce((sum, item) => sum + item.subtotal, 0);

    const newQuotation: Quotation = {
      ...body,
      id: String(Date.now()),
      total,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    db.push(newQuotation);

    return HttpResponse.json(newQuotation, { status: 201 });
  }),

  // PUT /api/quotations/:id
  http.put(mockApiPath("/api/quotations/:id"), async ({ params, request }) => {
    const index = db.findIndex((q) => q.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { message: "Cotización no encontrada" },
        { status: 404 },
      );
    }

    const body = (await request.json()) as UpdateQuotationDto;
    const items = body.items ?? db[index].items;
    const total = items.reduce((sum, item) => sum + item.subtotal, 0);

    db[index] = {
      ...db[index],
      ...body,
      total,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(db[index]);
  }),

  // DELETE /api/quotations/:id
  http.delete(mockApiPath("/api/quotations/:id"), ({ params }) => {
    const index = db.findIndex((q) => q.id === params.id);

    if (index === -1) {
      return HttpResponse.json(
        { message: "Cotización no encontrada" },
        { status: 404 },
      );
    }

    db.splice(index, 1);

    return new HttpResponse(null, { status: 204 });
  }),
];
