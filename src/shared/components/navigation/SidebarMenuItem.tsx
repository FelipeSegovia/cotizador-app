import { useEffect, useRef, useState } from "react";
import type { ReactElement } from "react";
import { NavLink, useLocation } from "react-router";
import { HiChevronDown } from "react-icons/hi2";

export type SubMenuItem = {
  label: string;
  to: string;
  end?: boolean;
  onClick?: () => void;
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
  const [isExpandedOpen, setIsExpandedOpen] = useState(isChildActive);
  const [isCollapsedOpen, setIsCollapsedOpen] = useState(false);
  const isOpen = isCollapsed
    ? isCollapsedOpen
    : isChildActive || isExpandedOpen;

  const renderCollapsedTooltip = (label: string) => {
    if (!isCollapsed) {
      return null;
    }

    return (
      <span className="pointer-events-none absolute left-full top-1/2 z-50 ml-3 -translate-y-1/2 whitespace-nowrap rounded-md bg-popover px-2 py-1 text-xs font-semibold text-popover-foreground opacity-0 shadow-md transition-opacity duration-150 group-hover:opacity-100">
        {label}
      </span>
    );
  };

  useEffect(() => {
    if (!isCollapsed || !isOpen) {
      return;
    }

    const handlePointerDownOutside = (event: MouseEvent) => {
      const targetNode = event.target as Node;

      if (!collapsedItemRef.current?.contains(targetNode)) {
        setIsCollapsedOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDownOutside);

    return () => {
      document.removeEventListener("mousedown", handlePointerDownOutside);
    };
  }, [isCollapsed, isOpen]);

  const handleChildItemClick = () => {
    if (isCollapsed) {
      setIsCollapsedOpen(false);
    }
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
            onClick={() => setIsCollapsedOpen((prev) => !prev)}
            className={`group relative flex h-11 w-11 items-center justify-center rounded-xl transition ${
              isChildActive
                ? "bg-sidebar-accent text-sidebar-accent-foreground"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
            }`}
          >
            <span
              className={`transition ${
                isChildActive
                  ? "text-sidebar-accent-foreground"
                  : "text-muted-foreground group-hover:text-sidebar-foreground"
              }`}
            >
              {item.icon}
            </span>
            {renderCollapsedTooltip(item.label)}
          </button>

          {isOpen && (
            <div className="absolute left-full top-1/2 z-50 ml-3 w-56 -translate-y-1/2 rounded-2xl border border-sidebar-border bg-popover p-2 shadow-xl">
              <p className="px-3 py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                {item.label}
              </p>
              <div className="space-y-1">
                {item.children.map((child) => (
                  <NavLink
                    key={child.to}
                    to={child.to}
                    end={child.end}
                    onClick={() => {
                      child.onClick?.();
                      handleChildItemClick();
                    }}
                    className={({ isActive }) =>
                      `flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium transition ${
                        isActive
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
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
          onClick={() => setIsExpandedOpen((prev) => !prev)}
          className={`group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition ${
            isChildActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          }`}
        >
          <span
            className={`transition ${
                isChildActive
                  ? "text-sidebar-accent-foreground"
                  : "text-muted-foreground group-hover:text-sidebar-foreground"
            }`}
          >
            {item.icon}
          </span>
          <span className="flex-1 text-left">{item.label}</span>
          <HiChevronDown
            className={`text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          />
        </button>

        {isOpen && (
          <div className="mt-1 space-y-1 pl-9">
            {item.children.map((child) => (
              <NavLink
                key={child.to}
                to={child.to}
                end={child.end}
                onClick={() => {
                  child.onClick?.();
                  handleChildItemClick();
                }}
                className={({ isActive }) =>
                  `flex w-full items-center rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActive
                      ? "bg-sidebar-accent text-sidebar-accent-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
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
          `group relative flex items-center rounded-xl text-sm font-semibold transition ${
            isCollapsed
              ? "mx-auto h-11 w-11 justify-center px-0"
              : "w-full gap-3 px-3 py-2.5"
          } ${
            isActive
              ? "bg-sidebar-accent text-sidebar-accent-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-sidebar-foreground"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <span
              className={`transition ${
                isActive
                  ? "text-sidebar-accent-foreground"
                  : "text-muted-foreground group-hover:text-sidebar-foreground"
              }`}
            >
              {item.icon}
            </span>
            {!isCollapsed ? item.label : null}
            {renderCollapsedTooltip(item.label)}
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
      className={`group relative flex items-center rounded-xl text-sm font-semibold text-muted-foreground transition hover:bg-sidebar-accent hover:text-sidebar-foreground ${
        isCollapsed
          ? "mx-auto h-11 w-11 justify-center px-0"
          : "w-full gap-3 px-3 py-2.5"
      }`}
    >
      <span className="text-muted-foreground transition group-hover:text-sidebar-foreground">
        {item.icon}
      </span>
      {!isCollapsed ? item.label : null}
    </button>
  );
};

export default SidebarMenuItem;
