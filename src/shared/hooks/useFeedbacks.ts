import { useQuery } from "@tanstack/react-query";
import { getFeedbacks } from "../services";
import useAuthStore from "../store/useAuthStore";

export const useFeedbacks = () => {
  const canFetch = useAuthStore((s) => s.getIsAuthenticated());

  return useQuery({
    queryKey: ["feedbacks"],
    queryFn: ({ signal }) => getFeedbacks({ signal }),
    enabled: canFetch,
    staleTime: 1000 * 60 * 2,
  });
};
