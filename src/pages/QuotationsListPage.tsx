import { useNavigate } from "react-router";
import {
  HiOutlineDocumentPlus,
  HiOutlineEye,
  HiOutlineDocumentText,
} from "react-icons/hi2";
import { useQuotations } from "../shared/hooks";
import type { QuotationStatus } from "../shared/types/quotation";

const STATUS_LABELS: Record<QuotationStatus, string> = {
  draft: "Borrador",
  sent: "Enviada",
  approved: "Aprobada",
  rejected: "Rechazada",
};

const STATUS_CLASSES: Record<QuotationStatus, string> = {
  draft: "bg-slate-100 text-slate-600",
  sent: "bg-blue-50 text-blue-700",
  approved: "bg-emerald-50 text-emerald-700",
  rejected: "bg-red-50 text-red-600",
};

const formatCLP = (value: number) =>
  `$${Math.round(value).toLocaleString("es-CL")}`;

const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const QuotationsListPage = () => {
  const navigate = useNavigate();
  const { data: quotations, isLoading, isError } = useQuotations();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Cotizaciones</h1>
          <p className="mt-0.5 text-sm text-slate-500">
            Gestiona y da seguimiento a tus cotizaciones
          </p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/dashboard/cotizaciones/nueva")}
          className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
        >
          <HiOutlineDocumentPlus className="text-base" />
          Nueva Cotización
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
        {isLoading && (
          <div className="flex items-center justify-center py-20 text-sm text-slate-500">
            Cargando cotizaciones...
          </div>
        )}

        {isError && (
          <div className="flex items-center justify-center py-20 text-sm text-red-500">
            Error al cargar las cotizaciones. Intenta de nuevo.
          </div>
        )}

        {!isLoading && !isError && quotations?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-4 py-20">
            <HiOutlineDocumentText className="text-5xl text-slate-300" />
            <p className="text-sm text-slate-500">No hay cotizaciones aún.</p>
            <button
              type="button"
              onClick={() => navigate("/dashboard/cotizaciones/nueva")}
              className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <HiOutlineDocumentPlus className="text-base" />
              Crear Primera Cotización
            </button>
          </div>
        )}

        {!isLoading && !isError && quotations && quotations.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full min-w-150">
              <thead>
                <tr className="border-b border-slate-200 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">
                  <th className="px-6 pb-3 pt-5">#</th>
                  <th className="px-4 pb-3 pt-5">Cliente</th>
                  <th className="px-4 pb-3 pt-5">Proyecto</th>
                  <th className="px-4 pb-3 pt-5">Estado</th>
                  <th className="px-4 pb-3 pt-5 text-right">Total</th>
                  <th className="px-4 pb-3 pt-5">Fecha</th>
                  <th className="px-6 pb-3 pt-5" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {quotations.map((q, index) => (
                  <tr key={q.id} className="group transition hover:bg-slate-50">
                    <td className="px-6 py-4 text-sm font-medium text-slate-400">
                      {String(index + 1).padStart(3, "0")}
                    </td>
                    <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                      {q.clientName}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {q.projectTitle}
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_CLASSES[q.status]}`}
                      >
                        {STATUS_LABELS[q.status]}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-right text-sm font-bold text-slate-800">
                      {formatCLP(q.total)}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500">
                      {formatDate(q.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        type="button"
                        className="flex items-center gap-1 text-xs font-semibold text-emerald-700 opacity-0 transition hover:text-emerald-800 group-hover:opacity-100"
                      >
                        <HiOutlineEye className="text-sm" />
                        Ver
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuotationsListPage;
