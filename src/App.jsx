import "./App.css";
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
import { useSelector } from "react-redux";
import {
  ProtectedRoute,
  StudentRoute,
  InstructorRoute,
  AdminRoute,
} from "./components/core/Auth/ProtectedRoute";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import AddCourse from "./components/core/Dashboard/AddCourse/index"
import Settings from "./components/core/Dashboard/Settings/index";
import MyCourses from "./components/core/Dashboard/MyCourses";
import InstructorDashboard from "./components/core/Dashboard/InstructorDashboard";
import EditCourse from "./components/core/Dashboard/EditCourse";

function App() {
  return (
    <div className="w-screen min-h-screen flex flex-col bg-richblack-900">
      <NavBar />

      <Routes>

        {/** =====================
             PUBLIC ROUTES
        ====================== */}
        <Route path="/" element={<Home />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<LogIn />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/update-password/:token" element={<UpdatePassword />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />


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
          <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />} />
          <Route path="/dashboard/cart" element={<Cart />} />
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
  );
}

export default App;
