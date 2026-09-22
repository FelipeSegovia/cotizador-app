import { type ReactNode } from "react";

type FormSubmitButtonProps = {
  label: string;
  icon?: ReactNode;
  isLoading?: boolean;
};

const FormSubmitButton = ({
  label,
  icon,
  isLoading = false,
}: FormSubmitButtonProps) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? "Ingresando..." : label}
      {icon}
    </button>
  );
};

export default FormSubmitButton;
