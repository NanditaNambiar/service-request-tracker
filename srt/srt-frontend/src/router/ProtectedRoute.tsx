import { Navigate } from 'react-router-dom';
import { getAuthState } from '../store/authStore';
import React from 'react';

export default function ProtectedRoute({ children, allowedRoles }: { children: React.ReactNode; allowedRoles: string[] }) {
const { token, user } = getAuthState();
if (!token) return <Navigate to="/login" replace />;
if (!user) return <Navigate to="/login" replace />;
const role = user.role;
if (!allowedRoles.includes(role)) return <Navigate to="/login" replace />;
return children;
}