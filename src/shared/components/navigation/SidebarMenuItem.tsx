import { useState } from "react";
import type { ReactElement } from "react";
import { NavLink, useLocation } from "react-router";
import { HiChevronDown } from "react-icons/hi2";

export type SubMenuItem = {
  label: string;
  to: string;
  end?: boolean;
};

export type NavigationMenuItem = {
  label: string;
  icon: ReactElement;
  to?: string;
  end?: boolean;
  onClick?: () => void;
  children?: SubMenuItem[];
};

type SidebarMenuItemProps = {
  item: NavigationMenuItem;
  onClick?: () => void;
};

const SidebarMenuItem = ({ item, onClick }: SidebarMenuItemProps) => {
  const location = useLocation();
  const isChildActive =
    item.children?.some((c) => location.pathname.startsWith(c.to)) ?? false;
  const [isOpen, setIsOpen] = useState(isChildActive);

  if (item.children) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setIsOpen((prev) => !prev)}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
            isChildActive
              ? "bg-emerald-50 text-emerald-800"
              : "text-slate-600 hover:bg-white hover:text-slate-900"
          }`}
        >
          <span
            className={`transition ${
              isChildActive
                ? "text-emerald-700"
                : "text-slate-400 group-hover:text-slate-700"
            }`}
          >
            {item.icon}
          </span>
          <span className="flex-1 text-left">{item.label}</span>
          <HiChevronDown
            className={`text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="mt-1 space-y-1 pl-9">
            {item.children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                end={child.end}
                onClick={onClick}
                className={({ isActive }) =>
                  `flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-emerald-50 text-emerald-800"
                      : "text-slate-500 hover:bg-white hover:text-slate-900"
                  }`
                }
              >
                {child.label}
              </NavLink>
            ))}
          </div>
        )}
      </div>
    );
  }

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
