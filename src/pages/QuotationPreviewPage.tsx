import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import {
  HiOutlineArrowLeft,
  HiOutlineEnvelope,
  HiOutlinePencilSquare,
  HiOutlineArrowDownTray,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
  HiOutlineXCircle,
} from "react-icons/hi2";
import { ConfirmQuotationStatusChangeModal } from "../shared/components/ui";
import { LABELS_QUOTATION_PREVIEW_PAGE, PATHS } from "../shared/data";
import DEFAULT_TERMS from "../shared/data/default-terms";
import {
  useCompany,
  useCompanyTerms,
  useSendQuotation,
  useUpdateQuotationStatus,
} from "../shared/hooks";
import { downloadQuotationPdf } from "../shared/services";
import { useQuotationDraftStore } from "../shared/store";
import type {
  ManualQuotationStatusTransition,
  QuotationStatus,
} from "../shared/types/quotation";
import { isQuotationExpired, QUOTATION_STATUS_BADGE_CLASSES } from "../shared/utils";

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
  const termsQuery = useCompanyTerms();
  const updateStatusMutation = useUpdateQuotationStatus();
  const sendMutation = useSendQuotation();
  const {
    draft,
    isReadOnlyPreview,
    previewStatus,
    savedQuotationId,
    setPreviewMode,
    setPreviewStatus,
    setReadOnlyPreview,
    resetDraft,
  } = useQuotationDraftStore();

  const [isPdfRequesting, setIsPdfRequesting] = useState(false);
  const [pdfAlert, setPdfAlert] = useState<
    { variant: "success" | "error"; message: string } | null
  >(null);
  const [statusAlert, setStatusAlert] = useState<
    { variant: "success" | "error" | "info"; message: string } | null
  >(null);
  const [pendingStatusChange, setPendingStatusChange] =
    useState<ManualQuotationStatusTransition | null>(null);

  useEffect(() => {
    if (pdfAlert?.variant !== "success") return;
    const timer = window.setTimeout(() => setPdfAlert(null), 6000);
    return () => window.clearTimeout(timer);
  }, [pdfAlert]);

  useEffect(() => {
    if (statusAlert?.variant !== "success") return;
    const timer = window.setTimeout(() => setStatusAlert(null), 6000);
    return () => window.clearTimeout(timer);
  }, [statusAlert]);

  const displayTerms = useMemo(() => {
    const terms = termsQuery.data?.terms;
    if (terms && terms.length > 0) {
      return terms;
    }
    return DEFAULT_TERMS;
  }, [termsQuery.data?.terms]);

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

  const statusBadgeClassMap = QUOTATION_STATUS_BADGE_CLASSES;

  const baseStatus = previewStatus ?? "draft";
  const isExpiredBySchedule = isQuotationExpired({
    status: baseStatus,
    validUntil: draft.validUntil,
  });
  const currentStatus: QuotationStatus = isExpiredBySchedule
    ? "expired"
    : baseStatus;
  const canChangeStatus =
    isReadOnlyPreview && currentStatus === "sent" && !!savedQuotationId;

  const requestStatusChange = (
    nextStatus: ManualQuotationStatusTransition,
  ) => {
    if (!savedQuotationId) return;
    setPendingStatusChange(nextStatus);
  };

  const confirmStatusChange = () => {
    if (!savedQuotationId || pendingStatusChange === null) return;

    const nextStatus = pendingStatusChange;
    setStatusAlert(null);
    updateStatusMutation.mutate(
      { quotationId: savedQuotationId, status: nextStatus },
      {
        onSuccess: (updated) => {
          setPendingStatusChange(null);
          setPreviewStatus(updated.status);
          setStatusAlert({
            variant: "success",
            message:
              nextStatus === "approved"
                ? LABELS_QUOTATION_PREVIEW_PAGE.statusUpdate.successApproved
                : LABELS_QUOTATION_PREVIEW_PAGE.statusUpdate.successRejected,
          });
        },
        onError: (error) => {
          setStatusAlert({
            variant: "error",
            message:
              error instanceof Error
                ? error.message
                : LABELS_QUOTATION_PREVIEW_PAGE.statusUpdate.errorGeneric,
          });
        },
      },
    );
  };

  const handleSendQuotation = () => {
    if (!savedQuotationId) {
      toast.error(LABELS_QUOTATION_PREVIEW_PAGE.sendFeedback.errorGeneric);
      return;
    }

    sendMutation.mutate(
      { quotationId: savedQuotationId },
      {
        onSuccess: () => {
          setPreviewStatus("sent");
          setReadOnlyPreview(true);
          toast.success(LABELS_QUOTATION_PREVIEW_PAGE.sendFeedback.success);
        },
        onError: (error) => {
          toast.error(
            error instanceof Error
              ? error.message
              : LABELS_QUOTATION_PREVIEW_PAGE.sendFeedback.errorGeneric,
          );
        },
      },
    );
  };

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
            className="flex items-center gap-1.5 text-sm font-semibold text-muted-foreground transition hover:text-foreground"
          >
            <HiOutlineArrowLeft className="text-base" />
            {LABELS_QUOTATION_PREVIEW_PAGE.topBar.backToList}
          </button>
          <span className="h-4 w-px bg-muted" />
          <span
            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide ${statusBadgeClassMap[currentStatus]}`}
          >
            {statusBadgeLabelMap[currentStatus]}
          </span>
          {isReadOnlyPreview ? (
            <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {LABELS_QUOTATION_PREVIEW_PAGE.topBar.readOnlyInfo}
            </span>
          ) : null}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {!isReadOnlyPreview ? (
            <button
              type="button"
              onClick={() => setPreviewMode(false)}
              className="flex items-center gap-2 rounded-xl border border-primary/30 bg-accent px-4 py-2.5 text-sm font-semibold text-accent-foreground transition hover:bg-accent"
            >
              <HiOutlinePencilSquare className="text-base" />
              {LABELS_QUOTATION_PREVIEW_PAGE.topBar.backToEdit}
            </button>
          ) : null}
          <button
            type="button"
            disabled={isPdfRequesting}
            onClick={handleDownloadPdf}
            className="flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70"
          >
            <HiOutlineArrowDownTray className="text-base" />
            {isPdfRequesting
              ? LABELS_QUOTATION_PREVIEW_PAGE.topBar.downloadPdfLoading
              : LABELS_QUOTATION_PREVIEW_PAGE.topBar.downloadPdf}
          </button>
          {!isReadOnlyPreview ? (
            <button
              type="button"
              disabled={sendMutation.isPending}
              onClick={handleSendQuotation}
              className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <HiOutlineEnvelope className="text-base" />
              {sendMutation.isPending
                ? LABELS_QUOTATION_PREVIEW_PAGE.topBar.sendingQuotation
                : LABELS_QUOTATION_PREVIEW_PAGE.topBar.sendQuotation}
            </button>
          ) : null}
          {canChangeStatus ? (
            <>
              <button
                type="button"
                disabled={updateStatusMutation.isPending}
                onClick={() => requestStatusChange("approved")}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <HiOutlineCheckCircle className="text-base" />
                {updateStatusMutation.isPending
                  ? LABELS_QUOTATION_PREVIEW_PAGE.topBar.updatingStatus
                  : LABELS_QUOTATION_PREVIEW_PAGE.topBar.approveQuotation}
              </button>
              <button
                type="button"
                disabled={updateStatusMutation.isPending}
                onClick={() => requestStatusChange("rejected")}
                className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-card px-4 py-2.5 text-sm font-semibold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <HiOutlineXCircle className="text-base" />
                {updateStatusMutation.isPending
                  ? LABELS_QUOTATION_PREVIEW_PAGE.topBar.updatingStatus
                  : LABELS_QUOTATION_PREVIEW_PAGE.topBar.rejectQuotation}
              </button>
            </>
          ) : null}
        </div>
      </div>

      {isReadOnlyPreview && isExpiredBySchedule && baseStatus === "sent" ? (
        <div
          role="status"
          className="flex items-start gap-2 rounded-xl border border-chart-4/40 bg-chart-4/15 px-4 py-3 text-sm text-chart-4"
        >
          <HiOutlineExclamationCircle className="mt-0.5 shrink-0 text-base" />
          <p>{LABELS_QUOTATION_PREVIEW_PAGE.statusUpdate.expiredInfo}</p>
        </div>
      ) : null}

      {statusAlert ? (
        <div
          role="status"
          className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
            statusAlert.variant === "success"
              ? "border-primary/30 bg-accent text-accent-foreground"
              : statusAlert.variant === "error"
                ? "border-destructive/40 bg-destructive/10 text-destructive"
                : "border-chart-4/40 bg-chart-4/15 text-chart-4"
          }`}
        >
          {statusAlert.variant === "success" ? (
            <HiOutlineCheckCircle className="mt-0.5 shrink-0 text-base" />
          ) : (
            <HiOutlineExclamationCircle className="mt-0.5 shrink-0 text-base" />
          )}
          <p>{statusAlert.message}</p>
        </div>
      ) : null}

      {pdfAlert ? (
        <div
          role="status"
          className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${
            pdfAlert.variant === "success"
              ? "border-primary/30 bg-accent text-accent-foreground"
              : "border-destructive/40 bg-destructive/10 text-destructive"
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

      <ConfirmQuotationStatusChangeModal
        isOpen={pendingStatusChange !== null}
        fromStatus={currentStatus}
        toStatus={pendingStatusChange ?? currentStatus}
        isConfirming={updateStatusMutation.isPending}
        onConfirm={confirmStatusChange}
        onCancel={() => {
          if (!updateStatusMutation.isPending) setPendingStatusChange(null);
        }}
      />

      {/* Document */}
      <div className="mx-auto max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
        {/* Emerald top bar */}
        <div className="h-2 bg-primary" />

        <div className="p-8 sm:p-12">
          {/* Company header */}
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-3">
              {company?.logoUrl ? (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border bg-card">
                  <img
                    src={company.logoUrl}
                    alt={LABELS_QUOTATION_PREVIEW_PAGE.company.logoAlt.replace(
                      "{name}",
                      companyIssuerName || company.name,
                    )}
                    className="h-full w-full object-contain"
                  />
                </div>
              ) : (
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary text-sm font-black text-secondary-foreground">
                  {companyQuery.isPending
                    ? "…"
                    : companyIssuerName
                      ? companyInitialsFromName(companyIssuerName)
                      : "—"}
                </div>
              )}
              <div>
                {companyQuery.isPending ? (
                  <div className="space-y-2" aria-busy="true">
                    <p className="text-xs text-muted-foreground">
                      {LABELS_QUOTATION_PREVIEW_PAGE.company.loading}
                    </p>
                    <div className="space-y-2 animate-pulse">
                      <div className="h-5 w-52 rounded bg-muted" />
                      <div className="h-3 w-40 rounded bg-muted" />
                      <div className="h-3 w-full max-w-xs rounded bg-muted" />
                      <div className="h-3 w-36 rounded bg-muted" />
                    </div>
                  </div>
                ) : companyQuery.isError ? (
                  <p className="text-sm text-destructive">
                    {LABELS_QUOTATION_PREVIEW_PAGE.company.loadError}
                  </p>
                ) : !company ? (
                  <p className="text-sm text-chart-4">
                    {LABELS_QUOTATION_PREVIEW_PAGE.company.notConfigured}
                  </p>
                ) : (
                  <>
                    <p className="text-lg font-bold text-foreground">
                      {company.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      RUT: {company.rut}
                    </p>
                    {company.address?.trim() ? (
                      <p className="text-xs text-muted-foreground">{company.address}</p>
                    ) : null}
                    {company.city?.trim() ? (
                      <p className="text-xs text-muted-foreground">{company.city}</p>
                    ) : null}
                    {company.contact?.trim() ? (
                      <p className="text-xs text-muted-foreground">{company.contact}</p>
                    ) : null}
                  </>
                )}
              </div>
            </div>

            <div className="text-left sm:text-right">
              <p className="text-3xl font-black uppercase tracking-tight text-foreground">
                {LABELS_QUOTATION_PREVIEW_PAGE.document.title}
              </p>
              <p className="mt-0.5 text-lg font-bold text-primary">
                {LABELS_QUOTATION_PREVIEW_PAGE.document.quoteNumber}
              </p>
              <p className="mt-2 text-xs text-muted-foreground">
                {LABELS_QUOTATION_PREVIEW_PAGE.document.emissionDate}:{" "}
                {formatDate(emissionDate)}
              </p>
              <p className="text-xs text-muted-foreground">
                {LABELS_QUOTATION_PREVIEW_PAGE.document.validUntil}:{" "}
                {formatDate(validDate)}
              </p>
            </div>
          </div>

          <hr className="my-8 border-border" />

          {/* Client + Project summary */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {LABELS_QUOTATION_PREVIEW_PAGE.summary.client}
              </p>
              <p className="text-lg font-bold text-foreground">
                {draft.clientName}
              </p>
              {draft.clientRut && (
                <p className="mt-0.5 text-sm text-muted-foreground">
                  RUT: {draft.clientRut}
                </p>
              )}
              {draft.clientEmail && (
                <p className="text-sm text-muted-foreground">{draft.clientEmail}</p>
              )}
            </div>
            <div>
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {LABELS_QUOTATION_PREVIEW_PAGE.summary.projectSummary}
              </p>
              <p className="text-sm italic text-foreground">
                {draft.projectNotes || draft.projectTitle}
              </p>
            </div>
          </div>

          <hr className="my-8 border-border" />

          {/* Items table */}
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs font-bold uppercase tracking-wider text-muted-foreground">
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
            <tbody className="divide-y divide-border">
              {draft.items.map((item, index) => (
                <tr key={index}>
                  <td className="py-4 pr-4 text-sm text-foreground">
                    {item.description}
                  </td>
                  <td className="py-4 text-center text-sm text-foreground">
                    {item.quantity}
                  </td>
                  <td className="py-4 text-right text-sm text-foreground">
                    {formatCLP(item.unitPrice)}
                  </td>
                  <td className="py-4 text-right text-sm font-semibold text-foreground">
                    {formatCLP(item.unitPrice * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="mt-6 flex justify-end">
            <div className="w-full max-w-xs space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  {LABELS_QUOTATION_PREVIEW_PAGE.summary.totals.subtotal}
                </span>
                <span>{formatCLP(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{LABELS_QUOTATION_PREVIEW_PAGE.summary.totals.iva}</span>
                <span>{formatCLP(iva)}</span>
              </div>
              <div className="border-t border-border pt-2">
                <div className="flex justify-between text-base font-black text-foreground">
                  <span>
                    {LABELS_QUOTATION_PREVIEW_PAGE.summary.totals.total}
                  </span>
                  <span>{formatCLP(total)}</span>
                </div>
              </div>
            </div>
          </div>

          <hr className="my-8 border-border" />

          {/* Terms */}
          <div>
            <p className="mb-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {LABELS_QUOTATION_PREVIEW_PAGE.terms.title}
            </p>
            <div className="grid gap-x-8 gap-y-1.5 sm:grid-cols-2">
              {displayTerms.map((term, index) => (
                <div key={`${index}-${term}`} className="flex items-start gap-2">
                  <span className="mt-1 block h-1.5 w-1.5 shrink-0 rounded-full bg-muted-foreground" />
                  <p className="text-xs text-muted-foreground">{term}</p>
                </div>
              ))}
            </div>
          </div>

          <hr className="my-8 border-border" />

          {/* Footer */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="mb-1 h-px w-48 bg-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                {LABELS_QUOTATION_PREVIEW_PAGE.footer.signature}
              </p>
            </div>
            <p className="text-xs italic text-muted-foreground">
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
