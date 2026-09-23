import { Navigate } from "react-router";
import useAuthStore from "../shared/store/useAuthStore";
import { getRoleHome } from "../shared/utils";
import RootPage from "./RootPage";

/**
 * Index de `/dashboard`: admin va a Empresas; business/common ven el dashboard operativo.
 */
const DashboardIndex = () => {
  const role = useAuthStore((s) => s.user?.role);

  if (role === "admin") {
    return <Navigate to={getRoleHome("admin")} replace />;
  }

  return <RootPage />;
};

export default DashboardIndex;
