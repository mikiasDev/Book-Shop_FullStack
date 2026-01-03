import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, Outlet } from 'react-router-dom';

const StaffRoute = () => {
  const { userInfo } = useSelector((state) => state.auth);
  // Allow if user is admin or staff (role: manager/support)
  return userInfo && (userInfo.isAdmin || userInfo.role === 'manager' || userInfo.role === 'support')
    ? <Outlet />
    : <Navigate to="/login" replace />;
};

export default StaffRoute;
