import { Navigate } from "react-router";
import useAuthStore from "../../store/useAuthStore";
import { PATHS } from "../../data";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { getIsAuthenticated } = useAuthStore();
  const isAuthorized = getIsAuthenticated();

  // No autenticado
  if (!isAuthorized) {
    return <Navigate to={PATHS.LOGIN} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
