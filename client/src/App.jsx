import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { useNotificationStore } from './store/notificationStore';
import { initSocket, getSocket } from './services/socket';

// Components
import AppShell from './components/AppShell';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import LandingPage from './pages';
import LoginPage from './pages/login';
import RegisterPage from './pages/register';
import DashboardPage from './pages/dashboard';
import ComplaintsListPage from './pages/complaints';
import CreateComplaintPage from './pages/complaints/create';
import ComplaintDetailsPage from './pages/complaints/[id]';
import UsersManagementPage from './pages/users';
import DepartmentsPage from './pages/departments';
import CategoriesPage from './pages/categories';
import ReportsPage from './pages/reports';
import NotificationsPage from './pages/notifications';
import SettingsPage from './pages/settings';

const App = () => {
  const { user, token, fetchMe } = useAuthStore();
  const { addLiveNotification, fetchNotifications } = useNotificationStore();

  useEffect(() => {
    if (token) {
      fetchMe();
      fetchNotifications();
      const socket = initSocket(token);

      if (socket) {
        socket.on('notification', (notif) => {
          addLiveNotification(notif);
        });
      }
    }
  }, [token]);

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LandingPage />} />
        <Route
          path="/login"
          element={token && user ? <Navigate to="/dashboard" replace /> : <LoginPage />}
        />
        <Route
          path="/register"
          element={token && user ? <Navigate to="/dashboard" replace /> : <RegisterPage />}
        />

        {/* Protected Dashboard Shell */}
        <Route
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/complaints" element={<ComplaintsListPage />} />
          <Route
            path="/complaints/create"
            element={
              <ProtectedRoute allowedRoles={['student', 'admin']}>
                <CreateComplaintPage />
              </ProtectedRoute>
            }
          />
          <Route path="/complaints/:id" element={<ComplaintDetailsPage />} />

          {/* Admin Only Routes */}
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <UsersManagementPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/departments"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DepartmentsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categories"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <CategoriesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          {/* Shared Protected Routes */}
          <Route path="/notifications" element={<NotificationsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Route>

        {/* 404 Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
