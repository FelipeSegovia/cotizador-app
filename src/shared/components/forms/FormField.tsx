import { type InputHTMLAttributes } from "react";
import { type IconType } from "react-icons";
import { HiEye, HiEyeSlash } from "react-icons/hi2";
import {
  type UseFormRegisterReturn,
  type ControllerRenderProps,
} from "react-hook-form";

type ControllerFieldRegistration = Pick<
  ControllerRenderProps,
  "name" | "onBlur" | "ref" | "onChange"
>;

type PasswordToggleProps = {
  visible: boolean;
  onToggle: () => void;
  showLabel: string;
  hideLabel: string;
};

type FormFieldProps = {
  id: string;
  label: string;
  icon?: IconType;
  registration: UseFormRegisterReturn | ControllerFieldRegistration;
  error?: string;
  passwordToggle?: PasswordToggleProps;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "id" | "name">;

const FormField = ({
  id,
  label,
  icon: Icon,
  registration,
  error,
  passwordToggle,
  ...inputProps
}: FormFieldProps) => {
  return (
    <div className="space-y-2">
      <label
        className="block text-sm font-semibold text-slate-700"
        htmlFor={id}
      >
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-slate-200 bg-white px-3 shadow-[inset_0_1px_2px_rgba(15,23,42,0.04)] transition focus-within:border-emerald-600 focus-within:ring-2 focus-within:ring-emerald-100">
        {Icon ? <Icon className="shrink-0 text-lg text-slate-400" /> : null}
        <input
          id={id}
          aria-invalid={error ? "true" : "false"}
          className="w-full border-none bg-transparent px-2 py-3 text-sm text-slate-700 outline-none placeholder:text-slate-400"
          {...registration}
          {...inputProps}
        />
        {passwordToggle ? (
          <button
            type="button"
            onClick={passwordToggle.onToggle}
            aria-label={
              passwordToggle.visible
                ? passwordToggle.hideLabel
                : passwordToggle.showLabel
            }
            className="shrink-0 rounded-md p-1 text-lg text-slate-400 transition hover:text-slate-600"
          >
            {passwordToggle.visible ? <HiEyeSlash /> : <HiEye />}
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs font-medium text-red-600">{error}</p>
      ) : null}
    </div>
  );
};

export default FormField;
