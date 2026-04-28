import { endpoints } from "../data";

const logout = async (token: string): Promise<void> => {
  await fetch(`${import.meta.env.VITE_BASE_URL_API}${endpoints.LOGOUT}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export default logout;
