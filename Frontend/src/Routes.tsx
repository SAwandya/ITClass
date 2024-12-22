import React from "react";
import { Route, Routes, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoutes"; // Role-based protection
import { useAuth } from "./AuthContext";

// Pages
import Login from "../src/pages/Login";
import Dashboard from "../src/pages/StudentDashboard";
import AdminPage from "../src/pages/StudentDashboard";
import InstructorPage from "../src/pages/StudentDashboard";
import NotFound from "../src/pages/NotFound";
import Profile from "../src/pages/StudentProfile"; // Make sure to import the correct profile component
import InstructorRegister from "./pages/InstructorCreate";
import CreateBatch from "./pages/BatchCreate";
import ExamCreate from "./pages/ExamCreate";
import StudentProfile from "../src/pages/StudentProfile";
import Register from "../src/pages/Register";
import AddResult from "./pages/AddResult";

const AppRoutes = () => {
  const { role } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/instructor" element={<InstructorRegister />} />
      <Route path="/register" element={<Register />} />
      <Route path="/addresult" element={<AddResult />} />

      {/* Role-Specific Protected Routes */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/instructor"
        element={
          <ProtectedRoute allowedRoles={["instructor"]}>
            <InstructorPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/batch-create"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <CreateBatch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/exam-create"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <ExamCreate />
          </ProtectedRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <ProtectedRoute allowedRoles={["student"]}>
            <StudentProfile />
          </ProtectedRoute>
        }
      />

      {/* Catch-All Route */}
      <Route path="*" element={<NotFound />} />

      {/* Redirect Based on Role */}
      <Route
        path="/"
        element={
          role === "admin" ? (
            <Navigate to="/admin" />
          ) : role === "instructor" ? (
            <Navigate to="/instructor" />
          ) : role === "student" ? (
            <Navigate to="/student" />
          ) : (
            <Navigate to="/dashboard" />
          )
        }
      />
    </Routes>
  );
};

export default AppRoutes;
