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
      className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#0f7a4a] px-4 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(15,122,74,0.25)] transition hover:bg-[#0c6a40] disabled:cursor-not-allowed disabled:opacity-70"
    >
      {isLoading ? "Ingresando..." : label}
      {icon}
    </button>
  );
};

export default FormSubmitButton;
