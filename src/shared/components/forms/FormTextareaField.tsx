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
        className="block text-sm font-semibold text-slate-700"
        htmlFor={id}
      >
        {label}
      </label>

      <textarea
        id={id}
        aria-invalid={error ? "true" : "false"}
        className="w-full resize-none rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm text-slate-700 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
        {...registration}
        {...textareaProps}
      />

      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
};

export default FormTextareaField;
