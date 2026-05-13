import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  HiOutlineArrowLeft,
  HiOutlineEnvelope,
  HiOutlinePencilSquare,
  HiOutlineArrowDownTray,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";
import { LABELS_QUOTATION_PREVIEW_PAGE, PATHS } from "../shared/data";
import { useCompany } from "../shared/hooks";
import { downloadQuotationPdf } from "../shared/services";
import { useQuotationDraftStore } from "../shared/store";
import type { QuotationStatus } from "../shared/types/quotation";

const IVA_RATE = 0.19;

const companyInitialsFromName = (name: string) => {
  const trimmed = name.trim();
  if (!trimmed) return "—";
  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) {
    return `${parts[0]![0] ?? ""}${parts[1]![0] ?? ""}`.toUpperCase();
  }
  return trimmed.slice(0, 2).toUpperCase();
};

const TERMS = [
  "Forma de pago: 50% al aceptar cotización, 50% al término de implementación.",
  "Los precios están expresados en Pesos Chilenos (CLP).",
  "La validez de esta oferta es de 15 días corridos.",
  "El soporte premium incluido cubre incidencias de software nivel 1 y 2.",
  "Toda modificación adicional será facturada por separado previa aprobación.",
  "Se requiere firma de contrato de confidencialidad antes del inicio.",
];

const formatCLP = (value: number) =>
  `$${Math.round(value).toLocaleString("es-CL")}`;

const formatDate = (date: Date) =>
  date.toLocaleDateString("es-CL", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const QuotationPreviewPage = () => {
  const navigate = useNavigate();
  const companyQuery = useCompany();
  const {
    draft,
    isReadOnlyPreview,
    previewStatus,
    savedQuotationId,
    setPreviewMode,
    resetDraft,
  } = useQuotationDraftStore();

  const [isPdfRequesting, setIsPdfRequesting] = useState(false);
  const [pdfAlert, setPdfAlert] = useState<
    { variant: "success" | "error"; message: string } | null
  >(null);

  useEffect(() => {
    if (pdfAlert?.variant !== "success") return;
    const timer = window.setTimeout(() => setPdfAlert(null), 6000);
    return () => window.clearTimeout(timer);
  }, [pdfAlert]);

  if (draft === null) return null;

  const company = companyQuery.data;
  const companyIssuerName = company?.name?.trim() ?? "";

  const subtotal = draft.items.reduce(
    (sum, item) => sum + item.unitPrice * item.quantity,
    0,
  );
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;

  const emissionDate = new Date();
  const validDateSource = draft.validUntil?.trim() || draft.projectDeadline;
  const validDate = validDateSource
    ? new Date(
        validDateSource.includes("T")
          ? validDateSource
          : `${validDateSource}T00:00:00`,
      )
    : new Date(emissionDate.getTime() + 15 * 24 * 60 * 60 * 1000);

  const handleBackToList = () => {
    resetDraft();
    navigate(PATHS.QUOTATIONS);
  };

  const statusBadgeLabelMap: Record<QuotationStatus, string> = {
    draft: LABELS_QUOTATION_PREVIEW_PAGE.topBar.draftBadge,
    sent: LABELS_QUOTATION_PREVIEW_PAGE.topBar.sentBadge,
    approved: LABELS_QUOTATION_PREVIEW_PAGE.topBar.approvedBadge,
    rejected: LABELS_QUOTATION_PREVIEW_PAGE.topBar.rejectedBadge,
    expired: LABELS_QUOTATION_PREVIEW_PAGE.topBar.expiredBadge,
  };

  const statusBadgeClassMap: Record<QuotationStatus, string> = {
    draft: "bg-amber-100 text-amber-700",
    sent: "bg-blue-100 text-blue-700",
    approved: "bg-emerald-100 text-emerald-700",
    rejected: "bg-slate-100 text-slate-700",
    expired: "bg-amber-100 text-amber-900",
  };

  const currentStatus = previewStatus ?? "draft";

  const handleDownloadPdf = async () => {
    setPdfAlert(null);

    if (!savedQuotationId) {
      setPdfAlert({
        variant: "error",
        message: LABELS_QUOTATION_PREVIEW_PAGE.pdfFeedback.errorNoSavedId,
      });
      return;
    }

    setIsPdfRequesting(true);
    try {
      await downloadQuotationPdf(savedQuotationId);
      setPdfAlert({
        variant: "success",
        message: LABELS_QUOTATION_PREVIEW_PAGE.pdfFeedback.success,
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : LABELS_QUOTATION_PREVIEW_PAGE.pdfFeedback.errorGeneric;
      setPdfAlert({ variant: "error", message });
    } finally {
      setIsPdfRequesting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header bar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleBackToList}
            className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 transition hover:text-slate-900"
          >
            <HiOutlineArrowLeft className="text-base" />
            {LABELS_QUOTATION_PREVIEW_PAGE.topBar.backToList}
          </button>
          <span className="h-4 w-px bg-slate-300" />
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${statusBadgeClassMap[currentStatus]}`}
          >
            {statusBadgeLabelMap[currentStatus]}
          </span>
          {isReadOnlyPreview ? (
            <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-slate-600">
              {LABELS_QUOTATION_PREVIEW_PAGE.topBar.readOnlyInfo}
            </span>
          ) : null}
        </div>

        <div className="flex items-center gap-2">
          {!isReadOnlyPreview ? (
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className="flex items-center gap-2 rounded-xl border border-emerald-300 bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-800 transition hover:bg-emerald-100"
            >
              <HiOutlinePencilSquare className="text-base" />
              {LABELS_QUOTATION_PREVIEW_PAGE.topBar.backToEdit}
            </button>
          ) : null}
          <button
            type="button"
            disabled={isPdfRequesting}
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <HiOutlineArrowDownTray className="text-base" />
            {isPdfRequesting
              ? LABELS_QUOTATION_PREVIEW_PAGE.topBar.downloadPdfLoading
              : LABELS_QUOTATION_PREVIEW_PAGE.topBar.downloadPdf}
          </button>
          {!isReadOnlyPreview ? (
            <button
              type="button"
              className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              <HiOutlineEnvelope className="text-base" />
              {LABELS_QUOTATION_PREVIEW_PAGE.topBar.sendQuotation}
            </button>
          ) : null}
        </div>
      </div>

      {pdfAlert ? (
        <div
          role="status"
          className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
            pdfAlert.variant === "success"
              ? "border-emerald-200 bg-emerald-50 text-emerald-900"
              : "border-rose-200 bg-rose-50 text-rose-900"
          }`}
        >
          {pdfAlert.variant === "success" ? (
            <HiOutlineCheckCircle className="mt-0.5 shrink-0 text-base" />
          ) : (
            <HiOutlineExclamationCircle className="mt-0.5 shrink-0 text-base" />
          )}
          <p>{pdfAlert.message}</p>
        </div>
      ) : null}

      {/* Document */}
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Emerald top bar */}
        <div className="h-2 bg-emerald-600" />

        <div className="p-8 sm:p-12">
          {/* Company header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-800 text-sm font-black text-white">
                {companyQuery.isPending
                  ? "…"
                  : companyIssuerName
                    ? companyInitialsFromName(companyIssuerName)
                    : "—"}
              </div>
              <div>
                {companyQuery.isPending ? (
                  <div className="space-y-2" aria-busy="true">
                    <p className="text-xs text-slate-500">
                      {LABELS_QUOTATION_PREVIEW_PAGE.company.loading}
                    </p>
                    <div className="space-y-2 animate-pulse">
                      <div className="h-5 w-52 rounded bg-slate-200" />
                      <div className="h-3 w-40 rounded bg-slate-200" />
                      <div className="h-3 w-full max-w-xs rounded bg-slate-200" />
                      <div className="h-3 w-36 rounded bg-slate-200" />
                    </div>
                  </div>
                ) : companyQuery.isError ? (
                  <p className="text-sm text-red-600">
                    {LABELS_QUOTATION_PREVIEW_PAGE.company.loadError}
                  </p>
                ) : !company ? (
                  <p className="text-sm text-amber-800">
                    {LABELS_QUOTATION_PREVIEW_PAGE.company.notConfigured}
                  </p>
                ) : (
                  <>
                    <p className="text-lg font-bold text-slate-900">
                      {company.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      RUT: {company.rut}
                    </p>
                    {company.address?.trim() ? (
                      <p className="text-xs text-slate-500">{company.address}</p>
                    ) : null}
                    {company.city?.trim() ? (
                      <p className="text-xs text-slate-500">{company.city}</p>
                    ) : null}
                    {company.contact?.trim() ? (
                      <p className="text-xs text-slate-500">{company.contact}</p>
                    ) : null}
                  </>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-3xl font-black uppercase tracking-tight text-slate-900">
                {LABELS_QUOTATION_PREVIEW_PAGE.document.title}
              </p>
              <p className="mt-0.5 text-lg font-bold text-emerald-600">
                {LABELS_QUOTATION_PREVIEW_PAGE.document.quoteNumber}
              </p>
              <p className="mt-2 text-xs text-slate-500">
                {LABELS_QUOTATION_PREVIEW_PAGE.document.emissionDate}:{" "}
                {formatDate(emissionDate)}
              </p>
              <p className="text-xs text-slate-500">
                {LABELS_QUOTATION_PREVIEW_PAGE.document.validUntil}:{" "}
                {formatDate(validDate)}
              </p>
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Client + Project summary */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                {LABELS_QUOTATION_PREVIEW_PAGE.summary.client}
              </p>
              <p className="text-lg font-bold text-slate-900">
                {draft.clientName}
              </p>
              {draft.clientRut && (
                <p className="mt-0.5 text-sm text-slate-600">
                  RUT: {draft.clientRut}
                </p>
              )}
              {draft.clientEmail && (
                <p className="text-sm text-slate-600">{draft.clientEmail}</p>
              )}
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                {LABELS_QUOTATION_PREVIEW_PAGE.summary.projectSummary}
              </p>
              <p className="text-sm italic text-slate-700">
                {draft.projectNotes || draft.projectTitle}
              </p>
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Items table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
                <th className="pb-3">
                  {
                    LABELS_QUOTATION_PREVIEW_PAGE.summary.tableHeaders
                      .description
                  }
                </th>
                <th className="pb-3 text-center">
                  {LABELS_QUOTATION_PREVIEW_PAGE.summary.tableHeaders.quantity}
                </th>
                <th className="pb-3 text-right">
                  {LABELS_QUOTATION_PREVIEW_PAGE.summary.tableHeaders.unitPrice}
                </th>
                <th className="pb-3 text-right">
                  {LABELS_QUOTATION_PREVIEW_PAGE.summary.tableHeaders.total}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {draft.items.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 pr-4 text-sm text-slate-700">
                    {item.description}
                  </td>
                  <td className="py-4 text-center text-sm text-slate-700">
                    {item.quantity}
                  </td>
                  <td className="py-4 text-right text-sm text-slate-700">
                    {formatCLP(item.unitPrice)}
                  </td>
                  <td className="py-4 text-right text-sm font-semibold text-slate-900">
                    {formatCLP(item.unitPrice * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm text-slate-600">
                <span>
                  {LABELS_QUOTATION_PREVIEW_PAGE.summary.totals.subtotal}
                </span>
                <span>{formatCLP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>{LABELS_QUOTATION_PREVIEW_PAGE.summary.totals.iva}</span>
                <span>{formatCLP(iva)}</span>
              </div>
              <div className="border-t border-slate-300 pt-2">
                <div className="flex justify-between text-base font-black text-slate-900">
                  <span>
                    {LABELS_QUOTATION_PREVIEW_PAGE.summary.totals.total}
                  </span>
                  <span>{formatCLP(total)}</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Terms */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-500">
              {LABELS_QUOTATION_PREVIEW_PAGE.terms.title}
            </p>
            <div className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
              {TERMS.map((term) => (
                <div key={term} className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
                  <p className="text-xs text-slate-600">{term}</p>
                </div>
              ))}
            </div>
          </div>

          <hr className="my-8 border-slate-200" />

          {/* Footer */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-1 h-px w-48 bg-slate-400" />
              <p className="text-xs text-slate-500">
                {LABELS_QUOTATION_PREVIEW_PAGE.footer.signature}
              </p>
            </div>
            <p className="text-xs italic text-slate-400">
              {companyIssuerName
                ? `${LABELS_QUOTATION_PREVIEW_PAGE.footer.generatedBy} ${companyIssuerName}`
                : LABELS_QUOTATION_PREVIEW_PAGE.footer.generatedByWithoutCompany}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuotationPreviewPage;
