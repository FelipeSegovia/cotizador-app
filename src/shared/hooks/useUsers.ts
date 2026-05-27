import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../services";
import useAuthStore from "../store/useAuthStore";

export const useUsers = () => {
  const canFetch = useAuthStore((s) => s.getIsAuthenticated());
  const role = useAuthStore((s) => s.user?.role);

  return useQuery({
    queryKey: ["users"],
    queryFn: ({ signal }) => getUsers(signal),
    enabled: canFetch && role === "admin",
    staleTime: 1000 * 60 * 2,
  });
};
