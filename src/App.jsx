import "./App.css";
import { useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/SignUp";
import NavBar from "./components/common/NavBar";
import LogIn from "./pages/LogIn";
import ForgotPassword from "./pages/ForgotPassword";
import VerifyEmail from "./pages/VerifyEmail";
import UpdatePassword from "./pages/UpdatePassword";
import Cart from "./components/core/Dashboard/Cart";
import MyProfile from "./components/core/Dashboard/MyProfile";
import Dashboard from "./pages/Dashboard";
import Catalog from "./pages/Catalog";
import {
  ProtectedRoute,
  StudentRoute,
  InstructorRoute,
  OpenRoute,
} from "./components/core/Auth/ProtectedRoute";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import AddCourse from "./components/core/Dashboard/AddCourse/index";
import Settings from "./components/core/Dashboard/Settings/index";
import MyCourses from "./components/core/Dashboard/MyCourses";
import InstructorDashboard from "./components/core/Dashboard/InstructorDashboard";
import EditCourse from "./components/core/Dashboard/EditCourse";
import CourseDetails from "./pages/CourseDetails";
import ViewCourse from "./pages/ViewCourse";
import VideoDetails from "./components/core/ViewCourse/VideoDetails";

function App() {
  return (
    <div className="w-screen min-h-screen flex flex-col bg-richblack-900">
      <NavBar />

      <div className="mt-14">
        <Routes>
          {/** =====================
               PUBLIC ROUTES
          ====================== */}
          <Route path="/" element={<Home />} />
          <Route path="/update-password/:token" element={<UpdatePassword />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<ContactUs />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/catalog/:catalogName" element={<Catalog />} />
          <Route path="/courses/:courseId" element={<CourseDetails />} />
          <Route
            path="/signup"
            element={
              <OpenRoute>
                <SignUp />
              </OpenRoute>
            }
          />
          <Route
            path="/login"
            element={
              <OpenRoute>
                <LogIn />
              </OpenRoute>
            }
          />
          <Route
            path="/verify-email"
            element={
              <OpenRoute>
                <VerifyEmail />
              </OpenRoute>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <OpenRoute>
                <ForgotPassword />
              </OpenRoute>
            }
          />
          // In your main router file
          <Route path="/view-course/:courseId" element={<ViewCourse />}>
            <Route
              path="section/:sectionId/sub-section/:subSectionId"
              element={<VideoDetails />}
            />
          </Route>
          {/** =====================
               PROTECTED ROUTES
          ====================== */}
          <Route
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard/my-profile" element={<MyProfile />} />
            <Route
              path="/dashboard/enrolled-courses"
              element={<EnrolledCourses />}
            />
            <Route path="/dashboard/settings" element={<Settings />} />

            {/** Instructor Routes */}
            <Route
              path="/dashboard/instructor"
              element={
                <InstructorRoute>
                  <InstructorDashboard />
                </InstructorRoute>
              }
            />

            <Route
              path="/dashboard/add-course"
              element={
                <InstructorRoute>
                  <AddCourse />
                </InstructorRoute>
              }
            />

            <Route
              path="/dashboard/my-courses"
              element={
                <InstructorRoute>
                  <MyCourses />
                </InstructorRoute>
              }
            />

            <Route
              path="/dashboard/edit-course/:courseId"
              element={
                <InstructorRoute>
                  <EditCourse />
                </InstructorRoute>
              }
            />

            <Route
              path="/dashboard/cart"
              element={
                <StudentRoute>
                  <Cart />
                </StudentRoute>
              }
            />
          </Route>
          {/** Fallback Route */}
          <Route
            path="*"
            element={
              <div className="text-white flex h-screen pb-30 text-3xl justify-center items-center">
                404 - Page Not Found
              </div>
            }
          />
        </Routes>
      </div>
    </div>
  );
}

export default App;
