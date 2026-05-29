const endpoints = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  GET_CURRENT_USER: "/api/auth/me",
  CHANGE_PASSWORD: "/api/auth/me/password",
  COMPANY: "/api/company",
  QUOTATIONS: "/api/quotations",
  USERS: "/api/users",
  USER_BY_ID: (id: string) => `/api/users/${id}`,
  USER_TOGGLE_STATUS: (id: string) => `/api/users/${id}/status`,
  USER_RESEND_PASSWORD: (id: string) => `/api/users/${id}/resend-password`,
  FEEDBACK: "/api/feedback",
  FEEDBACK_PRIORITY: (id: string) => `/api/feedback/${id}/priority`,
};

export default endpoints;
