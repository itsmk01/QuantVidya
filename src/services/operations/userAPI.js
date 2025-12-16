import { toast } from 'react-hot-toast';
import { apiConnector } from "../apiconnector";
import { userEndpoints } from "../apis";
import { setUser, setLoading } from '../../slices/authSlice';

const { CONTACT_US_API, GETUSER_API, GET_INSTRUCTOR_DATA_API , GET_USER_ENROLLED_COURSES } = userEndpoints;

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

// GET USER DETAILS (For page refresh)
export function getUserDetails() {
  return async (dispatch) => {
    dispatch(setLoading(true));

    try {
    const response = await apiConnector(
        "GET",
        GETUSER_API,
        null
    );

      
      if (response.data.success) {
        dispatch(setUser(response.data.userdetails));
      }
      
    } catch (error) {
      console.error("GET USER DETAILS ERROR:", error);
      // If 401, user is not authenticated - clear state
      if (error.response?.status === 401) {
        dispatch(setUser(null));
        localStorage.removeItem('persist:root');
      }
    } finally {
      dispatch(setLoading(false));
    }
  };
}

export const getInstructorData = async () => {
  let result = null
  // const toastId = toast.loading("Loading...")
  try {
    const response = await apiConnector("GET", GET_INSTRUCTOR_DATA_API, null)
    console.log("GET INSTRUCTOR DATA API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Update Lecture")
    }
    // toast.success("INSTRUCTOR Details Fetched")
    result = response?.data?.data
  } catch (error) {
    console.log("GET USER DETAILS API ERROR............", error)
    if (error.response && error.response.data && error.response.data.message) {
      toast.error(error.response.data.message, {duration: 3000});
    } 
    else {
      toast.error("Could not fetch instructor data.", {duration: 3000});
    }
  }
  // toast.dismiss(toastId)
  return result
}

export const getUserEnrolledCourses = async () => {
  // const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector("GET", GET_USER_ENROLLED_COURSES);
    // console.log("GET USER ENROLLED COURSES API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data?.data
  } catch (error) {
    console.log("GET_ALL_COURSE_API API ERROR............", error)
    toast.error(error.message)
  }
  // toast.dismiss(toastId)
  return result
}