import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { settingsEndpoints } from "../apis"
import { setUser } from "../../slices/authSlice"
import { persistor } from "../../config/store"

const { UPDATE_PROFILE_API, CHANGEPASSWORD_API, DELETE_ACCOUNT_API } = settingsEndpoints

export function updateProfile(formData) {
    return async (dispatch) => {
        const toastId = toast.loading("Updating profile...")
        try {
            const response = await apiConnector(
                "PUT", 
                UPDATE_PROFILE_API, 
                formData,
                {
                    "Content-Type": "multipart/form-data",
                }
            )
            
            console.log("UPDATE PROFILE API RESPONSE:", response)
            // console.log("USER DATA FROM BACKEND:", response.data.user)

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            dispatch(setUser(response.data.user));
           // Force persist to save immediately
            await persistor.flush()

            toast.success("Profile updated successfully!")
            
            return { success: true }
        } catch (error) {
            console.error("ERROR UPDATING PROFILE:", error)
            toast.error(error.response?.data?.message || "Could not update profile")
            return { success: false }
        } finally {
            toast.dismiss(toastId)
        }
    }
}

export function changePassword(passwordData){
    return async(dispatch) => {
        const toastId = toast.loading("Loading...");
        try{
            const response = await apiConnector("PUT", CHANGEPASSWORD_API, passwordData);
            console.log("CHANGEPASSWORD API RESPONSE...", response);
            console.log(response.data.success);

            if (!response.data.success) {
                throw new Error(response.data.message)
            }

            toast.success("Password is updated successfully", {duration: 3000});
            return { success: true }
        }
        catch (error) {
            console.error("ERROR UPDATING Password:", error)
            toast.error(error.response?.data?.message || "Could not update password")
            return { success: false }
        } finally {
            toast.dismiss(toastId)
        }
    }
}

export function deleteAccount(password , navigate) {
  return async (dispatch) => {
    const toastId = toast.loading("Deleting Account...");

    try {
      const response = await apiConnector("DELETE", DELETE_ACCOUNT_API, { password });
      
      if (!response.data.success) {
        throw new Error(response.data.message);
      }
      
      // Clear Redux state
      dispatch(setUser(null));
      
      // Clear persisted storage
      localStorage.removeItem('persist:root');
      toast.success("Account Deleted Successfully!");
      
     navigate("/signup");
      
    } catch (error) {
      console.error("DELETE ACCOUNT ERROR:", error);
      
      // specific error message from backend
      const errorMessage = error.response?.data?.message || "Cannot delete the account. Please try again!";
      toast.error(errorMessage);
      
      // DO NOT clear state on error - user should remain logged in if deletion fails
      
    } finally {
      toast.dismiss(toastId);
    }
  };
}