import { endpoints } from "../data";
import { readValidAccessToken } from "../store/useAuthStore";

/** fetch a `/api/quotations` + pathSuffix, con Bearer si hay token válido. */
export async function quotationFetch(
  pathSuffix: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = readValidAccessToken();
  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${import.meta.env.VITE_BASE_URL_API}${endpoints.QUOTATIONS}${pathSuffix}`;
  return fetch(url, { ...init, headers });
}
