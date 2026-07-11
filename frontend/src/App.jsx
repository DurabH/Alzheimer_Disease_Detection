import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import AppLayout from "./components/AppLayout";
import AdminLayout from "./components/AdminLayout";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";

const Login = lazy(() => import("./pages/Login"));
const Signup = lazy(() => import("./pages/Signup"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const UploadMRI = lazy(() => import("./pages/UploadMRI"));
const CognitiveTest = lazy(() => import("./pages/CognitiveTest"));
const Results = lazy(() => import("./pages/Results"));
const Profile = lazy(() => import("./pages/Profile"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminUsers = lazy(() => import("./pages/admin/AdminUsers"));
const AdminReports = lazy(() => import("./pages/admin/AdminReports"));
const AdminAnalytics = lazy(() => import("./pages/admin/AdminAnalytics"));
const AdminInquiries = lazy(() => import("./pages/admin/AdminInquiries"));
const UserInquiries = lazy(() => import("./pages/UserInquiries"));

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Suspense fallback={<div className="flex h-screen items-center justify-center">Loading...</div>}>
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />

                  {/* Patient/User Protected Routes */}
                  <Route path="/dashboard" element={<ProtectedRoute><AppLayout><Dashboard /></AppLayout></ProtectedRoute>} />
                  <Route path="/upload-mri" element={<ProtectedRoute><AppLayout><UploadMRI /></AppLayout></ProtectedRoute>} />
                  <Route path="/cognitive-test" element={<ProtectedRoute><AppLayout><CognitiveTest /></AppLayout></ProtectedRoute>} />
                  <Route path="/results" element={<ProtectedRoute><AppLayout><Results /></AppLayout></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><AppLayout><Profile /></AppLayout></ProtectedRoute>} />
                  <Route path="/inquiries" element={<ProtectedRoute><AppLayout><UserInquiries /></AppLayout></ProtectedRoute>} />

                  {/* Admin Routes */}
                  <Route path="/admin" element={<AdminRoute><AdminLayout><AdminDashboard /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/users" element={<AdminRoute><AdminLayout><AdminUsers /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/reports" element={<AdminRoute><AdminLayout><AdminReports /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/analytics" element={<AdminRoute><AdminLayout><AdminAnalytics /></AdminLayout></AdminRoute>} />
                  <Route path="/admin/inquiries" element={<AdminRoute><AdminLayout><AdminInquiries /></AdminLayout></AdminRoute>} />

                  {/* Fallback */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Suspense>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;