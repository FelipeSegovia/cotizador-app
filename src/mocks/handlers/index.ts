import { quotationHandlers } from "./quotations";
import { authHandlers } from "./auth";

export const handlers = [...authHandlers, ...quotationHandlers];
