import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './ProfilePage.module.css';
import { Button } from 'react-bootstrap';
import ProfileDashboard from '../components/profile/ProfileDashboard';
import Profile from '../components/profile/Profile';
import OrderHistory from '../components/profile/OrderHistory';
import Wishlist from '../components/profile/Wishlist';
import PaymentMethods from '../components/profile/PaymentMethods';
import UserAddresses from '../components/profile/UserAddresses';
import SecuritySettings from '../components/profile/SecuritySettings';
import Membership from '../components/profile/Membership';
import ReadingPreferences from '../components/profile/ReadingPreferences';
import AdminProfile from '../components/profile/AdminProfile';
import { useSelector } from 'react-redux';


const ProfilePage = ({ tab: initialTab }) => {
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);
  // Tabs: dashboard, profile, orders, wishlist, payments, addresses, security, membership, preferences, admin
  const [tab, setTab] = useState(initialTab || 'dashboard');

  // Only Admins see AdminProfile
  const isAdmin = userInfo?.role === 'Admin';

  // Sidebar/tab list
  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'profile', label: 'Profile' },
    { key: 'orders', label: 'Orders' },
    { key: 'wishlist', label: 'Wishlist' },
    { key: 'payments', label: 'Payment Methods' },
    { key: 'addresses', label: 'Addresses' },
    { key: 'security', label: 'Security' },
    { key: 'membership', label: 'Membership' },
    { key: 'preferences', label: 'Reading Preferences' },
  ];
  if (isAdmin) tabs.push({ key: 'admin', label: 'Admin Tools' });

  // Render selected tab content
  const renderTab = () => {
    switch (tab) {
      case 'dashboard':
        return <ProfileDashboard setActiveTab={setTab} />;
      case 'profile':
        return <Profile />;
      case 'orders':
        return <OrderHistory />;
      case 'wishlist':
        return <Wishlist />;
      case 'payments':
        return <PaymentMethods />;
      case 'addresses':
        return <UserAddresses />;
      case 'security':
        return <SecuritySettings />;
      case 'membership':
        return <Membership />;
      case 'preferences':
        return <ReadingPreferences />;
      case 'admin':
        return <AdminProfile />;
      default:
        return <ProfileDashboard setActiveTab={setTab} />;
    }
  };

  return (
    <div className="profile-responsive-root">
      <div style={{ maxWidth: 1100, margin: '40px auto', padding: 24, background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px rgba(0,0,0,0.06)', display: 'flex', gap: 32 }}>
        {/* Sidebar Navigation */}
        <nav className={styles['profile-tabs']} style={{ flexDirection: 'column', minWidth: 200, borderRight: '2px solid #eee', marginBottom: 0 }}>
          {tabs.map((t) => (
            <button
              key={t.key}
              className={tab === t.key ? styles['profile-tab'] + ' ' + styles.active : styles['profile-tab']}
              onClick={() => setTab(t.key)}
              role="tab"
              aria-selected={tab === t.key}
              style={{ textAlign: 'left', width: '100%' }}
            >
              {t.label}
            </button>
          ))}
          <Button variant="outline-primary" size="sm" style={{ marginTop: 32 }} onClick={() => navigate('/')}>Back Home</Button>
        </nav>
        {/* Main Content */}
        <main style={{ flex: 1, minWidth: 0 }}>{renderTab()}</main>
      </div>
    </div>
  );
};

export default ProfilePage;