import type { ReactNode } from "react";

type SidebarBrandProps = {
  rightContent?: ReactNode;
};

const SidebarBrand = ({ rightContent }: SidebarBrandProps) => {
  return (
    <div className="flex items-start justify-between gap-3">
      <div>
        <h1 className="text-2xl font-black tracking-[-0.02em] text-slate-900">
          NeuralCode Chile
        </h1>
        <p className="mt-2 text-xs font-medium text-emerald-700">
          Valor IVA 19%
        </p>
      </div>

      {rightContent}
    </div>
  );
};

export default SidebarBrand;
