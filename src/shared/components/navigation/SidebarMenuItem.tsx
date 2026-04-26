import { useEffect, useRef, useState } from "react";
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
  isCollapsed?: boolean;
};

const SidebarMenuItem = ({
  item,
  onClick,
  isCollapsed = false,
}: SidebarMenuItemProps) => {
  const location = useLocation();
  const collapsedItemRef = useRef<HTMLDivElement | null>(null);
  const isChildActive =
    item.children?.some((c) => location.pathname.startsWith(c.to)) ?? false;
  const [isOpen, setIsOpen] = useState(isChildActive);

  useEffect(() => {
    if (isCollapsed) {
      setIsOpen(false);
      return;
    }

    if (isChildActive) {
      setIsOpen(true);
    }
  }, [isCollapsed, isChildActive]);

  useEffect(() => {
    if (!isCollapsed || !isOpen) {
      return;
    }

    const handlePointerDownOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;

      if (!collapsedItemRef.current?.contains(targetNode)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDownOutside);

    return () => {
      document.removeEventListener("mousedown", handlePointerDownOutside);
    };
  }, [isCollapsed, isOpen]);

  const handleChildItemClick = () => {
    setIsOpen(false);
    onClick?.();
  };

  if (item.children) {
    if (isCollapsed) {
      return (
        <div ref={collapsedItemRef} className="relative">
          <button
            type="button"
            title={item.label}
            aria-label={item.label}
            onClick={() => setIsOpen((prev) => !prev)}
            className={`group flex h-11 w-11 items-center justify-center rounded-xl transition ${
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
          </button>

          {isOpen && (
            <div className="absolute left-full top-1/2 z-50 ml-3 w-56 -translate-y-1/2 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-400">
                {item.label}
              </p>
              <div className="space-y-1">
                {item.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    end={child.end}
                    onClick={handleChildItemClick}
                    className={({ isActive }) =>
                      `flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-emerald-50 text-emerald-800"
                          : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                      }`
                    }
                  >
                    {child.label}
                  </NavLink>
                ))}
              </div>
            </div>
          )}
        </div>
      );
    }

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
                onClick={handleChildItemClick}
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
        title={isCollapsed ? item.label : undefined}
        aria-label={isCollapsed ? item.label : undefined}
        className={({ isActive }) =>
          `group flex items-center rounded-xl text-sm font-semibold transition ${
            isCollapsed
              ? "mx-auto h-11 w-11 justify-center px-0"
              : "w-full gap-3 px-3 py-2.5"
          } ${
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
            {!isCollapsed ? item.label : null}
          </>
        )}
      </NavLink>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      title={isCollapsed ? item.label : undefined}
      aria-label={isCollapsed ? item.label : undefined}
      className={`group flex items-center rounded-xl text-sm font-semibold text-slate-600 transition hover:bg-white hover:text-slate-900 ${
        isCollapsed
          ? "mx-auto h-11 w-11 justify-center px-0"
          : "w-full gap-3 px-3 py-2.5"
      }`}
    >
      <span className="text-slate-400 transition group-hover:text-slate-700">
        {item.icon}
      </span>
      {!isCollapsed ? item.label : null}
    </button>
  );
};

export default SidebarMenuItem;
