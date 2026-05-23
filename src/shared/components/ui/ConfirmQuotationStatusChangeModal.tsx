import { useEffect } from "react";
import { HiOutlineArrowRight, HiOutlineXMark } from "react-icons/hi2";
import LABELS_CONFIRM_QUOTATION_STATUS_MODAL from "../../data/labels-confirm-quotation-status-modal";
import type { QuotationStatus } from "../../types/quotation";
import {
  QUOTATION_STATUS_LABELS,
  QUOTATION_STATUS_MODAL_PILL,
} from "../../utils/quotation-status-display";

type ConfirmQuotationStatusChangeModalProps = {
  isOpen: boolean;
  fromStatus: QuotationStatus;
  toStatus: QuotationStatus;
  isConfirming?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

const StatusPill = ({ status }: { status: QuotationStatus }) => {
  const pill = QUOTATION_STATUS_MODAL_PILL[status];

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-semibold ${pill.container}`}
    >
      <span className={`h-2 w-2 shrink-0 rounded-full ${pill.dot}`} />
      {QUOTATION_STATUS_LABELS[status]}
    </span>
  );
};

const ConfirmQuotationStatusChangeModal = ({
  isOpen,
  fromStatus,
  toStatus,
  isConfirming = false,
  onConfirm,
  onCancel,
}: ConfirmQuotationStatusChangeModalProps) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isConfirming) onCancel();
    };

    document.addEventListener("keydown", handleKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen, isConfirming, onCancel]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      <button
        type="button"
        aria-label={LABELS_CONFIRM_QUOTATION_STATUS_MODAL.closeAriaLabel}
        disabled={isConfirming}
        onClick={onCancel}
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm disabled:cursor-not-allowed"
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-status-change-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-start justify-between gap-4">
          <h2
            id="confirm-status-change-title"
            className="text-lg font-bold text-slate-900"
          >
            {LABELS_CONFIRM_QUOTATION_STATUS_MODAL.title}
          </h2>
          <button
            type="button"
            disabled={isConfirming}
            onClick={onCancel}
            aria-label={LABELS_CONFIRM_QUOTATION_STATUS_MODAL.closeAriaLabel}
            className="rounded-lg p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <HiOutlineXMark className="text-xl" />
          </button>
        </div>

        <p className="text-sm leading-relaxed text-slate-600">
          {LABELS_CONFIRM_QUOTATION_STATUS_MODAL.description}
        </p>

        <div className="mt-5 rounded-xl bg-slate-50 px-4 py-5">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <StatusPill status={fromStatus} />
            <HiOutlineArrowRight
              className="shrink-0 text-lg text-slate-400"
              aria-hidden
            />
            <StatusPill status={toStatus} />
          </div>
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            disabled={isConfirming}
            onClick={onCancel}
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {LABELS_CONFIRM_QUOTATION_STATUS_MODAL.cancel}
          </button>
          <button
            type="button"
            disabled={isConfirming}
            onClick={onConfirm}
            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isConfirming
              ? LABELS_CONFIRM_QUOTATION_STATUS_MODAL.confirming
              : LABELS_CONFIRM_QUOTATION_STATUS_MODAL.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmQuotationStatusChangeModal;
