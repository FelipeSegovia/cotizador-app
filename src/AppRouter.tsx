import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import {
  AcceptInvitationPage,
  AdminCompaniesPage,
  AdminUsersPage,
  FeedbackManagementPage,
  ClientsPage,
  CompanyExpensesPage,
  DashboardIndex,
  LoginPage,
  RecoverPasswordPage,
  QuotationCreatorPage,
  QuotationsListPage,
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
          path={PATHS.RECOVER_PASSWORD}
          element={
            <GuestRoute>
              <RecoverPasswordPage />
            </GuestRoute>
          }
        />
        <Route
          path={PATHS.INVITE}
          element={
            <GuestRoute>
              <AcceptInvitationPage />
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
          <Route index element={<DashboardIndex />} />
          <Route
            path={PATHS.QUOTATIONS}
            element={
              <RoleProtectedRoute allowedRoles={["business", "common"]}>
                <QuotationsListPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={PATHS.NEW_QUOTATION}
            element={
              <RoleProtectedRoute allowedRoles={["business", "common"]}>
                <QuotationCreatorPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={PATHS.CLIENTS}
            element={
              <RoleProtectedRoute allowedRoles={["business", "common"]}>
                <ClientsPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={PATHS.COMPANY_EXPENSES}
            element={
              <RoleProtectedRoute allowedRoles={["business", "common"]}>
                <CompanyExpensesPage />
              </RoleProtectedRoute>
            }
          />
          <Route path={PATHS.SETTINGS} element={<SettingsPage />} />
          <Route
            path={PATHS.FEEDBACK}
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <FeedbackManagementPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={PATHS.USERS}
            element={
              <RoleProtectedRoute allowedRoles={["admin", "business"]}>
                <AdminUsersPage />
              </RoleProtectedRoute>
            }
          />
          <Route
            path={PATHS.COMPANIES}
            element={
              <RoleProtectedRoute allowedRoles={["admin"]}>
                <AdminCompaniesPage />
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
