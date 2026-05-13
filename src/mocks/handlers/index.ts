import { quotationHandlers } from "./quotations";
import { authHandlers } from "./auth";
import { companyHandlers } from "./company";

export const handlers = [...authHandlers, ...companyHandlers, ...quotationHandlers];
