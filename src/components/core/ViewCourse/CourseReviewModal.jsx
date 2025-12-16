import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { useSelector } from "react-redux"
import { FaTimes, FaStar } from "react-icons/fa"
import ReactStars from "react-rating-stars-component"
import { createRating } from "../../../services/operations/courseDetailsAPI"

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm()

  useEffect(() => {
    setValue("courseExperience", "")
    setValue("courseRating", 0)
  }, [])

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating)
  }

  const onSubmit = async (data) => {
    await createRating(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        review: data.courseExperience,
      },
      user
    )
    setReviewModal(false)
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid place-items-center overflow-auto bg-white/10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-xl border border-richblack-400 bg-richblack-800">
        {/* Modal Header */}
        <div className="flex items-center justify-between rounded-t-xl bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5 font-inter">Add Review</p>
          <button onClick={() => setReviewModal(false)}>
            <FaTimes className="text-2xl text-richblack-5" />
          </button>
        </div>
        {/* Modal Body */}
        <div className="p-6">
          <div className="flex items-center justify-center gap-x-4">
            <img
              src={user?.additionalDetails.image}
              alt={user?.firstName + "profile"}
              className="aspect-square w-[50px] rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-richblack-5 font-inter">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-300 font-inter">Posting Publicly</p>
            </div>
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col items-center"
          >
            <ReactStars
              count={5}
              onChange={ratingChanged}
              size={36}
              activeColor="#FFD700"
            />
            <div className="flex w-11/12 flex-col space-y-2">
              <label
                className="text-sm text-richblack-5 font-inter"
                htmlFor="courseExperience"
              >
                Add Your Experience <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Share your experience with the course"
                {...register("courseExperience", { required: true })}
                className="form-style resize-x-none min-h-[130px] w-full bg-richblack-700 text-richblack-5 rounded-lg p-3 border border-richblack-600 focus:border-yellow-50 outline-none"
              />
              {errors.courseExperience && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Please add your experience
                </span>
              )}
            </div>
            <div className="mt-6 flex w-11/12 justify-end gap-x-2">
              <button
                onClick={() => setReviewModal(false)}
                className="px-4 py-2 bg-richblack-700 hover:bg-richblack-600 text-richblack-5 rounded-lg font-medium transition-all duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-yellow-50 hover:bg-yellow-100 text-richblack-900 rounded-lg font-semibold transition-all duration-200"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}