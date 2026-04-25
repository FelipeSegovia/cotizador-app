import { http, HttpResponse } from "msw";
import type {
  Quotation,
  CreateQuotationDto,
  UpdateQuotationDto,
} from "../../shared/types/quotation";
import { mockQuotations } from "../data/quotations";

const db: Quotation[] = [...mockQuotations];

export const quotationHandlers = [
  // GET /api/quotations
  http.get("/api/quotations", () => {
    return HttpResponse.json(db);
  }),

  // GET /api/quotations/:id
  http.get("/api/quotations/:id", ({ params }) => {
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
  http.post("/api/quotations", async ({ request }) => {
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
  http.put("/api/quotations/:id", async ({ params, request }) => {
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
  http.delete("/api/quotations/:id", ({ params }) => {
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
