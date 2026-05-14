import { endpoints } from "../data";
import type { User } from "../types/auth";
import { getApiBaseUrl, parseAuthMeResponse } from "../utils";

type GetCurrentUserParams = {
  signal?: AbortSignal;
};

const getCurrentUser = async (
  token: string,
  params: GetCurrentUserParams = {},
): Promise<User> => {
  const { signal } = params;
  const response = await fetch(
    `${getApiBaseUrl()}${endpoints.GET_CURRENT_USER}`,
    {
      method: "GET",
      signal,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );

  if (!response.ok) {
    throw new Error("No autorizado");
  }

  const json: unknown = await response.json();
  return parseAuthMeResponse(json);
};

export default getCurrentUser;
