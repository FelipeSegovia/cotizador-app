import { quotationHandlers } from "./quotations";
import { authHandlers } from "./auth";
import { companyHandlers } from "./company";
import { userHandlers } from "./users";

export const handlers = [
  ...authHandlers,
  ...companyHandlers,
  ...quotationHandlers,
  ...userHandlers,
];
