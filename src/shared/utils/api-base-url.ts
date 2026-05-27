/** MSW activo solo en dev cuando `VITE_MSW_ENABLED=true` (ver `src/main.tsx`). */
export const isMswEnabled = (): boolean =>
  import.meta.env.DEV && import.meta.env.VITE_MSW_ENABLED === "true";

/** Base del API para `fetch`; vacío = mismo origen que la app (MSW en dev, proxy en Netlify). */
export const getApiBaseUrl = (): string => {
  const raw = import.meta.env.VITE_BASE_URL_API;
  if (raw == null || raw === "") {
    return "";
  }
  const s = String(raw);
  if (s === "undefined") {
    return "";
  }
  const base = s.replace(/\/+$/, "");

  // Evita mixed content: página HTTPS no puede llamar a un API HTTP explícito.
  if (
    typeof window !== "undefined" &&
    window.location.protocol === "https:" &&
    base.startsWith("http://")
  ) {
    return "";
  }

  return base;
};
