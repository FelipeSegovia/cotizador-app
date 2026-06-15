import { useEffect, useState } from "react";
import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { useSortable } from "@dnd-kit/react/sortable";
import { move } from "@dnd-kit/helpers";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HiBars3, HiDocumentText, HiTrash } from "react-icons/hi2";
import DEFAULT_TERMS from "../../data/default-terms";
import { LABELS_SETTINGS_PAGE } from "../../data";
import { useCompanyTerms } from "../../hooks";
import { saveCompanyTerms } from "../../services";
import { SectionCard } from "../ui";

type TermItem = {
  id: string;
  text: string;
};

const createTermItem = (text: string): TermItem => ({
  id: crypto.randomUUID(),
  text,
});

const mapTermsToItems = (terms: string[]): TermItem[] =>
  terms.map((text) => createTermItem(text));

type SortableTermRowProps = {
  item: TermItem;
  index: number;
  placeholder: string;
  dragHandleLabel: string;
  removeLabel: string;
  showError: boolean;
  errorMessage: string;
  onChange: (text: string) => void;
  onRemove: () => void;
};

const SortableTermRow = ({
  item,
  index,
  placeholder,
  dragHandleLabel,
  removeLabel,
  showError,
  errorMessage,
  onChange,
  onRemove,
}: SortableTermRowProps) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: item.id,
    index,
  });

  return (
    <li
      ref={ref}
      className={`flex flex-col gap-2 rounded-xl border border-slate-200 bg-slate-50/60 p-3 sm:flex-row sm:items-start ${
        isDragging ? "opacity-60 shadow-md ring-2 ring-emerald-200" : ""
      }`}
    >
      <button
        ref={handleRef}
        type="button"
        title={dragHandleLabel}
        aria-label={dragHandleLabel}
        className="mt-1 inline-flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-500 transition hover:bg-slate-50 active:cursor-grabbing"
      >
        <HiBars3 className="h-4 w-4" aria-hidden />
      </button>
      <span className="mt-2.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-200 text-xs font-semibold text-slate-600">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <input
          type="text"
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          placeholder={placeholder}
          value={item.text}
          onChange={(event) => onChange(event.target.value)}
        />
        {showError ? (
          <p className="mt-1 text-xs font-medium text-rose-600">
            {errorMessage}
          </p>
        ) : null}
      </div>
      <div className="flex shrink-0 items-center sm:mt-1">
        <button
          type="button"
          onClick={onRemove}
          title={removeLabel}
          aria-label={removeLabel}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-rose-200 bg-white text-rose-600 transition hover:bg-rose-50"
        >
          <HiTrash className="h-4 w-4" />
        </button>
      </div>
    </li>
  );
};

const TermsSettingsForm = () => {
  const queryClient = useQueryClient();
  const termsQuery = useCompanyTerms();
  const [items, setItems] = useState<TermItem[]>(() =>
    mapTermsToItems(DEFAULT_TERMS),
  );
  const [showErrors, setShowErrors] = useState(false);

  useEffect(() => {
    if (termsQuery.isPending) {
      return;
    }

    const terms = termsQuery.data?.terms;
    if (terms && terms.length > 0) {
      setItems(mapTermsToItems(terms));
    } else {
      setItems(mapTermsToItems(DEFAULT_TERMS));
    }
  }, [termsQuery.isPending, termsQuery.data]);

  const saveMutation = useMutation({
    mutationFn: saveCompanyTerms,
    onSuccess: (saved) => {
      queryClient.setQueryData(["company-terms"], saved);
      setItems(mapTermsToItems(saved.terms));
      setShowErrors(false);
      toast.success(LABELS_SETTINGS_PAGE.termsCard.saveSuccess);
    },
  });

  const handleChange = (id: string, text: string) => {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, text } : item)),
    );
  };

  const handleRemove = (id: string) => {
    setItems((current) => current.filter((item) => item.id !== id));
  };

  const handleAppend = () => {
    setItems((current) => [...current, createTermItem("")]);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    if (event.canceled) {
      return;
    }

    setItems((current) => move(current, event));
  };

  const handleSave = () => {
    const hasEmpty = items.some((item) => item.text.trim().length === 0);
    if (hasEmpty || items.length === 0) {
      setShowErrors(true);
      return;
    }

    const terms = items.map((item) => item.text.trim());
    setShowErrors(false);
    saveMutation.mutate({ terms });
  };

  return (
    <SectionCard
      title={LABELS_SETTINGS_PAGE.termsCard.title}
      icon={HiDocumentText}
    >
      <p className="mb-4 text-sm text-slate-500">
        {LABELS_SETTINGS_PAGE.termsCard.description}
      </p>

      {termsQuery.isPending ? (
        <p className="text-sm text-slate-500">
          {LABELS_SETTINGS_PAGE.loadingTerms}
        </p>
      ) : null}

      {termsQuery.isError ? (
        <p className="mb-4 text-sm text-rose-600">
          {LABELS_SETTINGS_PAGE.termsCard.loadError}
        </p>
      ) : null}

      {!termsQuery.isPending ? (
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-slate-500">
              {LABELS_SETTINGS_PAGE.termsCard.emptyList}
            </p>
          ) : (
            <DragDropProvider onDragEnd={handleDragEnd}>
              <ul className="space-y-3">
                {items.map((item, index) => (
                  <SortableTermRow
                    key={item.id}
                    item={item}
                    index={index}
                    placeholder={
                      LABELS_SETTINGS_PAGE.termsCard.fields.term.placeholder
                    }
                    dragHandleLabel={LABELS_SETTINGS_PAGE.termsCard.dragHandle}
                    removeLabel={LABELS_SETTINGS_PAGE.termsCard.remove}
                    showError={
                      showErrors && item.text.trim().length === 0
                    }
                    errorMessage={
                      LABELS_SETTINGS_PAGE.termsCard.fields.term.required
                    }
                    onChange={(text) => handleChange(item.id, text)}
                    onRemove={() => handleRemove(item.id)}
                  />
                ))}
              </ul>
            </DragDropProvider>
          )}

          <button
            type="button"
            onClick={handleAppend}
            className="inline-flex items-center justify-center rounded-lg border border-dashed border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-emerald-400 hover:text-emerald-700"
          >
            {LABELS_SETTINGS_PAGE.termsCard.addButton}
          </button>

          <p className="text-xs italic text-slate-500">
            {LABELS_SETTINGS_PAGE.termsCard.footerNote}
          </p>

          {showErrors && items.length === 0 ? (
            <p className="text-sm font-medium text-rose-600">
              {LABELS_SETTINGS_PAGE.termsCard.validation.minOne}
            </p>
          ) : null}

          {saveMutation.isError ? (
            <p className="text-sm font-medium text-rose-600">
              {(saveMutation.error as Error).message}
            </p>
          ) : null}

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={handleSave}
              disabled={saveMutation.isPending || items.length === 0}
              className="inline-flex items-center justify-center rounded-xl bg-emerald-700 px-5 py-2.5 text-sm font-semibold text-white shadow-[0_10px_30px_rgba(5,150,105,0.35)] transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saveMutation.isPending
                ? LABELS_SETTINGS_PAGE.termsCard.saving
                : LABELS_SETTINGS_PAGE.termsCard.saveButton}
            </button>
          </div>
        </div>
      ) : null}
    </SectionCard>
  );
};

export default TermsSettingsForm;
