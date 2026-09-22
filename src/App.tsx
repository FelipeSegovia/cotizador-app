import { useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "sonner";
import AppRouter from "./AppRouter";
import useAuthStore from "./shared/store/useAuthStore";
import { useThemeStore } from "./shared/store";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false, // Todas las queries por defecto no van a tener retry
    },
  },
});

const App = () => {
  const { loadFromStorage } = useAuthStore();
  const theme = useThemeStore((state) => state.theme);

  useEffect(() => {
    // Cargar autenticación desde localStorage al montar la app
    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter />
      <Toaster richColors position="top-right" theme={theme} />
      <ReactQueryDevtools buttonPosition="bottom-left" initialIsOpen={false} />
    </QueryClientProvider>
  );
};

export default App;
