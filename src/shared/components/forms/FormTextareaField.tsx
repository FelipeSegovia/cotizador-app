import { type TextareaHTMLAttributes } from "react";
import { type UseFormRegisterReturn } from "react-hook-form";

type FormTextareaFieldProps = {
  id: string;
  label: string;
  registration: UseFormRegisterReturn;
  error?: string;
} & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, "id" | "name">;

const FormTextareaField = ({
  id,
  label,
  registration,
  error,
  ...textareaProps
}: FormTextareaFieldProps) => {
  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold text-foreground"
        htmlFor={id}
      >
        {label}
      </label>

      <textarea
        id={id}
        aria-invalid={error ? "true" : "false"}
        className="w-full resize-none rounded-xl border border-input bg-card px-3 py-3 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/30"
        {...registration}
        {...textareaProps}
      />

      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : null}
    </div>
  );
};

export default FormTextareaField;
