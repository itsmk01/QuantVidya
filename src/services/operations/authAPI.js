import {toast} from 'react-hot-toast';
import {persistor} from '../../config/store';
import {endpoints} from '../apis';
import { setLoading, setUser, setToken } from '../../slices/authSlice';
import { useSelector } from 'react-redux';
import {apiConnector} from '../apiconnector';
import { resetCourseState, setCourse, setEditCourse, setStep } from '../../slices/courseSlice';

const {
    SENDOTP_API,
    VERIFYOTP_API,
    SIGNUP_API,
    LOGIN_API,
    LOGOUT_API,
    RESETPASSTOKEN_API,
    RESETPASSWORD_API,
    GETUSER_API,
    REFRESHACCESSTOKEN_API,
} = endpoints;


export function sendOtp(email,purpose, navigate){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", SENDOTP_API, {
                email,
                purpose,
            });
            console.log("SENDOTP API RESPONSE............", response);
            console.log(response.data.success);

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("OTP Sent Successfully", {duration: 3000});
            navigate("/verify-email");
        }
        catch (error) {
            console.log("ERROR during SENDOTP............", error);

            // If backend sends a message, show it
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message, {duration: 3000});
            } 
            else {
                toast.error("Could not Send Otp. Please try again.", {duration: 3000});
            }
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function signUp(accountType,firstName,lastName,email,password,confirmPassword,otp,purpose,navigate){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const verifyOtp_response = await apiConnector("POST", VERIFYOTP_API, {
                email,
                otp,
                purpose,
            });
            console.log("VERIFY_OTP API RESPONSE............", verifyOtp_response);
            console.log(verifyOtp_response.data.success);

            if (!verifyOtp_response.data.success) {
                throw new Error(verifyOtp_response.data.message);
            }

            const signup_response = await apiConnector("POST", SIGNUP_API, {
                firstName,
                lastName,
                email,
                password,
                confirmPassword,
                accountType
            });
           
            console.log("SIGNUP API RESPONSE.........", signup_response);
            console.log(signup_response.data.success);

            if (!signup_response.data.success) {
                throw new Error(signup_response.data.message);
            }

            toast.success("Account Created Successfully", {duration: 3000});
            navigate("/login");
        }
        catch (error) {
            console.log("ERROR during SIGNUP............", error);

            // If backend sends a message, show it
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message, {duration: 3000});
            } 
            else {
                toast.error("Could not SignUp. Please try again.", {duration: 3000});
            }
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function logIn(email,password,navigate){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", LOGIN_API, {
                email,
                password,
            });
            
            console.log("LOGIN API RESPONSE............", response);
            console.log(response.data.success);

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            console.log("User : ", response.data.user);
            const userImage = response.data?.user?.additionalDetails?.image
                ? response.data.user.additionalDetails.image
                : `https://api.dicebear.com/5.x/initials/svg?seed=${response.data.user.firstName} ${response.data.user.lastName}`;
            
            const userData = { ...response.data.user, image: userImage };
            console.log
            // Set user in Redux
            dispatch(setUser(userData));

            toast.success("Logged In Successfully", {duration:3000});
            navigate("/dashboard/my-profile");
        }
        catch (error) {
            console.log("ERROR during LOGIN............", error);

            // If backend sends a message, show it
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message, {duration: 3000});
            } 
            else {
                toast.error("Could not login. Please try again.", {duration: 3000});
            }
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}

export function logout(navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Logging Out...");

    try {
      // Call backend logout (clears cookies)
      await apiConnector("POST", LOGOUT_API);
      
      // Clear Redux state
      dispatch(setUser(null));
      dispatch(resetCourseState());
      
      
      // Clear persisted storage
      localStorage.removeItem('persist:auth');
      localStorage.removeItem('persist:course');
      localStorage.removeItem('persist:cart');
      
      toast.success("Logged Out Successfully!");
      
      // Navigate to login
      navigate("/login");
      
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      
      // Even if backend fails, clear frontend state
      dispatch(setUser(null));
      dispatch(resetCourseState());

      // Clear persisted storage
      localStorage.removeItem('persist:auth');
      localStorage.removeItem('persist:course');
      
      navigate("/login");
      
      toast.error("Logged out locally");
    } finally {
      toast.dismiss(toastId);
    }
  };
}

export function getResetPasswordToken(email, setEmailSent, navigate){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        dispatch(setLoading(true));
        try{
            const response = await apiConnector("POST", RESETPASSTOKEN_API, {
                email,
            });
            console.log("RESETPASSWORDTOKEN API RESPONSE...", response);
            console.log(response.data.success);

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            setEmailSent(true);
            toast.success("Email Sent Successfully", {duration: 3000});
        }
        catch (error) {
            console.log("ERROR during RESETPASSWORDTOKEN............", error);

            // If backend sends a message, show it
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message, {duration: 3000});
            } 
            else {
                toast.error("Could not send reset password email. Please try again.", {duration: 3000});
            }
        }
        dispatch(setLoading(false));
        toast.dismiss(toastId);
    }
}


export function resetPassword(password, confirmPassword, token, navigate) {
  return async (dispatch, getState) => {
    const { user } = getState().auth   // ✅ FIX HERE

    const toastId = toast.loading("Loading...")
    dispatch(setLoading(true))

    try {
      const response = await apiConnector("PUT", RESETPASSWORD_API, {
        password,
        confirmPassword,
        token,
      })

      console.log("RESETPASSWORD API RESPONSE...", response)

      if (!response.data.success) {
        throw new Error(response.data.message)
      }

      toast.success("Password updated successfully", { duration: 3000 })

      // ✅ Navigate based on auth state
      if (!user) {
        navigate("/login")
      } else {
        navigate("/dashboard/settings")
      }

    } catch (error) {
      console.log("ERROR during RESETPASSWORD...", error)

      const errorMessage =
        error?.response?.data?.message ||
        "Could not reset password. Please try again."

      toast.error(errorMessage, { duration: 3000 })

      // Optional: still redirect
      if (!user) {
        navigate("/login")
      } else {
        navigate("/dashboard/settings")
      }

    } finally {
      dispatch(setLoading(false))
      toast.dismiss(toastId)
    }
  }
}
