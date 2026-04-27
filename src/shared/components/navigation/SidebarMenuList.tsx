import SidebarMenuItem, { type NavigationMenuItem } from "./SidebarMenuItem";

type SidebarMenuListProps = {
  items: NavigationMenuItem[];
  className?: string;
  onItemClick?: () => void;
  isCollapsed?: boolean;
};

const SidebarMenuList = ({
  items,
  className = "space-y-1",
  onItemClick,
  isCollapsed = false,
}: SidebarMenuListProps) => {
  const resolvedClassName = isCollapsed
    ? `space-y-1 ${className} flex flex-col items-center`
    : className;

  return (
    <div className={resolvedClassName}>
      {items.map((item) => (
        <SidebarMenuItem
          key={item.label}
          item={item}
          isCollapsed={isCollapsed}
          onClick={() => {
            item.onClick?.();
            onItemClick?.();
          }}
        />
      ))}
    </div>
  );
};

export default SidebarMenuList;
