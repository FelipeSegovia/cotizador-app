/**
 * Predicados MSW que coinciden aunque `fetch` use otro origen que la página
 * (p. ej. `VITE_BASE_URL_API` apuntando al backend u otro host).
 */
export const mockApiPath = (absolutePath: string): string => {
  const path = absolutePath.startsWith("/")
    ? absolutePath
    : `/${absolutePath}`;
  return `*${path}`;
};
