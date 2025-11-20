import { Routes, Route } from 'react-router-dom';
import LoginPage from '../pages/LoginPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminITStaffPage from '../pages/admin/AdminITStaffPage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import NewRequestPage from '../pages/user/NewRequestPage';
import CategoriesPage from '../pages/user/CategoriesPage';
import ITRequestsPage from '../pages/it/ITRequestspage';
import ProtectedRoute from './ProtectedRoute';

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}><AdminDashboard /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}><AdminUsersPage /></ProtectedRoute>} />
      <Route path="/admin/itstaff" element={<ProtectedRoute allowedRoles={['ROLE_ADMIN']}><AdminITStaffPage /></ProtectedRoute>} />
      <Route path="/user/requests" element={<ProtectedRoute allowedRoles={['ROLE_USER']}><NewRequestPage /></ProtectedRoute>} />
      <Route path="/user/dashboard" element={<ProtectedRoute allowedRoles={['ROLE_USER']}><NewRequestPage /></ProtectedRoute>} />
      <Route path="/user/categories" element={<ProtectedRoute allowedRoles={['ROLE_USER']}><CategoriesPage /></ProtectedRoute>} />
      <Route path="/it/requests" element={<ProtectedRoute allowedRoles={['ROLE_IT_STAFF', 'ROLE_ADMIN']}><ITRequestsPage /></ProtectedRoute>} />
      <Route path="/" element={<LoginPage />} />
    </Routes>
  );
}