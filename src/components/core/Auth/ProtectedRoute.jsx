// components/core/Auth/ProtectedRoute.jsx
import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

// ============================
// AUTH PROTECTED ROUTE
// ============================
export function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

// ============================
// INSTRUCTOR ONLY ROUTE
// ============================
export function InstructorRoute({ children }) {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.accountType !== "Instructor") {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// ============================
// STUDENT ONLY ROUTE
// ============================
export function StudentRoute({ children }) {
  const { user } = useSelector((state) => state.auth)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (user.accountType !== "Student") {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

// ============================
// OPEN ROUTE (Login / Signup)
// ============================
export function OpenRoute({ children }) {
  const { user } = useSelector((state) => state.auth)

  if (user) {
    return <Navigate to="/dashboard/my-profile" replace />
  }

  return children
}
