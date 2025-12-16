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
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/getInstructorData",
  GET_USER_ENROLLED_COURSES: BASE_URL + "/profile/enrolled-courses",
}

//SETTING ENDPOINTS
export const settingsEndpoints = {
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGEPASSWORD_API: BASE_URL + "/auth/change-password",
  DELETE_ACCOUNT_API: BASE_URL + "/profile/deleteAccount"
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS:
    BASE_URL + "/course/getFullCourseDetails",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED: BASE_URL + "/course/getAuthenticatedFullCourseDetails",
  UPDATE_COURSE_PROGRESS_API: BASE_URL + "/course/updateCourseProgress",
}

export const categoriesEndpoint = {
  CATALOG_PAGE_API: BASE_URL + "/course/getCategoryPageDetails",
  COURSE_CATEGORIES_API: BASE_URL + "/course/getAllCategories",
}

// STUDENTS ENDPOINTS
export const paymentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}