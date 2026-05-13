import { endpoints } from "../data";
import type { UpdateCurrentUserDto, User } from "../types/auth";
import fetchErrorMessage from "../utils/fetch-error-message";
import { parseAuthMeResponse } from "../utils";
import { authenticatedFetch } from "./authenticated-fetch";

export const updateCurrentUser = async (
  body: UpdateCurrentUserDto,
): Promise<User> => {
  const res = await authenticatedFetch(endpoints.GET_CURRENT_USER, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: body.name.trim(),
      mobilePhone: body.mobilePhone.trim(),
    }),
  });

  if (!res.ok) {
    const message = await fetchErrorMessage(
      res,
      "No se pudo guardar el perfil",
    );
    throw new Error(message);
  }

  const json: unknown = await res.json();
  return parseAuthMeResponse(json);
};
