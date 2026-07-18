import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicRoute, PrivateRoute, RoleRoute } from './Guards';
import Layout from '../components/Layout';
import LandingPage from '../pages/LandingPage';
import AuthPage from '../pages/AuthPage';
import ForgotPasswordPage from '../pages/ForgotPasswordPage';
import ResetPasswordPage from '../pages/ResetPasswordPage';
import DashboardPage from '../pages/DashboardPage';
import ProjectListPage from '../pages/ProjectListPage';
import ProjectDetailPage from '../pages/ProjectDetailPage';
import ProjectFormPage from '../pages/ProjectFormPage';
import TaskListPage from '../pages/TaskListPage';
import TaskDetailPage from '../pages/TaskDetailPage';
import TaskFormPage from '../pages/TaskFormPage';
import UserListPage from '../pages/UserListPage';
import UserFormPage from '../pages/UserFormPage';
import NotificationPage from '../pages/NotificationPage';
import ProfilePage from '../pages/ProfilePage';
import ActivityLogPage from '../pages/ActivityLogPage';
import Error401Page from '../pages/Error401Page';
import Error403Page from '../pages/Error403Page';
import Error404Page from '../pages/Error404Page';
import Error500Page from '../pages/Error500Page';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
      <Route path="/login" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><AuthPage /></PublicRoute>} />
      <Route path="/forgot-password" element={<PublicRoute><ForgotPasswordPage /></PublicRoute>} />
      <Route path="/reset-password" element={<PublicRoute><ResetPasswordPage /></PublicRoute>} />

      {/* Private routes with layout */}
      <Route path="/dashboard" element={<PrivateRoute><Layout><DashboardPage /></Layout></PrivateRoute>} />
      <Route path="/projects" element={<PrivateRoute><Layout><ProjectListPage /></Layout></PrivateRoute>} />
      <Route path="/projects/new" element={<PrivateRoute><Layout><ProjectFormPage /></Layout></PrivateRoute>} />
      <Route path="/projects/:id" element={<PrivateRoute><Layout><ProjectDetailPage /></Layout></PrivateRoute>} />
      <Route path="/projects/:id/edit" element={<PrivateRoute><Layout><ProjectFormPage /></Layout></PrivateRoute>} />
      <Route path="/tasks" element={<PrivateRoute><Layout><TaskListPage /></Layout></PrivateRoute>} />
      <Route path="/tasks/new" element={<PrivateRoute><Layout><TaskFormPage /></Layout></PrivateRoute>} />
      <Route path="/tasks/:id" element={<PrivateRoute><Layout><TaskDetailPage /></Layout></PrivateRoute>} />
      <Route path="/tasks/:id/edit" element={<PrivateRoute><Layout><TaskFormPage /></Layout></PrivateRoute>} />
      <Route path="/notifications" element={<PrivateRoute><Layout><NotificationPage /></Layout></PrivateRoute>} />
      <Route path="/activity-log" element={<PrivateRoute><Layout><ActivityLogPage /></Layout></PrivateRoute>} />
      <Route path="/profile" element={<PrivateRoute><Layout><ProfilePage /></Layout></PrivateRoute>} />

      {/* Admin only */}
      <Route path="/users" element={<RoleRoute roles={['Admin']}><Layout><UserListPage /></Layout></RoleRoute>} />
      <Route path="/users/new" element={<RoleRoute roles={['Admin']}><Layout><UserFormPage /></Layout></RoleRoute>} />
      <Route path="/users/:id/edit" element={<RoleRoute roles={['Admin']}><Layout><UserFormPage /></Layout></RoleRoute>} />

      {/* Error pages */}
      <Route path="/401" element={<Error401Page />} />
      <Route path="/403" element={<Error403Page />} />
      <Route path="/404" element={<Error404Page />} />
      <Route path="/500" element={<Error500Page />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
