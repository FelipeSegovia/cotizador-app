import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import {
  CompanyExpensesPage,
  LoginPage,
  QuotationPage,
  RootPage,
  SettingsPage,
} from "./pages";
import { DashboardLayout } from "./shared/components/layouts";

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<RootPage />} />
          <Route path="cotizaciones" element={<QuotationPage />} />
          <Route path="gastos" element={<CompanyExpensesPage />} />
          <Route path="configuracion" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
