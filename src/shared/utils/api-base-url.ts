/** Base del API para `fetch`; vacío = mismo origen que la app (útil con MSW en dev). */
export const getApiBaseUrl = (): string => {
  const raw = import.meta.env.VITE_BASE_URL_API;
  if (raw == null || raw === "") {
    return "";
  }
  const s = String(raw);
  if (s === "undefined") {
    return "";
  }
  return s.replace(/\/+$/, "");
};
