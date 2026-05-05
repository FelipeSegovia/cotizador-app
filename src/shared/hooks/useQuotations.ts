import { useQuery } from "@tanstack/react-query";
import { getQuotations } from "../services";
import useAuthStore from "../store/useAuthStore";

export const useQuotations = () => {
  const canFetch = useAuthStore((s) => s.getIsAuthenticated());

  return useQuery({
    queryKey: ["quotations"],
    queryFn: ({ signal }) => getQuotations({ signal }),
    enabled: canFetch,
    // staleTime sirve para indicar cuánto tiempo los datos se consideran "frescos".
    // Durante este tiempo, React Query no volverá a ejecutar la consulta automáticamente al montar el componente
    //  o al cambiar la ventana. Esto es útil para evitar solicitudes innecesarias y mejorar el rendimiento de la aplicación.
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
};
