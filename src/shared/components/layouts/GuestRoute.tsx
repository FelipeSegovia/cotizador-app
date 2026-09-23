import { Navigate } from "react-router";
import useAuthStore from "../../store/useAuthStore";
import { getRoleHome } from "../../utils";

interface GuestRouteProps {
  children: React.ReactNode;
}

const GuestRoute = ({ children }: GuestRouteProps) => {
  const getIsAuthenticated = useAuthStore((s) => s.getIsAuthenticated);
  const user = useAuthStore((s) => s.user);
  const isAuthorized = getIsAuthenticated();

  if (isAuthorized) {
    return <Navigate to={getRoleHome(user?.role)} replace />;
  }

  return <>{children}</>;
};

export default GuestRoute;
