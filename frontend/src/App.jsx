import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import DashboardLayout from './layouts/DashboardLayout';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Admin / Core Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import InventoryPage from './pages/admin/InventoryPage';
import DonorsPage from './pages/admin/DonorsPage';
import RecipientsPage from './pages/admin/RecipientsPage';
import HospitalsPage from './pages/admin/HospitalsPage';
import BloodRequestsPage from './pages/admin/BloodRequestsPage';
import BloodStockMapPage from './pages/admin/BloodStockMapPage';
import AnalyticsPage from './pages/admin/AnalyticsPage';
import EmergencyPage from './pages/admin/EmergencyPage';
import DonationCampsPage from './pages/admin/DonationCampsPage';
import AppointmentsPage from './pages/admin/AppointmentsPage';
import RewardsPage from './pages/admin/RewardsPage';
import ChatsPage from './pages/admin/ChatsPage';

// Role Dashboards
import DonorDashboard from './pages/donor/DonorDashboard';
import RecipientDashboard from './pages/recipient/RecipientDashboard';
import BloodBankDashboard from './pages/bloodbank/BloodBankDashboard';
import HospitalDashboard from './pages/hospital/HospitalDashboard';
import UserProfilePage from './pages/profile/UserProfilePage';

// Protected Route wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-teal-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Authenticated Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* Common / Admin Routes matching screenshot */}
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/inventory" element={<InventoryPage />} />
            <Route path="/admin/donors" element={<DonorsPage />} />
            <Route path="/admin/recipients" element={<RecipientsPage />} />
            <Route path="/admin/hospitals" element={<HospitalsPage />} />
            <Route path="/admin/chats" element={<ChatsPage />} />
            <Route path="/admin/requests" element={<BloodRequestsPage />} />
            <Route path="/admin/emergency" element={<EmergencyPage />} />
            <Route path="/admin/appointments" element={<AppointmentsPage />} />
            <Route path="/admin/rewards" element={<RewardsPage />} />
            <Route path="/admin/camps" element={<DonationCampsPage />} />
            <Route path="/admin/map" element={<BloodStockMapPage />} />
            <Route path="/admin/analytics" element={<AnalyticsPage />} />

            {/* Role Specific Routes */}
            <Route path="/donor/dashboard" element={<DonorDashboard />} />
            <Route path="/donor/appointments" element={<AppointmentsPage />} />

            <Route path="/recipient/dashboard" element={<RecipientDashboard />} />
            <Route path="/recipient/requests" element={<BloodRequestsPage />} />

            <Route path="/bloodbank/dashboard" element={<BloodBankDashboard />} />
            <Route path="/hospital/dashboard" element={<HospitalDashboard />} />

            <Route path="/profile" element={<UserProfilePage />} />
          </Route>

          {/* Fallback */}
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
