const BASE_URL = import.meta.env.VITE_BASE_URL;

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/send-otp",
  VERIFYOTP_API: BASE_URL + "/auth/verify-otp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  LOGOUT_API: BASE_URL + "/auth/logout",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
  GETUSER_API: BASE_URL + "/auth/me",
  REFRESHACCESSTOKEN_API: BASE_URL + "/auth/refresh-token",
}

// CONTACT US ENDPOINTS
export const userEndpoints = {
  CONTACT_US_API: BASE_URL + "/user/contact-us/submit",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  GETALLCATEGORY_API: BASE_URL + "/course/getAllCategories",
}