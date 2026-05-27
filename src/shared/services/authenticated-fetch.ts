import { readValidAccessToken } from "../store/useAuthStore";
import { getApiBaseUrl, handleUnauthorizedResponse } from "../utils";

export async function authenticatedFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = readValidAccessToken();
  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${getApiBaseUrl()}${path}`;
  const response = await fetch(url, { ...init, headers });

  if (response.status === 401) {
    handleUnauthorizedResponse();
  }

  return response;
}
