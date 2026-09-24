import { quotationHandlers } from "./quotations";
import { authHandlers } from "./auth";
import { companyHandlers } from "./company";
import { userHandlers } from "./users";
import { invitationHandlers } from "./invitations";
import { feedbackHandlers } from "./feedback";
import { clientHandlers } from "./clients";

export const handlers = [
  ...authHandlers,
  ...companyHandlers,
  ...invitationHandlers,
  ...quotationHandlers,
  ...userHandlers,
  ...feedbackHandlers,
  ...clientHandlers,
];
