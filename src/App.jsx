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
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import {
  ProtectedRoute,
  OpenRoute,
  StudentRoute,
  InstructorRoute,
  AdminRoute,
} from "./components/core/Auth/ProtectedRoute";
import About from "./pages/About";
import ContactUs from "./pages/ContactUs";
import EnrolledCourses from "./components/core/Dashboard/EnrolledCourses";
import AddCourse from "./components/core/Dashboard/AddCourse/index"
import Settings from "./components/core/Dashboard/Settings/index";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="w-screen min-h-screen flex flex-col bg-richblack-900">
      <NavBar />
      <Routes>
        <Route path="/" element={<Home />} />
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
        <Route
          path="/update-password/:token"
          element={
            <OpenRoute>
              <UpdatePassword />
            </OpenRoute>
          }
        />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactUs />} />

        <Route
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          {/* Protected Routes (Any authenticated user) */}
          <Route path="/dashboard/my-profile" element={<MyProfile />} />
          <Route path="/dashboard/enrolled-courses" element={<EnrolledCourses />} />
          <Route path="/dashboard/cart" element={<Cart />} />
          <Route path="/dashboard/settings" element={<Settings/>} />
          {/* <Route path="/dashboard/instructor" element={<InstructorRoute><InstructorDashboard/></InstructorRoute>} /> */}
          <Route path="/dashboard/add-course" element={<InstructorRoute><AddCourse/></InstructorRoute>} />
        </Route>

        {/* Error Routes */}
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
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
