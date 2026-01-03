// frontend/src/App.jsx (Simplified)
import React, { useEffect } from 'react';
import { Container } from 'react-bootstrap';
import { Outlet, useLocation } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from './redux/slices/authSlice';
import { fetchAndInitUserProfile } from './redux/slices/userProfileInit';


import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { ThemeProvider } from './theme/ThemeContext';
import ChatBotWidget from './components/ChatBotWidget';

const App = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);



  // Check for existing login on app load
  useEffect(() => {
    // Always fetch latest profile from server if logged in
    dispatch(fetchAndInitUserProfile());
  }, [dispatch]);

  const location = useLocation();
  // Define routes where header/footer should NOT appear (admin, login, register, etc.)
  const hideHeaderFooterRoutes = [
    '/login', '/register', '/forgot-password', '/reset-password', '/admin', '/admin/book/create', '/admin/book', '/admin/user', '/admin/dashboard'
  ];
  const isAdminOrAuth = hideHeaderFooterRoutes.some(route => location.pathname.startsWith(route));

  return (
    <ThemeProvider>
      {/* Header is rendered by layout components, not here */}
      <main style={{ flex: 1, minHeight: '80vh', background: 'var(--bg-color)' }}>
        <Outlet />
      </main>
      {!isAdminOrAuth && <Footer />}
      {/* Chatbot widget loads on all pages */}
      <ChatBotWidget />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </ThemeProvider>
  );
};

export default App;