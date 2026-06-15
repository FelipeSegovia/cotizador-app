const endpoints = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  GET_CURRENT_USER: "/api/auth/me",
  CHANGE_PASSWORD: "/api/auth/me/password",
  FORGOT_PASSWORD: "/api/auth/forgot-password",
  VERIFY_RESET_CODE: "/api/auth/verify-reset-code",
  RESET_PASSWORD: "/api/auth/reset-password",
  COMPANY: "/api/company",
  COMPANY_TERMS: "/api/company/terms",
  QUOTATIONS: "/api/quotations",
  USERS: "/api/users",
  USER_BY_ID: (id: string) => `/api/users/${id}`,
  USER_TOGGLE_STATUS: (id: string) => `/api/users/${id}/status`,
  USER_RESEND_PASSWORD: (id: string) => `/api/users/${id}/resend-password`,
  FEEDBACK: "/api/feedback",
  FEEDBACK_PRIORITY: (id: string) => `/api/feedback/${id}/priority`,
};

export default endpoints;
