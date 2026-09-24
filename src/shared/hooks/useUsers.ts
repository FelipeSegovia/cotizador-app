import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services";
import useAuthStore from "../store/useAuthStore";
import { can } from "../utils";

export const useUsers = (companyId?: string) => {
  const canFetch = useAuthStore((s) => s.getIsAuthenticated());
  const role = useAuthStore((s) => s.user?.role);

  return useQuery({
    queryKey: ["users", companyId ?? "all"],
    queryFn: ({ signal }) => getUsers(signal, companyId),
    enabled: canFetch && can(role, "users"),
    staleTime: 1000 * 60 * 2,
  });
};
