import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { UserRole } from '../types/user.types';

interface RoleBasedRouteProps {
  allowedRoles: UserRole[];
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({ allowedRoles }) => {
  const { user } = useAuthStore();

  if (!user || !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/events" replace />;
  }

  return <Outlet />;
};

export default RoleBasedRoute;
