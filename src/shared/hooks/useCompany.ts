import { useQuery } from "@tanstack/react-query";
import { getCompany } from "../services";
import useAuthStore from "../store/useAuthStore";

export const useCompany = () => {
  const canFetch = useAuthStore((s) => s.getIsAuthenticated());

  return useQuery({
    queryKey: ["company"],
    queryFn: ({ signal }) => getCompany({ signal }),
    enabled: canFetch,
    staleTime: 1000 * 60 * 2,
  });
};
