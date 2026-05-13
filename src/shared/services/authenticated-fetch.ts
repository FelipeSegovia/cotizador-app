import { readValidAccessToken } from "../store/useAuthStore";

export async function authenticatedFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const token = readValidAccessToken();
  const headers = new Headers(init.headers);
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const url = `${import.meta.env.VITE_BASE_URL_API}${path}`;
  return fetch(url, { ...init, headers });
}
