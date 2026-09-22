import type { ReactNode } from "react";
import { MdWavingHand } from "react-icons/md";
import { useCurrentUser } from "../../hooks";
import useAuthStore from "../../store/useAuthStore";

const getFirstName = (name: string): string =>
  name.trim().split(/\s+/)[0] ?? "";

type SidebarBrandProps = {
  rightContent?: ReactNode;
  isCollapsed?: boolean;
};

const SidebarBrand = ({
  rightContent,
  isCollapsed = false,
}: SidebarBrandProps) => {
  const storeUser = useAuthStore((s) => s.user);
  const currentUserQuery = useCurrentUser();
  const user = currentUserQuery.data ?? storeUser ?? null;
  const firstName = user ? getFirstName(user.name) : "";

  return (
    <div
      className={`flex w-full ${
        isCollapsed ? "justify-center" : "items-start justify-between gap-3"
      }`}
    >
      {!isCollapsed && (
        <div>
          <h1 className="flex items-center gap-2 text-2xl font-black tracking-[-0.02em] text-sidebar-foreground">
            {firstName ? (
              <>
                Hola, {firstName}
                <MdWavingHand className="text-2xl text-chart-4" aria-hidden />
              </>
            ) : (
              "Hola"
            )}
          </h1>
          <p className="mt-2 text-xs font-medium text-sidebar-primary">
            Valor IVA 19%
          </p>
        </div>
      )}

      {rightContent}
    </div>
  );
};

export default SidebarBrand;
