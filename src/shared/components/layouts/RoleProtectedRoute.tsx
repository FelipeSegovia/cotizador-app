import { Navigate } from "react-router";
import { PATHS } from "../../data";
import useAuthStore from "../../store/useAuthStore";
import type { UserRole } from "../../types/auth";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: UserRole;
}

const RoleProtectedRoute = ({
  children,
  requiredRole,
}: RoleProtectedRouteProps) => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.getIsAuthenticated());

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (user?.role !== requiredRole) {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
