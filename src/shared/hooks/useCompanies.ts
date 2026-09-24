import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createCompany, getCompanies } from "../services";
import type { CompanyWriteDto } from "../types/company";
import useAuthStore from "../store/useAuthStore";
import { can } from "../utils";

export const useCompanies = () => {
  const canFetch = useAuthStore((s) => s.getIsAuthenticated());
  const role = useAuthStore((s) => s.user?.role);

  return useQuery({
    queryKey: ["companies"],
    queryFn: ({ signal }) => getCompanies(signal),
    enabled: canFetch && can(role, "companies"),
    staleTime: 1000 * 60 * 2,
  });
};

export const useCreateCompany = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CompanyWriteDto) => createCompany(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["companies"] });
    },
  });
};
