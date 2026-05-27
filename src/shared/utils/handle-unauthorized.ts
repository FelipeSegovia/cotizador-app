import { PATHS } from "../data";
import useAuthStore from "../store/useAuthStore";

let isHandlingUnauthorized = false;

export const handleUnauthorizedResponse = (): void => {
  if (typeof window === "undefined" || isHandlingUnauthorized) {
    return;
  }

  isHandlingUnauthorized = true;
  useAuthStore.getState().logout();

  if (window.location.pathname !== PATHS.LOGIN) {
    window.location.assign(PATHS.LOGIN);
  }

  window.setTimeout(() => {
    isHandlingUnauthorized = false;
  }, 500);
};
