import { Navigate } from "react-router";
import { PATHS } from "../../data";
import useAuthStore from "../../store/useAuthStore";
import type { UserRole } from "../../types/auth";
import { getRoleHome } from "../../utils";

interface RoleProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const RoleProtectedRoute = ({
  children,
  allowedRoles,
}: RoleProtectedRouteProps) => {
  const user = useAuthStore((s) => s.user);
  const isAuthenticated = useAuthStore((s) => s.getIsAuthenticated());

  if (!isAuthenticated) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  if (!user?.role || !allowedRoles.includes(user.role)) {
    return <Navigate to={getRoleHome(user?.role)} replace />;
  }

  return <>{children}</>;
};

export default RoleProtectedRoute;
