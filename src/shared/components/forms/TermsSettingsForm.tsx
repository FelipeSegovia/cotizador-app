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
  readOnly?: boolean;
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
  readOnly = false,
  onChange,
  onRemove,
}: SortableTermRowProps) => {
  const { ref, handleRef, isDragging } = useSortable({
    id: item.id,
    index,
    disabled: readOnly,
  });

  return (
    <li
      ref={ref}
      className={`flex flex-col gap-2 rounded-xl border border-border bg-muted/60 p-3 sm:flex-row sm:items-start ${
        isDragging ? "opacity-60 shadow-md ring-2 ring-ring/40" : ""
      }`}
    >
      {!readOnly ? (
        <button
          ref={handleRef}
          type="button"
          title={dragHandleLabel}
          aria-label={dragHandleLabel}
          className="mt-1 inline-flex h-9 w-9 shrink-0 cursor-grab items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-muted active:cursor-grabbing"
        >
          <HiBars3 className="h-4 w-4" aria-hidden />
        </button>
      ) : null}
      <span className="mt-2.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-muted-foreground">
        {index + 1}
      </span>
      <div className="min-w-0 flex-1">
        <input
          type="text"
          className="w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-70"
          placeholder={placeholder}
          value={item.text}
          disabled={readOnly}
          onChange={(event) => onChange(event.target.value)}
        />
        {showError ? (
          <p className="mt-1 text-xs font-medium text-destructive">
            {errorMessage}
          </p>
        ) : null}
      </div>
      {!readOnly ? (
        <div className="flex shrink-0 items-center sm:mt-1">
          <button
            type="button"
            onClick={onRemove}
            title={removeLabel}
            aria-label={removeLabel}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-destructive/40 bg-card text-destructive transition hover:bg-destructive/10"
          >
            <HiTrash className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </li>
  );
};

const TermsSettingsForm = ({ readOnly = false }: { readOnly?: boolean }) => {
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
      <p className="mb-4 text-sm text-muted-foreground">
        {LABELS_SETTINGS_PAGE.termsCard.description}
      </p>

      {readOnly ? (
        <p className="mb-4 text-sm text-muted-foreground">
          {LABELS_SETTINGS_PAGE.readOnlyCompanyNotice}
        </p>
      ) : null}

      {termsQuery.isPending ? (
        <p className="text-sm text-muted-foreground">
          {LABELS_SETTINGS_PAGE.loadingTerms}
        </p>
      ) : null}

      {termsQuery.isError ? (
        <p className="mb-4 text-sm text-destructive">
          {LABELS_SETTINGS_PAGE.termsCard.loadError}
        </p>
      ) : null}

      {!termsQuery.isPending ? (
        <div className="space-y-4">
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              {LABELS_SETTINGS_PAGE.termsCard.emptyList}
            </p>
          ) : (
            <DragDropProvider onDragEnd={readOnly ? undefined : handleDragEnd}>
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
                    readOnly={readOnly}
                    onChange={(text) => handleChange(item.id, text)}
                    onRemove={() => handleRemove(item.id)}
                  />
                ))}
              </ul>
            </DragDropProvider>
          )}

          {!readOnly ? (
            <button
              type="button"
              onClick={handleAppend}
              className="inline-flex items-center justify-center rounded-lg border border-dashed border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition hover:border-primary hover:text-primary"
            >
              {LABELS_SETTINGS_PAGE.termsCard.addButton}
            </button>
          ) : null}

          <p className="text-xs italic text-muted-foreground">
            {LABELS_SETTINGS_PAGE.termsCard.footerNote}
          </p>

          {showErrors && items.length === 0 ? (
            <p className="text-sm font-medium text-destructive">
              {LABELS_SETTINGS_PAGE.termsCard.validation.minOne}
            </p>
          ) : null}

          {saveMutation.isError ? (
            <p className="text-sm font-medium text-destructive">
              {(saveMutation.error as Error).message}
            </p>
          ) : null}

          {!readOnly ? (
            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleSave}
                disabled={saveMutation.isPending || items.length === 0}
                className="inline-flex items-center justify-center rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saveMutation.isPending
                  ? LABELS_SETTINGS_PAGE.termsCard.saving
                  : LABELS_SETTINGS_PAGE.termsCard.saveButton}
              </button>
            </div>
          ) : null}
        </div>
      ) : null}
    </SectionCard>
  );
};

export default TermsSettingsForm;
