// components/core/Auth/ProtectedRoute.jsx
import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

// ============================================
// GENERAL PROTECTED ROUTE
// ============================================
export function ProtectedRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

// ============================================
// ROLE-BASED PROTECTED ROUTES
// ============================================

// Student Only Route
export function StudentRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.accountType !== "Student") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Instructor Only Route
export function InstructorRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.accountType !== "Instructor") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Admin Only Route
export function AdminRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.accountType !== "Admin") {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// ============================================
// OPEN ROUTE (Redirect logged-in users)
// ============================================
export function OpenRoute({ children }) {
  const { user } = useSelector((state) => state.auth);

  if (user) {
    return <Navigate to="/dashboard/my-profile" replace />;
  }

  return children;
}
