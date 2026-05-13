import { type ReactNode } from "react";
import { type IconType } from "react-icons";

type InfoTileProps = {
  icon: IconType;
  title: string;
  description: ReactNode;
};

const InfoTile = ({ icon: Icon, title, description }: InfoTileProps) => {
  return (
    <article className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50/90 p-5 shadow-sm">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
        <Icon className="text-xl" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-slate-600">{description}</p>
      </div>
    </article>
  );
};

export default InfoTile;
