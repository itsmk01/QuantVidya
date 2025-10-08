import './App.css'
import { Route, Routes } from "react-router-dom"
import Home from "./pages/Home"
import SignUp from './pages/SignUp'
import NavBar from './components/common/NavBar'
import LogIn from './pages/LogIn'
import ForgotPassword from './pages/ForgotPassword'
import OpenRoute from './components/core/Auth/OpenRoute'
import VerifyEmail from './pages/VerifyEmail'
import UpdatePassword from './pages/UpdatePassword'
import Cart from './components/core/Dashboard/Cart'
import MyProfile from './components/core/Dashboard/MyProfile'
import ProtectedRoute from './components/core/Auth/ProtectedRoute'

function App() {
  
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
        <Route path='/dashboard/my-profile' element={<ProtectedRoute><MyProfile/></ProtectedRoute>} />
      </Routes>
    </div>
  )
}

export default App
