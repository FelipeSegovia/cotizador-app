import { useState, type KeyboardEvent } from "react";
import { HiXMark } from "react-icons/hi2";
import { LABELS_CLIENTS_PAGE } from "../../shared/data";
import {
  MAX_CLIENT_TAGS,
  normalizeClientTag,
} from "./client-utils";

type TagChipsInputProps = {
  tags: string[];
  onChange: (tags: string[]) => void;
  error?: string | null;
  onErrorChange?: (error: string | null) => void;
};

const TagChipsInput = ({
  tags,
  onChange,
  error,
  onErrorChange,
}: TagChipsInputProps) => {
  const [draft, setDraft] = useState("");

  const tryAdd = (raw: string) => {
    const pieces = raw
      .split(",")
      .map((piece) => piece.trim())
      .filter(Boolean);

    if (pieces.length === 0) return;

    let next = [...tags];
    let lastError: string | null = null;

    for (const piece of pieces) {
      if (next.length >= MAX_CLIENT_TAGS) {
        lastError = LABELS_CLIENTS_PAGE.validation.maxTags;
        break;
      }

      const normalized = normalizeClientTag(piece);
      if (!normalized) {
        lastError = LABELS_CLIENTS_PAGE.validation.tagInvalid;
        continue;
      }

      if (next.includes(normalized)) continue;
      next = [...next, normalized];
    }

    onChange(next);
    onErrorChange?.(lastError);
    setDraft("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === ",") {
      event.preventDefault();
      tryAdd(draft);
      return;
    }

    if (event.key === "Backspace" && !draft && tags.length > 0) {
      onChange(tags.slice(0, -1));
      onErrorChange?.(null);
    }
  };

  const removeTag = (tag: string) => {
    onChange(tags.filter((item) => item !== tag));
    onErrorChange?.(null);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">
        {LABELS_CLIENTS_PAGE.createModal.fields.tags.label}
      </p>
      <div className="rounded-xl border border-border bg-card px-3 py-2.5 focus-within:border-ring">
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-foreground"
            >
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                aria-label={`Quitar ${tag}`}
                className="rounded-full p-0.5 text-muted-foreground transition hover:bg-card hover:text-foreground"
              >
                <HiXMark className="text-sm" />
              </button>
            </span>
          ))}
          <input
            type="text"
            value={draft}
            onChange={(e) => {
              setDraft(e.target.value);
              if (error) onErrorChange?.(null);
            }}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              if (draft.trim()) tryAdd(draft);
            }}
            placeholder={
              tags.length === 0
                ? LABELS_CLIENTS_PAGE.createModal.fields.tags.placeholder
                : ""
            }
            className="min-w-[8rem] flex-1 bg-transparent py-0.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
          />
        </div>
      </div>
      <p className="text-xs text-muted-foreground">
        {LABELS_CLIENTS_PAGE.createModal.fields.tags.hint}
      </p>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
};

export default TagChipsInput;
