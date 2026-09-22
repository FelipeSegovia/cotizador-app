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
    container:
      "border-chart-3/40 bg-chart-3/10 text-chart-3 dark:border-chart-2/40 dark:bg-chart-2/15 dark:text-chart-2",
    defaultRole: "status",
  },
  success: {
    container:
      "border-primary/30 bg-accent text-accent-foreground dark:border-primary/40 dark:bg-primary/15 dark:text-primary-foreground",
    defaultRole: "status",
  },
  warning: {
    container:
      "border-chart-4/40 bg-chart-4/15 text-chart-4 dark:border-chart-4/50 dark:bg-chart-4/15 dark:text-chart-4",
    defaultRole: "status",
  },
  error: {
    container:
      "border-destructive/40 bg-destructive/10 text-destructive dark:border-destructive/50 dark:bg-destructive/15 dark:text-destructive-foreground",
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
