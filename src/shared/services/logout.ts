import { endpoints } from "../data";
import { getApiBaseUrl } from "../utils";

const logout = async (token: string): Promise<void> => {
  await fetch(`${getApiBaseUrl()}${endpoints.LOGOUT}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default logout;
