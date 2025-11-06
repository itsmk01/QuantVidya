import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { settingsEndpoints } from "../apis"
import { setUser } from "../../slices/authSlice"
import { persistor } from "../../config/store"

const { UPDATE_PROFILE_API } = settingsEndpoints

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