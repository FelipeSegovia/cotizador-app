import { type ReactNode } from "react";
import { type IconType } from "react-icons";

type SectionCardProps = {
  title: string;
  icon: IconType;
  action?: ReactNode;
  children: ReactNode;
};

const SectionCard = ({
  title,
  icon: Icon,
  action,
  children,
}: SectionCardProps) => {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div
        className={`mb-6 flex items-center ${action ? "justify-between" : ""}`}
      >
        <h2 className="flex items-center gap-2 text-base font-semibold text-slate-800">
          <Icon className="text-xl text-emerald-700" />
          {title}
        </h2>
        {action}
      </div>
      {children}
    </section>
  );
};

export default SectionCard;
