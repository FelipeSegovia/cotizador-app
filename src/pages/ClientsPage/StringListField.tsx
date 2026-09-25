import { HiOutlinePlus, HiOutlineTrash } from "react-icons/hi2";

type StringListFieldProps = {
  id: string;
  label: string;
  placeholder: string;
  addLabel: string;
  values: string[];
  type?: "email" | "tel" | "text";
  maxItems: number;
  errors?: (string | undefined)[];
  onChange: (values: string[]) => void;
};

const StringListField = ({
  id,
  label,
  placeholder,
  addLabel,
  values,
  type = "text",
  maxItems,
  errors = [],
  onChange,
}: StringListFieldProps) => {
  const canAdd = values.length < maxItems;

  const updateAt = (index: number, value: string) => {
    const next = [...values];
    next[index] = value;
    onChange(next);
  };

  const removeAt = (index: number) => {
    onChange(values.filter((_, i) => i !== index));
  };

  const addItem = () => {
    if (!canAdd) return;
    onChange([...values, ""]);
  };

  return (
    <div className="space-y-2">
      <p className="text-sm font-medium text-foreground">{label}</p>
      {values.length === 0 ? (
        <p className="text-xs text-muted-foreground">—</p>
      ) : null}
      <div className="space-y-2">
        {values.map((value, index) => (
          <div key={`${id}-${index}`} className="space-y-1">
            <div className="flex gap-2">
              <input
                id={`${id}-${index}`}
                type={type}
                value={value}
                onChange={(e) => updateAt(index, e.target.value)}
                placeholder={placeholder}
                className="w-full rounded-xl border border-border bg-card px-3.5 py-2.5 text-sm text-foreground outline-none transition focus:border-ring"
              />
              <button
                type="button"
                onClick={() => removeAt(index)}
                aria-label="Quitar"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-border text-muted-foreground transition hover:bg-muted hover:text-destructive"
              >
                <HiOutlineTrash />
              </button>
            </div>
            {errors[index] ? (
              <p className="text-xs text-destructive">{errors[index]}</p>
            ) : null}
          </div>
        ))}
      </div>
      <button
        type="button"
        onClick={addItem}
        disabled={!canAdd}
        className="inline-flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-xs font-semibold text-primary transition hover:bg-primary/10 disabled:cursor-not-allowed disabled:opacity-40"
      >
        <HiOutlinePlus className="text-sm" />
        {addLabel}
      </button>
    </div>
  );
};

export default StringListField;
