import axios from "axios";
import { endpoints } from "./apis";

import { store } from "../config/store";
import { setUser } from "../slices/authSlice";

export const axiosInstance = axios.create({
  withCredentials: true, // CRITICAL: Sends cookies with every request
  headers: {
    "Content-Type": "application/json",
  },
});

// Simple response interceptor for handling 401 errors
axiosInstance.interceptors.response.use(
  (response) => response, // If successful, just return response
  
  async (error) => {
    const originalRequest = error.config;

    // 🔒 Prevent endless refresh loop
    if (originalRequest.url.includes(endpoints.REFRESHACCESSTOKEN_API)) {
      localStorage.removeItem('persist:root');
      window.location.href = "/login";
      return Promise.reject(error);
    }

    // If we get 401 and haven't tried to refresh yet
    if (error.response?.status === 401 && !originalRequest._isRetry) {
      originalRequest._isRetry = true; // Mark that we tried once

      try {
        // Try to refresh the token
        const refreshResponse = await axiosInstance.post(endpoints.REFRESHACCESSTOKEN_API);
        
        // If refresh succeeds, retry the original request
        if (refreshResponse.data.success) {
          console.log("✅ Token refreshed successfully");
          return axiosInstance(originalRequest);
        }
        
      } catch (refreshError) {
        // If refresh fails, clear state and redirect to login
        console.log("❌ Refresh token expired - redirecting to login");
        
        // Clear Redux state
        store.dispatch(setUser(null));
        localStorage.removeItem('persist:root');
        
        // Redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // For any other error, just reject
    return Promise.reject(error);
  }
);


// Simple API connector function
export const apiConnector = (method, url, bodyData, headers, params) => {
  return axiosInstance({
    method: method,
    url: url,
    data: bodyData || null,
    headers: headers || null,
    params: params || null,
    withCredentials: true, // 🔥 This ensures cookies are actually sent
  });
};