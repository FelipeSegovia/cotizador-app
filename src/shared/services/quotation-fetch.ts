import { endpoints } from "../data";
import { readValidAccessToken } from "../store/useAuthStore";
import { getApiBaseUrl, handleUnauthorizedResponse } from "../utils";

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

  const url = `${getApiBaseUrl()}${endpoints.QUOTATIONS}${pathSuffix}`;
  const response = await fetch(url, { ...init, headers });

  if (response.status === 401) {
    handleUnauthorizedResponse();
  }

  return response;
}
