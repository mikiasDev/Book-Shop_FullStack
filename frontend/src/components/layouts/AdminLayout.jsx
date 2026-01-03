
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import AdminSidebar from '../../admin/AdminSidebar';

const AdminHeader = () => {
  const navigate = useNavigate();
  const forceLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    document.cookie.split(';').forEach((c) => {
      const base = c.split('=')[0].trim();
      document.cookie = `${base}=;expires=${new Date(0).toUTCString()};path=/`;
      document.cookie = `${base}=;expires=${new Date(0).toUTCString()};path=${window.location.pathname}`;
      const domainParts = window.location.hostname.split('.');
      for (let i = 0; i < domainParts.length - 1; i++) {
        const domain = domainParts.slice(i).join('.');
        document.cookie = `${base}=;expires=${new Date(0).toUTCString()};path=/;domain=.${domain}`;
      }
    });
    navigate('/login', { replace: true });
  };
  return (
    <header className="admin-header-bar d-flex align-items-center mb-4 px-2 justify-content-between" style={{minHeight:'64px', background:'#fff', borderBottom:'1px solid #eee'}}>
      <span className="admin-header-title fw-bold" style={{fontSize:'1.45rem', letterSpacing:'0.01em'}}>Admin Panel</span>
      {/* <button className="btn btn-outline-danger btn-sm ms-auto" onClick={forceLogout} style={{marginLeft:'auto'}}>Log</button> */}
    </header>
  );
};

const AdminLayout = () => (
  <div className="admin-layout-root d-flex" style={{minHeight:'100vh'}}>
    <aside className="admin-sidebar-container d-none d-lg-block">
      <AdminSidebar />
    </aside>
    <div className="admin-main-content flex-grow-1 d-flex flex-column">
      <AdminHeader />
      <main className="flex-grow-1 px-3 py-2">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AdminLayout;
