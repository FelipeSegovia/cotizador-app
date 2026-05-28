import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { LABELS_FEEDBACK_MODAL } from "../../data";
import { useCreateFeedback } from "../../hooks";
import type { CreateFeedbackDto, FeedbackCategory } from "../../types/feedback";
import FormField from "../forms/FormField";
import FormTextareaField from "../forms/FormTextareaField";
import Modal from "./Modal";

type FeedbackFormValues = CreateFeedbackDto;

const CATEGORY_ENTRIES = Object.entries(
  LABELS_FEEDBACK_MODAL.categoryOptions,
) as [FeedbackCategory, string][];

type FeedbackModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

const FeedbackModal = ({ isOpen, onClose }: FeedbackModalProps) => {
  const createFeedback = useCreateFeedback();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FeedbackFormValues>({
    defaultValues: {
      title: "",
      category: "idea",
      description: "",
    },
  });

  useEffect(() => {
    if (!isOpen) {
      reset({
        title: "",
        category: "idea",
        description: "",
      });
    }
  }, [isOpen, reset]);

  const onSubmit = (data: FeedbackFormValues) => {
    createFeedback.mutate(data, {
      onSuccess: () => {
        toast.success(LABELS_FEEDBACK_MODAL.toast.success);
        reset();
        onClose();
      },
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={LABELS_FEEDBACK_MODAL.title}
      subtitle={LABELS_FEEDBACK_MODAL.subtitle}
      maxWidthClass="max-w-lg"
    >
      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <FormField
          id="feedback-title"
          label={LABELS_FEEDBACK_MODAL.fields.title}
          placeholder={LABELS_FEEDBACK_MODAL.fields.titlePlaceholder}
          registration={register("title", {
            required: LABELS_FEEDBACK_MODAL.validation.titleRequired,
            minLength: {
              value: 3,
              message: LABELS_FEEDBACK_MODAL.validation.titleMinLength,
            },
          })}
          error={errors.title?.message}
        />

        <div className="space-y-2">
          <label
            className="block text-sm font-semibold text-slate-700"
            htmlFor="feedback-category"
          >
            {LABELS_FEEDBACK_MODAL.fields.category}
          </label>
          <select
            id="feedback-category"
            className="w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
            {...register("category", {
              required: LABELS_FEEDBACK_MODAL.validation.categoryRequired,
            })}
          >
            {CATEGORY_ENTRIES.map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          {errors.category?.message ? (
            <p className="text-xs font-medium text-red-600">
              {errors.category.message}
            </p>
          ) : null}
        </div>

        <FormTextareaField
          id="feedback-description"
          label={LABELS_FEEDBACK_MODAL.fields.description}
          placeholder={LABELS_FEEDBACK_MODAL.fields.descriptionPlaceholder}
          rows={4}
          registration={register("description", {
            required: LABELS_FEEDBACK_MODAL.validation.descriptionRequired,
            minLength: {
              value: 10,
              message: LABELS_FEEDBACK_MODAL.validation.descriptionMinLength,
            },
          })}
          error={errors.description?.message}
        />

        {createFeedback.isError ? (
          <p className="text-sm text-rose-600">
            {(createFeedback.error as Error).message ||
              LABELS_FEEDBACK_MODAL.errors.submit}
          </p>
        ) : null}

        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-800"
          >
            {LABELS_FEEDBACK_MODAL.actions.cancel}
          </button>
          <button
            type="submit"
            disabled={createFeedback.isPending}
            className="rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:opacity-60"
          >
            {createFeedback.isPending
              ? LABELS_FEEDBACK_MODAL.actions.submitting
              : LABELS_FEEDBACK_MODAL.actions.submit}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackModal;
