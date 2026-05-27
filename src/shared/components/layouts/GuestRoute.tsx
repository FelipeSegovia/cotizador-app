import { Navigate } from "react-router";
import useAuthStore from "../../store/useAuthStore";
import { PATHS } from "../../data";

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const { getIsAuthenticated } = useAuthStore();
  const isAuthorized = getIsAuthenticated();

  if (isAuthorized) {
    return <Navigate to={PATHS.DASHBOARD} replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
