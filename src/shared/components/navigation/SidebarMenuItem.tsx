import type { ReactElement } from "react";
import { NavLink } from "react-router";

export type NavigationMenuItem = {
  label: string;
  icon: ReactElement;
  to?: string;
  end?: boolean;
  onClick?: () => void;
};

type SidebarMenuItemProps = {
  item: NavigationMenuItem;
  onClick?: () => void;
};

const SidebarMenuItem = ({ item, onClick }: SidebarMenuItemProps) => {
  if (item.to) {
    return (
      <NavLink
        to={item.to}
        end={item.end}
        onClick={onClick}
        className={({ isActive }) =>
          `group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
            isActive
              ? "bg-emerald-50 text-emerald-800"
              : "text-slate-600 hover:bg-white hover:text-slate-900"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={`transition ${
                isActive
                  ? "text-emerald-700"
                  : "text-slate-400 group-hover:text-slate-700"
              }`}
            >
              {item.icon}
            </span>
            {item.label}
          </>
        )}
      </NavLink>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900"
    >
      <span className="text-slate-400 transition group-hover:text-slate-700">
        {item.icon}
      </span>
      {item.label}
    </button>
  );
};

export default SidebarMenuItem;
