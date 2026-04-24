import SidebarMenuItem, { type NavigationMenuItem } from "./SidebarMenuItem";

type SidebarMenuListProps = {
  items: NavigationMenuItem[];
  className?: string;
  onItemClick?: () => void;
};

const SidebarMenuList = ({
  items,
  className = "space-y-1",
  onItemClick,
}: SidebarMenuListProps) => {
  return (
    <div className={className}>
      {items.map((item) => (
        <SidebarMenuItem
          key={item.label}
          item={item}
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
