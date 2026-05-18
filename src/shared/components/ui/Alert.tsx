import type { ReactNode } from "react";
import {
  HiInformationCircle,
  HiOutlineCheckCircle,
  HiOutlineExclamationCircle,
} from "react-icons/hi2";

type AlertVariant = "info" | "success" | "warning" | "error";

type AlertProps = {
  variant: AlertVariant;
  icon?: ReactNode;
  children: ReactNode;
  role?: "alert" | "status";
  className?: string;
};

const VARIANT_STYLES: Record<
  AlertVariant,
  { container: string; defaultRole: "alert" | "status" }
> = {
  info: {
    container: "border-blue-200 bg-blue-50 text-blue-800",
    defaultRole: "status",
  },
  success: {
    container: "border-emerald-200 bg-emerald-50 text-emerald-900",
    defaultRole: "status",
  },
  warning: {
    container: "border-amber-200 bg-amber-50 text-amber-900",
    defaultRole: "status",
  },
  error: {
    container: "border-rose-200 bg-rose-50 text-rose-800",
    defaultRole: "alert",
  },
};

const DefaultIcon = ({ variant }: { variant: AlertVariant }) => {
  const className = "mt-0.5 shrink-0 text-base";

  switch (variant) {
    case "success":
      return <HiOutlineCheckCircle className={className} />;
    case "info":
      return <HiInformationCircle className={className} />;
    default:
      return <HiOutlineExclamationCircle className={className} />;
  }
};

const Alert = ({
  variant,
  icon,
  children,
  role,
  className = "",
}: AlertProps) => {
  const styles = VARIANT_STYLES[variant];

  return (
    <div
      role={role ?? styles.defaultRole}
      className={`flex items-start gap-2 rounded-xl border px-4 py-3 text-sm ${styles.container} ${className}`.trim()}
    >
      {icon ?? <DefaultIcon variant={variant} />}
      <p>{children}</p>
    </div>
  );
};

export default Alert;
