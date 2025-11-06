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
  REFRESHACCESSTOKEN_API: BASE_URL + "/auth/refresh-token",
}

// CONTACT US ENDPOINTS
export const userEndpoints = {
  CONTACT_US_API: BASE_URL + "/user/contact-us/submit",
  GETUSER_API: BASE_URL + "/auth/me",
 
}

//SETTING ENDPOINTS
export const settingsEndpoints = {
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile"
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  GETALLCATEGORY_API: BASE_URL + "/course/getAllCategories",
}