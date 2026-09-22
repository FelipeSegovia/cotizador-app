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
        className="block text-sm font-semibold text-foreground"
        htmlFor={id}
      >
        {label}
      </label>

      <div className="flex items-center rounded-xl border border-input bg-card px-3 transition focus-within:border-ring focus-within:ring-2 focus-within:ring-ring/30">
        {Icon ? <Icon className="shrink-0 text-lg text-muted-foreground" /> : null}
        <input
          id={id}
          aria-invalid={error ? "true" : "false"}
          className="w-full border-none bg-transparent px-2 py-3 text-sm text-foreground outline-none placeholder:text-muted-foreground"
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
            className="shrink-0 rounded-md p-1 text-lg text-muted-foreground transition hover:text-foreground"
          >
            {passwordToggle.visible ? <HiEyeSlash /> : <HiEye />}
          </button>
        ) : null}
      </div>

      {error ? (
        <p className="text-xs font-medium text-destructive">{error}</p>
      ) : null}
    </div>
  );
};

export default FormField;
