import './App.css'
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import SignUp from './pages/SignUp'
import NavBar from './components/common/NavBar'
import LogIn from './pages/LogIn'
import ForgotPassword from './pages/ForgotPassword'
import VerifyEmail from './pages/VerifyEmail'
import UpdatePassword from './pages/UpdatePassword'
import Cart from './components/core/Dashboard/Cart'
import MyProfile from './components/core/Dashboard/MyProfile'
import Dashboard from './pages/Dashboard'
import { useDispatch } from 'react-redux'
import { useEffect } from 'react'
import { useSelector } from 'react-redux';
import {
  ProtectedRoute,
  OpenRoute,
  StudentRoute,
  InstructorRoute,
  AdminRoute,
} from "./components/core/Auth/ProtectedRoute";
import { getUserDetails } from "./services/operations/authAPI";

function App() {

  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  
  return (
    <div className='w-screen min-h-screen flex flex-col bg-richblack-900'>
      <NavBar/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/signup' element={<OpenRoute><SignUp/></OpenRoute>}/>
        <Route path='/login' element={<OpenRoute><LogIn/></OpenRoute>} />
        <Route path='/verify-email' element={<OpenRoute><VerifyEmail/></OpenRoute>} />
        <Route path='/forgot-password' element={<OpenRoute><ForgotPassword/></OpenRoute>} />
        <Route path="/update-password/:token" element={<OpenRoute><UpdatePassword /></OpenRoute>} />
        <Route path='/dashboard/cart' element={<ProtectedRoute><Cart/></ProtectedRoute>} />

        {/* Protected Routes (Any authenticated user) */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        >
          <Route path="my-profile" element={<MyProfile />} />
        </Route>

        {/* Error Routes */}
        {/* <Route path="/unauthorized" element={<Unauthorized />} /> */}
        <Route path="*" element={<div className='text-white flex h-screen pb-30 text-3xl justify-center items-center'>404 - Page Not Found</div>} />

      </Routes>
    </div>
  )
}

export default App
