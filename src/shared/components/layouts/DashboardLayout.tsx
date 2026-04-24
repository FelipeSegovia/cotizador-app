import { useState } from "react";
import { Outlet } from "react-router";
import {
  HiBars3,
  HiBell,
  HiChartBar,
  HiClipboardDocumentList,
  HiCog6Tooth,
  HiDocumentText,
  HiMagnifyingGlass,
  HiQuestionMarkCircle,
  HiUserCircle,
  HiXMark,
} from "react-icons/hi2";
import {
  SidebarBrand,
  SidebarMenuList,
  type NavigationMenuItem,
} from "../navigation";

const mainMenu: NavigationMenuItem[] = [
  {
    label: "Dashboard",
    icon: <HiChartBar className="text-lg" />,
    to: "/dashboard",
    end: true,
  },
  {
    label: "Cotización",
    icon: <HiDocumentText className="text-lg" />,
    to: "/dashboard/cotizaciones",
  },
  { label: "Servicios", icon: <HiClipboardDocumentList className="text-lg" /> },
  { label: "Configuración", icon: <HiCog6Tooth className="text-lg" /> },
];

const secondaryMenu: NavigationMenuItem[] = [
  { label: "Soporte", icon: <HiQuestionMarkCircle className="text-lg" /> },
  { label: "Cuenta", icon: <HiUserCircle className="text-lg" /> },
];

const DashboardLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#eff2f8] text-slate-900">
      {isMobileMenuOpen ? (
        <button
          type="button"
          aria-label="Cerrar menú"
          className="fixed inset-0 z-30 bg-slate-900/40 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      ) : null}
      {/* Mobile sidebar */}
      <aside
        className={`fixed left-0 top-0 z-40 flex h-screen w-72 flex-col border-r border-slate-200 bg-[#f5f7fb] px-6 py-8 transition-transform md:hidden ${
          isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <SidebarBrand
          rightContent={
            <button
              type="button"
              aria-label="Cerrar navegación"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <HiXMark className="text-lg" />
            </button>
          }
        />

        <nav className="mt-10">
          <SidebarMenuList
            items={mainMenu}
            onItemClick={() => setIsMobileMenuOpen(false)}
          />
        </nav>

        <div className="mt-auto border-t border-slate-200 pt-6">
          <SidebarMenuList items={secondaryMenu} />
        </div>
      </aside>
      {/* Desktop sidebar */}
      <div className="mx-auto flex min-h-screen max-w-screen-2xl">
        <aside className="hidden w-72 flex-col border-r border-slate-200 bg-[#f5f7fb] px-6 py-8 md:flex">
          <SidebarBrand />

          <nav className="mt-10">
            <SidebarMenuList items={mainMenu} />
          </nav>

          <div className="mt-auto border-t border-slate-200 pt-6">
            <SidebarMenuList items={secondaryMenu} />
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="border-b border-slate-200 bg-white px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Abrir menú"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-slate-300 hover:text-slate-800 md:hidden"
                onClick={() => setIsMobileMenuOpen(true)}
              >
                <HiBars3 className="text-lg" />
              </button>

              <label className="relative hidden w-full max-w-md lg:block">
                <HiMagnifyingGlass className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search quotes, clients..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-4 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-emerald-300 focus:bg-white"
                />
              </label>

              <div className="ml-auto flex items-center gap-2 sm:gap-3">
                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-slate-300 hover:text-slate-700"
                >
                  <HiBell className="text-lg" />
                </button>

                <button
                  type="button"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-emerald-200 bg-emerald-50 text-emerald-800 transition hover:border-emerald-300"
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
