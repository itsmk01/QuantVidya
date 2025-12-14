import { toast } from "react-hot-toast"
import {apiConnector} from '../apiconnector';
import { categoriesEndpoint } from "../apis"


const { CATALOG_PAGE_API, COURSE_CATEGORIES_API } = categoriesEndpoint;

export const getCatalogPageData = async (categoryName) => {
//   const toastId = toast.loading("Loading...")
  let result = []
  try {
    const response = await apiConnector(
      "POST",
      CATALOG_PAGE_API,
      {categoryName }
    )
    // console.log("CATALOG PAGE DATA API RESPONSE............", response);
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Category page data")
    }
    
    result = response?.data?.data
    // toast.success("Catalog data loaded successfully")
  } catch (error) {
    console.log("CATALOG PAGE DATA API ERROR............", error)
    toast.error(error.message)
    result = error.response?.data
  }
  
//   toast.dismiss(toastId)
  return result
}

// fetching the available course categories
export const fetchCourseCategories = async () => {
  let result = []
  try {
    const response = await apiConnector("GET", COURSE_CATEGORIES_API)
    // console.log("COURSE_CATEGORIES_API API RESPONSE............", response)
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch Course Categories")
    }
    result = response?.data
  } catch (error) {
    console.log("COURSE_CATEGORY_API API ERROR............", error)
    toast.error(error.message)
  }
  return result
}

export const getAllCourses = async () => {
  const toastId = toast.loading("Loading...")
  let result = []
  
  try {
    const response = await apiConnector("GET", catalogData.ALL_COURSES_API)
    
    if (!response?.data?.success) {
      throw new Error("Could Not Fetch All Courses")
    }
    
    result = response?.data?.data
    toast.success("All courses loaded successfully")
  } catch (error) {
    console.log("GET ALL COURSES API ERROR............", error)
    toast.error(error.message)
  }
  
  toast.dismiss(toastId)
  return result
}