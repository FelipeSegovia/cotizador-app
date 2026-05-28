import { quotationHandlers } from "./quotations";
import { authHandlers } from "./auth";
import { companyHandlers } from "./company";
import { userHandlers } from "./users";
import { feedbackHandlers } from "./feedback";

export const handlers = [
  ...authHandlers,
  ...companyHandlers,
  ...quotationHandlers,
  ...userHandlers,
  ...feedbackHandlers,
];
