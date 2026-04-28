import { useEffect, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import {
  HiOutlineClipboardDocument,
  HiOutlineDocumentText,
  HiOutlineEye,
  HiOutlineTableCells,
  HiOutlineTrash,
  HiOutlineUser,
  HiPlusCircle,
} from "react-icons/hi2";
import { MdOutlineEmail } from "react-icons/md";
import { FormField, FormTextareaField } from "../shared/components/forms";
import { SectionCard } from "../shared/components/ui";
import { LABELS_QUOTATION_PAGE } from "../shared/data";
import { createQuotation, updateQuotation } from "../shared/services";
import { useQuotationDraftStore } from "../shared/store";
import type {
  CreateQuotationDto,
  QuotationFormData,
} from "../shared/types/quotation";

const IVA_RATE = 0.19;

const formatCLP = (value: number) =>
  `$${Math.round(value).toLocaleString("es-CL")}`;

const QuotationPage = () => {
  const {
    draft,
    savedQuotationId,
    setDraft,
    setPreviewMode,
    setPreviewStatus,
    setReadOnlyPreview,
    setSavedQuotationId,
  } = useQuotationDraftStore();
  const queryClient = useQueryClient();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuotationFormData>({
    defaultValues: {
      items: [{ description: "", unitPrice: 0, quantity: 1 }],
    },
  });

  const initialDraft = useRef(draft);

  useEffect(() => {
    if (initialDraft.current !== null) {
      reset(initialDraft.current);
    }
  }, [reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({ control, name: "items" }) ?? [];

  const subtotal = watchedItems.reduce(
    (sum, item) =>
      sum + (Number(item.unitPrice) || 0) * (Number(item.quantity) || 0),
    0,
  );
  const iva = subtotal * IVA_RATE;
  const total = subtotal + iva;

  const buildQuotationPayload = (
    data: QuotationFormData,
  ): CreateQuotationDto => {
    const items = data.items.map((item, index) => {
      const unitPrice = Number(item.unitPrice) || 0;
      const quantity = Number(item.quantity) || 0;

      return {
        id: `${Date.now()}-${index}`,
        description: item.description,
        unitPrice,
        quantity,
        subtotal: unitPrice * quantity,
      };
    });

    return {
      clientName: data.clientName,
      clientRut: data.clientRut,
      clientEmail: data.clientEmail,
      projectTitle: data.projectTitle,
      projectDeadline: data.projectDeadline,
      projectNotes: data.projectNotes,
      items,
      status: "draft",
    };
  };

  const onSubmit = async (data: QuotationFormData) => {
    setSaveError(null);
    setIsSaving(true);

    try {
      const payload = buildQuotationPayload(data);
      const savedQuotation = savedQuotationId
        ? await updateQuotation(savedQuotationId, payload)
        : await createQuotation(payload);

      setDraft(data);
      setSavedQuotationId(savedQuotation.id);
      setReadOnlyPreview(false);
      setPreviewStatus("draft");
      setPreviewMode(true);
      await queryClient.invalidateQueries({ queryKey: ["quotations"] });
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : LABELS_QUOTATION_PAGE.feedback.saveError,
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-sm text-slate-500">
            <span>{LABELS_QUOTATION_PAGE.breadcrumb.list}</span>
            <span>/</span>
            <span className="font-medium text-slate-700">
              {LABELS_QUOTATION_PAGE.breadcrumb.createNew}
            </span>
          </nav>
          <h1 className="mt-0.5 text-2xl font-bold text-slate-800">
            {LABELS_QUOTATION_PAGE.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            {LABELS_QUOTATION_PAGE.actions.discardDraft}
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 rounded-xl bg-emerald-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <HiOutlineEye className="text-base" />
            {isSaving
              ? LABELS_QUOTATION_PAGE.actions.savingAndPreview
              : LABELS_QUOTATION_PAGE.actions.saveAndPreview}
          </button>
        </div>
      </div>

      {saveError ? (
        <p className="text-sm font-medium text-rose-600">{saveError}</p>
      ) : null}

      {/* Content Grid */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
        {/* Form */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="min-w-0 flex-1 space-y-6"
        >
          {/* Client Information */}
          <SectionCard
            title={LABELS_QUOTATION_PAGE.clientSection.title}
            icon={HiOutlineUser}
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="clientName"
                  label={
                    LABELS_QUOTATION_PAGE.clientSection.fields.clientName.label
                  }
                  placeholder={
                    LABELS_QUOTATION_PAGE.clientSection.fields.clientName
                      .placeholder
                  }
                  registration={register("clientName", {
                    required:
                      LABELS_QUOTATION_PAGE.clientSection.fields.clientName
                        .required,
                  })}
                  error={errors.clientName?.message}
                />
                <FormField
                  id="clientRut"
                  label={
                    LABELS_QUOTATION_PAGE.clientSection.fields.clientRut.label
                  }
                  placeholder={
                    LABELS_QUOTATION_PAGE.clientSection.fields.clientRut
                      .placeholder
                  }
                  registration={register("clientRut", {
                    required:
                      LABELS_QUOTATION_PAGE.clientSection.fields.clientRut
                        .required,
                  })}
                  error={errors.clientRut?.message}
                />
              </div>
              <FormField
                id="clientEmail"
                label={
                  LABELS_QUOTATION_PAGE.clientSection.fields.clientEmail.label
                }
                type="email"
                placeholder={
                  LABELS_QUOTATION_PAGE.clientSection.fields.clientEmail
                    .placeholder
                }
                registration={register("clientEmail", {
                  required:
                    LABELS_QUOTATION_PAGE.clientSection.fields.clientEmail
                      .required,
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message:
                      LABELS_QUOTATION_PAGE.clientSection.fields.clientEmail
                        .invalid,
                  },
                })}
                error={errors.clientEmail?.message}
              />
            </div>
          </SectionCard>

          {/* Project Details */}
          <SectionCard
            title={LABELS_QUOTATION_PAGE.projectSection.title}
            icon={HiOutlineClipboardDocument}
          >
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  id="projectTitle"
                  label={
                    LABELS_QUOTATION_PAGE.projectSection.fields.projectTitle
                      .label
                  }
                  placeholder={
                    LABELS_QUOTATION_PAGE.projectSection.fields.projectTitle
                      .placeholder
                  }
                  registration={register("projectTitle", {
                    required:
                      LABELS_QUOTATION_PAGE.projectSection.fields.projectTitle
                        .required,
                  })}
                  error={errors.projectTitle?.message}
                />
                <FormField
                  id="projectDeadline"
                  label={
                    LABELS_QUOTATION_PAGE.projectSection.fields.projectDeadline
                      .label
                  }
                  type="date"
                  registration={register("projectDeadline")}
                />
              </div>
              <FormTextareaField
                id="projectNotes"
                label={
                  LABELS_QUOTATION_PAGE.projectSection.fields.projectNotes.label
                }
                rows={4}
                placeholder={
                  LABELS_QUOTATION_PAGE.projectSection.fields.projectNotes
                    .placeholder
                }
                registration={register("projectNotes")}
              />
            </div>
          </SectionCard>

          {/* Itemized List */}
          <SectionCard
            title={LABELS_QUOTATION_PAGE.itemsSection.title}
            icon={HiOutlineTableCells}
            action={
              <button
                type="button"
                onClick={() =>
                  append({ description: "", unitPrice: 0, quantity: 1 })
                }
                className="flex items-center gap-1.5 text-sm font-semibold text-emerald-700 transition hover:text-emerald-800"
              >
                <HiPlusCircle className="text-base" />
                {LABELS_QUOTATION_PAGE.itemsSection.addItem}
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-130">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-sm font-semibold text-slate-600">
                    <th className="pb-3 pr-4">
                      {LABELS_QUOTATION_PAGE.itemsSection.columns.description}
                    </th>
                    <th className="pb-3 pr-4 text-right">
                      {LABELS_QUOTATION_PAGE.itemsSection.columns.unitPrice}
                    </th>
                    <th className="pb-3 pr-4 text-right">
                      {LABELS_QUOTATION_PAGE.itemsSection.columns.quantity}
                    </th>
                    <th className="pb-3 pr-4 text-right">
                      {LABELS_QUOTATION_PAGE.itemsSection.columns.total}
                    </th>
                    <th className="w-10 pb-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {fields.map((field, index) => {
                    const unitPrice =
                      Number(watchedItems[index]?.unitPrice) || 0;
                    const quantity = Number(watchedItems[index]?.quantity) || 0;
                    const rowTotal = unitPrice * quantity;

                    return (
                      <tr key={field.id} className="group">
                        <td className="py-3 pr-4">
                          <input
                            type="text"
                            placeholder={
                              LABELS_QUOTATION_PAGE.itemsSection.placeholders
                                .description
                            }
                            className="w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-100"
                            {...register(`items.${index}.description`, {
                              required: true,
                            })}
                          />
                        </td>
                        <td className="py-3 pr-4">
                          <input
                            type="number"
                            min={0}
                            placeholder={
                              LABELS_QUOTATION_PAGE.itemsSection.placeholders
                                .unitPrice
                            }
                            className="w-28 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-100"
                            {...register(`items.${index}.unitPrice`, {
                              valueAsNumber: true,
                            })}
                          />
                        </td>
                        <td className="py-3 pr-4">
                          <input
                            type="number"
                            min={1}
                            placeholder={
                              LABELS_QUOTATION_PAGE.itemsSection.placeholders
                                .quantity
                            }
                            className="w-20 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-right text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-500 focus:bg-white focus:ring-1 focus:ring-emerald-100"
                            {...register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                          />
                        </td>
                        <td className="py-3 pr-4 text-right text-sm font-bold text-slate-800">
                          {formatCLP(rowTotal)}
                        </td>
                        <td className="py-3 text-right">
                          <button
                            type="button"
                            disabled={fields.length === 1}
                            onClick={() => remove(index)}
                            aria-label={
                              LABELS_QUOTATION_PAGE.itemsSection
                                .removeItemAriaLabel
                            }
                            className="text-slate-300 transition hover:text-red-500 disabled:pointer-events-none disabled:opacity-30"
                          >
                            <HiOutlineTrash className="text-lg" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </SectionCard>
        </form>

        {/* Sidebar */}
        <aside className="w-full space-y-4 lg:w-80 lg:shrink-0">
          {/* Quote Summary */}
          <div className="rounded-2xl bg-[#1c2b3a] p-6 text-white">
            <h3 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-slate-400">
              <HiOutlineDocumentText className="text-base" />
              {LABELS_QUOTATION_PAGE.summary.title}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {LABELS_QUOTATION_PAGE.summary.subtotal}
                </span>
                <span className="font-medium text-white">
                  {formatCLP(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-400">
                  {LABELS_QUOTATION_PAGE.summary.iva}
                </span>
                <span className="font-medium text-white">{formatCLP(iva)}</span>
              </div>
              <div className="my-3 border-t border-slate-600" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-white">
                  {LABELS_QUOTATION_PAGE.summary.total}
                </span>
                <span className="text-lg font-bold text-emerald-400">
                  {formatCLP(total)}
                </span>
              </div>
              <p className="text-right text-xs text-slate-500">
                {LABELS_QUOTATION_PAGE.summary.currency}
              </p>
            </div>

            {/* Status */}
            <div className="mt-6 rounded-xl bg-slate-700/50 p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                {LABELS_QUOTATION_PAGE.summary.status}
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-600">
                <div className="h-full w-2/3 rounded-full bg-emerald-500" />
              </div>
              <p className="mt-2 text-xs italic text-slate-400">
                {`"${LABELS_QUOTATION_PAGE.summary.statusMessage}"`}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSubmit(onSubmit)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-500 py-3 text-sm font-semibold text-white transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <HiOutlineEye className="text-base" />
                {isSaving
                  ? LABELS_QUOTATION_PAGE.actions.savingAndPreview
                  : LABELS_QUOTATION_PAGE.actions.saveAndPreview}
              </button>
              <button
                type="button"
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-500 bg-transparent py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-700"
              >
                <MdOutlineEmail className="text-base" />
                {LABELS_QUOTATION_PAGE.actions.sendToClient}
              </button>
            </div>
          </div>

          {/* Quick Help */}
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <h3 className="mb-3 text-sm font-semibold text-slate-700">
              {LABELS_QUOTATION_PAGE.quickHelp.title}
            </h3>
            <ul className="space-y-2">
              {LABELS_QUOTATION_PAGE.quickHelp.tips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 text-xs text-slate-600"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-bold text-white">
                    ✓
                  </span>
                  {tip}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default QuotationPage;
