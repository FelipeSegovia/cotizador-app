import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
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
import { useSendQuotation } from "../shared/hooks";
import { createQuotation, updateQuotation } from "../shared/services";
import { formatRutAsYouType, stripRutForApi } from "../shared/utils";
import { useQuotationDraftStore } from "../shared/store";
import type {
  CreateQuotationDto,
  Quotation,
  QuotationFormData,
} from "../shared/types/quotation";

const IVA_RATE = 0.19;

const DEFAULT_QUOTATION_FORM_VALUES: QuotationFormData = {
  clientName: "",
  clientRut: "",
  clientEmail: "",
  projectTitle: "",
  projectDeadline: "",
  projectNotes: "",
  validUntil: "",
  items: [{ description: "", unitPrice: 0, quantity: 1 }],
};

const formatCLP = (value: number) =>
  `$${Math.round(value).toLocaleString("es-CL")}`;

const toDateInputString = (d: Date) => {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
};

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
  const sendMutation = useSendQuotation();
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<QuotationFormData>({
    defaultValues: DEFAULT_QUOTATION_FORM_VALUES,
  });

  const initialDraft = useRef(draft);

  useEffect(() => {
    if (initialDraft.current !== null) {
      reset(initialDraft.current);
    }
  }, [reset]);

  useEffect(() => {
    if (draft === null && savedQuotationId === null) {
      reset(DEFAULT_QUOTATION_FORM_VALUES);
    }
  }, [draft, savedQuotationId, reset]);

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const watchedItems = useWatch({ control, name: "items" }) ?? [];
  const minProjectDeadline = toDateInputString(new Date());

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
      clientRut: stripRutForApi(data.clientRut),
      clientEmail: data.clientEmail,
      projectTitle: data.projectTitle,
      projectDeadline: data.projectDeadline,
      projectNotes: data.projectNotes,
      validUntil: data.validUntil?.trim() || undefined,
      items,
      status: "draft",
    };
  };

  const saveDraft = async (data: QuotationFormData): Promise<Quotation> => {
    const payload = buildQuotationPayload(data);
    return savedQuotationId
      ? updateQuotation(savedQuotationId, payload)
      : createQuotation(payload);
  };

  const onSubmit = async (data: QuotationFormData) => {
    setSaveError(null);
    setIsSaving(true);

    try {
      const savedQuotation = await saveDraft(data);

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

  const handleSendToClient = handleSubmit(async (data) => {
    setSaveError(null);
    setIsSaving(true);

    try {
      const savedQuotation = await saveDraft(data);
      const quotationId = savedQuotation.id;

      setDraft(data);
      setSavedQuotationId(quotationId);

      await sendMutation.mutateAsync({ quotationId });

      setReadOnlyPreview(true);
      setPreviewStatus("sent");
      setPreviewMode(true);
      toast.success(LABELS_QUOTATION_PAGE.feedback.sendSuccess);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : LABELS_QUOTATION_PAGE.feedback.sendError,
      );
    } finally {
      setIsSaving(false);
    }
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <nav className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <span>{LABELS_QUOTATION_PAGE.breadcrumb.list}</span>
            <span>/</span>
            <span className="font-medium text-foreground">
              {LABELS_QUOTATION_PAGE.breadcrumb.createNew}
            </span>
          </nav>
          <h1 className="mt-0.5 text-2xl font-bold text-foreground">
            {LABELS_QUOTATION_PAGE.title}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-xl border border-border bg-card px-4 py-2.5 text-sm font-semibold text-foreground transition hover:bg-muted"
          >
            {LABELS_QUOTATION_PAGE.actions.discardDraft}
          </button>
          <button
            type="button"
            disabled={isSaving}
            onClick={handleSubmit(onSubmit)}
            className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <HiOutlineEye className="text-base" />
            {isSaving
              ? LABELS_QUOTATION_PAGE.actions.savingAndPreview
              : LABELS_QUOTATION_PAGE.actions.saveAndPreview}
          </button>
        </div>
      </div>

      {saveError ? (
        <p className="text-sm font-medium text-destructive">{saveError}</p>
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
                <Controller
                  control={control}
                  name="clientRut"
                  rules={{
                    required:
                      LABELS_QUOTATION_PAGE.clientSection.fields.clientRut
                        .required,
                  }}
                  render={({ field, fieldState }) => (
                    <FormField
                      id="clientRut"
                      label={
                        LABELS_QUOTATION_PAGE.clientSection.fields.clientRut
                          .label
                      }
                      placeholder={
                        LABELS_QUOTATION_PAGE.clientSection.fields.clientRut
                          .placeholder
                      }
                      value={field.value ?? ""}
                      registration={{
                        name: field.name,
                        onBlur: field.onBlur,
                        ref: field.ref,
                        onChange: (e: ChangeEvent<HTMLInputElement>) => {
                          field.onChange(
                            formatRutAsYouType(e.target.value),
                          );
                        },
                      }}
                      error={fieldState.error?.message}
                    />
                  )}
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
                  min={minProjectDeadline}
                  registration={register("projectDeadline", {
                    validate: (value) => {
                      if (!value || String(value).trim() === "") {
                        return true;
                      }
                      return (
                        value >= minProjectDeadline ||
                        LABELS_QUOTATION_PAGE.projectSection.fields
                          .projectDeadline.invalidPast
                      );
                    },
                  })}
                  error={errors.projectDeadline?.message}
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
                className="flex items-center gap-1.5 text-sm font-semibold text-primary transition hover:text-primary"
              >
                <HiPlusCircle className="text-base" />
                {LABELS_QUOTATION_PAGE.itemsSection.addItem}
              </button>
            }
          >
            <div className="overflow-x-auto">
              <table className="w-full min-w-130">
                <thead>
                  <tr className="border-b border-border text-left text-sm font-semibold text-muted-foreground">
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
                <tbody className="divide-y divide-border">
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
                            className="w-full rounded-lg border border-border bg-muted px-3 py-2 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:bg-card focus:ring-1 focus:ring-ring/30"
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
                            className="w-28 rounded-lg border border-border bg-muted px-3 py-2 text-right text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:bg-card focus:ring-1 focus:ring-ring/30"
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
                            className="w-20 rounded-lg border border-border bg-muted px-3 py-2 text-right text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:bg-card focus:ring-1 focus:ring-ring/30"
                            {...register(`items.${index}.quantity`, {
                              valueAsNumber: true,
                            })}
                          />
                        </td>
                        <td className="py-3 pr-4 text-right text-sm font-bold text-foreground">
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
                            className="text-muted-foreground transition hover:text-destructive disabled:pointer-events-none disabled:opacity-30"
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
          <div className="rounded-2xl border border-border bg-card p-6 text-card-foreground">
            <h3 className="mb-5 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              <HiOutlineDocumentText className="text-base" />
              {LABELS_QUOTATION_PAGE.summary.title}
            </h3>

            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {LABELS_QUOTATION_PAGE.summary.subtotal}
                </span>
                <span className="font-medium text-foreground">
                  {formatCLP(subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  {LABELS_QUOTATION_PAGE.summary.iva}
                </span>
                <span className="font-medium text-foreground">{formatCLP(iva)}</span>
              </div>
              <div className="my-3 border-t border-border" />
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-foreground">
                  {LABELS_QUOTATION_PAGE.summary.total}
                </span>
                <span className="text-lg font-bold text-primary">
                  {formatCLP(total)}
                </span>
              </div>
              <p className="text-right text-xs text-muted-foreground">
                {LABELS_QUOTATION_PAGE.summary.currency}
              </p>
            </div>

            {/* Status */}
            <div className="mt-6 rounded-xl bg-muted p-4">
              <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {LABELS_QUOTATION_PAGE.summary.status}
              </p>
              <div className="h-1.5 w-full overflow-hidden rounded-full bg-border">
                <div className="h-full w-2/3 rounded-full bg-primary" />
              </div>
              <p className="mt-2 text-xs italic text-muted-foreground">
                {`"${LABELS_QUOTATION_PAGE.summary.statusMessage}"`}
              </p>
            </div>

            {/* Actions */}
            <div className="mt-6 space-y-3">
              <button
                type="button"
                disabled={isSaving}
                onClick={handleSubmit(onSubmit)}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <HiOutlineEye className="text-base" />
                {isSaving
                  ? LABELS_QUOTATION_PAGE.actions.savingAndPreview
                  : LABELS_QUOTATION_PAGE.actions.saveAndPreview}
              </button>
              <button
                type="button"
                disabled={isSaving || sendMutation.isPending}
                onClick={handleSendToClient}
                className="flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-card py-3 text-sm font-semibold text-foreground transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-70"
              >
                <MdOutlineEmail className="text-base" />
                {isSaving || sendMutation.isPending
                  ? LABELS_QUOTATION_PAGE.actions.sendingToClient
                  : LABELS_QUOTATION_PAGE.actions.sendToClient}
              </button>
            </div>
          </div>

          {/* Quick Help */}
          <div className="rounded-2xl border border-border bg-muted p-5">
            <h3 className="mb-3 text-sm font-semibold text-foreground">
              {LABELS_QUOTATION_PAGE.quickHelp.title}
            </h3>
            <ul className="space-y-2">
              {LABELS_QUOTATION_PAGE.quickHelp.tips.map((tip) => (
                <li
                  key={tip}
                  className="flex items-start gap-2 text-xs text-muted-foreground"
                >
                  <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
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
