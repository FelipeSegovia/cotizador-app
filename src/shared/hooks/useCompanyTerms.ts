import { useQuery } from "@tanstack/react-query";
import { getCompanyTerms } from "../services";
import useAuthStore from "../store/useAuthStore";

export const useCompanyTerms = () => {
  const canFetch = useAuthStore((s) => s.getIsAuthenticated());

  return useQuery({
    queryKey: ["company-terms"],
    queryFn: ({ signal }) => getCompanyTerms({ signal }),
    enabled: canFetch,
    staleTime: 1000 * 60 * 2,
  });
};
