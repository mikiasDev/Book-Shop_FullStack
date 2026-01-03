import React from 'react';
import Header from '../components/common/Header';
import AdminSidebar from './AdminSidebar';

const AdminLayout = ({ children }) => (
  <>
    <Header />
    <div style={{ display: 'flex', minHeight: '100vh', marginTop: 64 }}>
      <AdminSidebar />
      <main style={{ flex: 1, padding: '2.5rem 2rem 2rem 2rem', background: 'var(--book-bg, #f8f9fa)' }}>
        {children}
      </main>
    </div>
  </>
);

export default AdminLayout;
