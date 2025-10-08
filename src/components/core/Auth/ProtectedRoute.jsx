import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"

export default function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.profile)

  if (!user) return <Navigate to="/login" replace />
  return children
}
