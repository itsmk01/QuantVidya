import { toast } from 'react-hot-toast';
import { apiConnector } from "../apiconnector";
import { userEndpoints } from "../apis";

const { CONTACT_US_API } = userEndpoints;

// Function to submit contact us form data
export function submitContactUs(data) {
    return async (dispatch) => {
        const toastId = toast.loading("Sending message...");
        
        try {
            const response = await apiConnector("POST", CONTACT_US_API, {
                firstName: data.firstname,
                lastName: data.lastname,
                email: data.email,
                phoneNumber: `${data.countrycode}-${data.phoneNo}`,
                message: data.message
            });
            
            console.log("CONTACT US API RESPONSE:", response);

            if (!response.data.success) {
                throw new Error(response.data.message);
            }

            toast.success(response.data.message || "Message sent successfully!", {
                duration: 3000
            });
            
            return { success: true };
        } catch (error) {
            console.error("ERROR during CONTACT US submission:", error);

            // Handle different error scenarios
            if (error.response?.data?.message) {
                toast.error(error.response.data.message, { duration: 3000 });
            } else {
                toast.error("Could not submit contact form. Please try again.", {
                    duration: 3000
                });
            }
            
            return { success: false };
        } finally {
            toast.dismiss(toastId);
        }
    };
}