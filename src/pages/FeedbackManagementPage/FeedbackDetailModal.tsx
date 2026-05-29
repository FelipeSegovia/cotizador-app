import { useEffect, useState } from "react";
import { toast } from "sonner";
import Modal from "../../shared/components/ui/Modal";
import { LABELS_FEEDBACK_MANAGEMENT_PAGE } from "../../shared/data";
import { useUpdateFeedback } from "../../shared/hooks";
import type { Feedback, FeedbackPriority } from "../../shared/types/feedback";
import {
  categoryClassMap,
  formatRelativeDate,
  getAuthorDisplayName,
  priorityDotClassMap,
} from "./feedback-utils";

type FeedbackDetailModalProps = {
  feedback: Feedback | null;
  onClose: () => void;
};

const FeedbackDetailModal = ({
  feedback,
  onClose,
}: FeedbackDetailModalProps) => {
  const updateFeedback = useUpdateFeedback();
  const [priority, setPriority] = useState<FeedbackPriority>("medium");

  useEffect(() => {
    if (feedback) {
      setPriority(feedback.priority);
    }
  }, [feedback]);

  if (!feedback) {
    return null;
  }

  const authorName = getAuthorDisplayName(feedback);

  const handleSave = () => {
    updateFeedback.mutate(
      {
        id: feedback.id,
        payload: { priority },
      },
      {
        onSuccess: () => {
          toast.success(LABELS_FEEDBACK_MANAGEMENT_PAGE.detailModal.success);
          onClose();
        },
        onError: (error) => {
          toast.error(
            (error as Error).message ||
              LABELS_FEEDBACK_MANAGEMENT_PAGE.detailModal.error,
          );
        },
      },
    );
  };

  const hasChanges = priority !== feedback.priority;

  return (
    <Modal
      isOpen={Boolean(feedback)}
      onClose={onClose}
      title={LABELS_FEEDBACK_MANAGEMENT_PAGE.detailModal.title}
      subtitle={feedback.title}
      maxWidthClass="max-w-2xl"
    >
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {LABELS_FEEDBACK_MANAGEMENT_PAGE.detailModal.author}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-800">
              {authorName}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {LABELS_FEEDBACK_MANAGEMENT_PAGE.detailModal.email}
            </p>
            <p className="mt-1 text-sm text-slate-700">{feedback.userEmail}</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {LABELS_FEEDBACK_MANAGEMENT_PAGE.detailModal.date}
            </p>
            <p className="mt-1 text-sm text-slate-700">
              {formatRelativeDate(feedback.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              {LABELS_FEEDBACK_MANAGEMENT_PAGE.detailModal.category}
            </p>
            <span
              className={`mt-1 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${categoryClassMap[feedback.category]}`}
            >
              {LABELS_FEEDBACK_MANAGEMENT_PAGE.category[feedback.category]}
            </span>
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            {LABELS_FEEDBACK_MANAGEMENT_PAGE.detailModal.description}
          </p>
          <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">
            {feedback.description}
          </p>
        </div>

        <label className="flex max-w-xs flex-col gap-1.5">
          <span className="text-sm font-semibold text-slate-700">
            {LABELS_FEEDBACK_MANAGEMENT_PAGE.detailModal.priority}
          </span>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value as FeedbackPriority)}
            className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-700 outline-none focus:border-emerald-300"
          >
            {(Object.keys(
              LABELS_FEEDBACK_MANAGEMENT_PAGE.priority,
            ) as FeedbackPriority[]).map((p) => (
              <option key={p} value={p}>
                {LABELS_FEEDBACK_MANAGEMENT_PAGE.priority[p]}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-2">
          <span
            className={`h-2 w-2 rounded-full ${priorityDotClassMap[priority]}`}
          />
          <span className="text-sm text-slate-600">
            {LABELS_FEEDBACK_MANAGEMENT_PAGE.priority[priority]}
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100"
          >
            {LABELS_FEEDBACK_MANAGEMENT_PAGE.detailModal.close}
          </button>
          <button
            type="button"
            disabled={updateFeedback.isPending || !hasChanges}
            onClick={handleSave}
            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {updateFeedback.isPending
              ? LABELS_FEEDBACK_MANAGEMENT_PAGE.detailModal.saving
              : LABELS_FEEDBACK_MANAGEMENT_PAGE.detailModal.save}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default FeedbackDetailModal;
