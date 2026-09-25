import { useMemo, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import {
  HiArrowRightOnRectangle,
  HiBars3,
  HiBell,
  HiBuildingOffice2,
  HiChartBar,
  HiChatBubbleLeftRight,
  HiChevronDoubleLeft,
  HiChevronDoubleRight,
  HiCog6Tooth,
  HiDocumentText,
  HiMagnifyingGlass,
  HiUserCircle,
  HiUserGroup,
  HiUsers,
  HiXMark,
} from "react-icons/hi2";
import {
  FirstLoginPasswordModal,
  SuggestIdeaButton,
  ThemeToggle,
} from "../ui";
import {
  SidebarBrand,
  SidebarMenuList,
  type NavigationMenuItem,
} from "../navigation";
import { PATHS } from "../../data";
import useAuthStore from "../../store/useAuthStore";
import { useQuotationDraftStore } from "../../store";
import { can } from "../../utils";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);
  const userRole = useAuthStore((state) => state.user?.role);
  const resetDraft = useQuotationDraftStore((state) => state.resetDraft);

  const mainMenu: NavigationMenuItem[] = useMemo(() => {
    const items: NavigationMenuItem[] = [];

    if (can(userRole, "dashboard")) {
      items.push({
        label: "Dashboard",
        icon: <HiChartBar className="text-lg" />,
        to: PATHS.DASHBOARD,
        end: true,
      });
    }

    if (can(userRole, "companies")) {
      items.push({
        label: "Empresas",
        icon: <HiBuildingOffice2 className="text-lg" />,
        to: PATHS.COMPANIES,
      });
    }

    if (can(userRole, "quotations")) {
      items.push({
        label: "Cotizaciones",
        icon: <HiDocumentText className="text-lg" />,
        children: [
          { label: "Listado", to: PATHS.QUOTATIONS, end: true },
          {
            label: "Crear Cotización",
            to: PATHS.NEW_QUOTATION,
            onClick: () => {
              resetDraft();
            },
          },
        ],
      });
    }

    if (can(userRole, "clients")) {
      items.push({
        label: "Clientes",
        icon: <HiUserGroup className="text-lg" />,
        to: PATHS.CLIENTS,
      });
    }

    if (can(userRole, "users")) {
      items.push({
        label: "Usuarios",
        icon: <HiUsers className="text-lg" />,
        to: PATHS.USERS,
      });
    }

    if (can(userRole, "feedback")) {
      items.push({
        label: "Feedback",
        icon: <HiChatBubbleLeftRight className="text-lg" />,
        to: PATHS.FEEDBACK,
      });
    }

    if (can(userRole, "settings")) {
      items.push({
        label: "Configuración",
        icon: <HiCog6Tooth className="text-lg" />,
        to: PATHS.SETTINGS,
      });
    }

    return items;
  }, [resetDraft, userRole]);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDesktopSidebarCollapsed, setIsDesktopSidebarCollapsed] =
    useState(false);

  const secondaryMenu: NavigationMenuItem[] = [
    {
      label: "Cerrar sesión",
      icon: <HiArrowRightOnRectangle className="text-lg" />,
      onClick: () => {
        logout();
        navigate(PATHS.LOGIN, { replace: true });
      },
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <FirstLoginPasswordModal />
      <SuggestIdeaButton />
      {isMobileMenuOpen ? (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-30 bg-secondary/40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      ) : null}
      {/* Mobile sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-sidebar-border bg-sidebar px-6 py-8 text-sidebar-foreground transition-transform md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarBrand
          rightContent={
            <button
              type="button"
              aria-label="Cerrar navegación"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-sidebar-border bg-card text-muted-foreground"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HiXMark className="text-lg" />
            </button>
          }
        />

        <div className="mt-10 min-h-0 flex-1 overflow-y-auto">
          <nav>
            <SidebarMenuList
              items={mainMenu}
              onItemClick={() => setIsMobileMenuOpen(false)}
            />
          </nav>
        </div>

        <div className="mt-6 border-t border-sidebar-border pt-6">
          <SidebarMenuList items={secondaryMenu} />
        </div>
      </aside>
      {/* Desktop sidebar */}
      <div className="mx-auto flex min-h-screen max-w-screen-2xl">
        <aside
          className={`hidden flex-col border-r border-sidebar-border bg-sidebar py-8 text-sidebar-foreground transition-all duration-300 md:sticky md:top-0 md:z-20 md:flex md:h-screen md:self-start md:overflow-visible ${
            isDesktopSidebarCollapsed ? "w-24 px-4" : "w-72 px-6"
          }`}
        >
          <SidebarBrand
            isCollapsed={isDesktopSidebarCollapsed}
            rightContent={
              <button
                type="button"
                aria-label={
                  isDesktopSidebarCollapsed
                    ? "Expandir navegación"
                    : "Minimizar navegación"
                }
                className={`flex items-center justify-center rounded-full border border-sidebar-border bg-card text-muted-foreground transition hover:border-sidebar-ring hover:text-sidebar-foreground ${
                  isDesktopSidebarCollapsed ? "h-11 w-11" : "h-9 w-9"
                }`}
                onClick={() =>
                  setIsDesktopSidebarCollapsed(
                    (prevCollapsed) => !prevCollapsed,
                  )
                }
              >
                {isDesktopSidebarCollapsed ? (
                  <HiChevronDoubleRight className="text-base" />
                ) : (
                  <HiChevronDoubleLeft className="text-base" />
                )}
              </button>
            }
          />

          <div
            className={`mt-10 min-h-0 flex-1 ${
              isDesktopSidebarCollapsed ? "overflow-visible" : "overflow-y-auto"
            }`}
          >
            <nav>
              <SidebarMenuList
                items={mainMenu}
                isCollapsed={isDesktopSidebarCollapsed}
              />
            </nav>
          </div>

          <div className="mt-6 border-t border-sidebar-border pt-6">
            <SidebarMenuList
              items={secondaryMenu}
              isCollapsed={isDesktopSidebarCollapsed}
            />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-border bg-card px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Abrir menú"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-ring hover:text-foreground md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <HiBars3 className="text-lg" />
              </button>

              <label className="relative hidden w-full max-w-md lg:block">
                <HiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar…"
                  className="w-full rounded-xl border border-input bg-muted py-2.5 pl-10 pr-4 text-sm text-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:bg-card"
                />
              </label>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <ThemeToggle />

                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-border bg-card text-muted-foreground transition hover:border-ring hover:text-foreground"
                >
                  <HiBell className="text-lg" />
                </button>

                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-sidebar-accent bg-accent text-accent-foreground transition hover:border-ring"
                >
                  <HiUserCircle className="text-2xl" />
                </button>
              </div>
            </div>
          </header>

          <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
