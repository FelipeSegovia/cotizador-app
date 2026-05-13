import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import getCurrentUser from "../services/get-current-user";
import useAuthStore, { readValidAccessToken } from "../store/useAuthStore";

export const useCurrentUser = () => {
  const tokenFromStore = useAuthStore((s) => s.token);
  const setUser = useAuthStore((s) => s.setUser);
  const hasSession = Boolean(readValidAccessToken() || tokenFromStore);

  const query = useQuery({
    queryKey: ["currentUser"],
    queryFn: async ({ signal }) => {
      const token = readValidAccessToken();
      if (!token) {
        throw new Error("Sin sesión");
      }
      return getCurrentUser(token, { signal });
    },
    enabled: hasSession,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    retryDelay: (attempt) => Math.min(500 * 2 ** attempt, 3000),
  });

  useEffect(() => {
    if (query.data) {
      setUser(query.data);
    }
  }, [query.data, setUser]);

  return query;
};
