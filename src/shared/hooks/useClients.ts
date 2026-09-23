import { useQuery } from "@tanstack/react-query";
import { getClients } from "../services";
import useAuthStore from "../store/useAuthStore";

export const useClients = () => {
  const canFetch = useAuthStore((s) => s.getIsAuthenticated());

  return useQuery({
    queryKey: ["clients"],
    queryFn: ({ signal }) => getClients(signal),
    enabled: canFetch,
    staleTime: 1000 * 60 * 2,
  });
};
