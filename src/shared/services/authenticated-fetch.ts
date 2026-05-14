import { readValidAccessToken } from "../store/useAuthStore";
import { getApiBaseUrl } from "../utils";

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
  return fetch(url, { ...init, headers });
}
