import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import {
  AdminUsersPage,
  CompanyExpensesPage,
  LoginPage,
  QuotationCreatorPage,
  QuotationsListPage,
  RootPage,
  SettingsPage,
} from "./pages";
import {
  DashboardLayout,
  GuestRoute,
  ProtectedRoute,
  RoleProtectedRoute,
} from "./shared/components/layouts";
import { PATHS } from "./shared/data";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={PATHS.LOGIN}
          element={
            <GuestRoute>
              <LoginPage />
            </GuestRoute>
          }
        />
        <Route
          path={PATHS.DASHBOARD}
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<RootPage />} />
          <Route path={PATHS.QUOTATIONS} element={<QuotationsListPage />} />
          <Route
            path={PATHS.NEW_QUOTATION}
            element={<QuotationCreatorPage />}
          />
          <Route
            path={PATHS.COMPANY_EXPENSES}
            element={<CompanyExpensesPage />}
          />
          <Route path={PATHS.SETTINGS} element={<SettingsPage />} />
          <Route
            path={PATHS.USERS}
            element={
              <RoleProtectedRoute requiredRole="admin">
                <AdminUsersPage />
              </RoleProtectedRoute>
            }
          />
        </Route>
        <Route path="*" element={<Navigate to={PATHS.LOGIN} />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
