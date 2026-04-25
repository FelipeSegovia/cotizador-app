import { useQuery } from "@tanstack/react-query";
import { getQuotations } from "../services";

export const useQuotations = () => {
  return useQuery({
    queryKey: ["quotations"],
    queryFn: ({ signal }) => getQuotations({ signal }),
  });
};
