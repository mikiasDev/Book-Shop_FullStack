import PaymentPendingPage from './pages/PaymentPendingPage';
import NewReleasesPage from './pages/NewReleasesPage';
// import AdminProfile from './components/profile/AdminProfile'; // unused
// (Removed stray route definition)
import AdminForgotPasswordPage from './pages/AdminForgotPasswordPage';
import AdminResetPasswordPage from './pages/AdminResetPasswordPage';
import AdminLoginPage from './pages/AdminLoginPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import FAQPage from './pages/FAQPage';
import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { Provider } from 'react-redux';
import store from './redux/store/store.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/main.css';
import App from './App';


// Layouts
import PublicLayout from './components/layouts/PublicLayout';
import AdminLayout from './components/layouts/AdminLayout';
// Import Pages
import HomePage from './pages/HomePage';
import BookPage from './pages/BookPage';
import CategoryPage from './pages/CategoryPage';
import CartPage from './pages/CartPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import VerifyEmailPage from './pages/VerifyEmailPage';
import ResendVerificationPage from './pages/ResendVerificationPage';
import ShippingPage from './pages/ShippingPage';
import PaymentPage from './pages/PaymentPage';
import PlaceOrderPage from './pages/PlaceOrderPage';
import OrderPage from './pages/OrderPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import ProfilePage from './pages/ProfilePage';
// Admin Pages
import AdminDashboard from './admin/AdminDashboard';
import AdminAnalytics from './admin/AdminAnalytics';
import AdminSettings from './admin/AdminSettings';
import BookEditPage from './admin/BookEditPage';
import BookCreatePage from './admin/BookCreatePage';
import AdminBooks from './admin/AdminBooks';
import UserEditPage from './admin/UserEditPage';
import ErrorPage from './components/common/ErrorPage';
import AdminCategories from './admin/AdminCategories';
import AdminAuthors from './admin/AdminAuthors';
import AdminPublishers from './admin/AdminPublishers';
import AdminOrders from './admin/AdminOrders';
import AdminPayments from './admin/AdminPayments';
import AdminUsers from './admin/AdminUsers';
import AdminReviews from './admin/AdminReviews';
import AdminMessages from './admin/AdminMessages';
import AdminSystem from './admin/AdminSystem';
// Import Protected Route Component
import ProtectedRoute from './components/common/ProtectedRoute';
import AdminRoute from './components/common/AdminRoute';
import Terms from './pages/policies/Terms';
import Privacy from './pages/policies/Privacy';
import Security from './pages/policies/Security';
import Cookie from './pages/policies/Cookie';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path='/' element={<App />} errorElement={<ErrorPage />}>
      
      {/* PUBLIC LAYOUT ROUTES */}
      <Route element={<PublicLayout />}>
        <Route index={true} path='/' element={<HomePage />} />
        <Route path='/search/:keyword' element={<HomePage />} />
        <Route path='/search' element={<HomePage />} />
        <Route path='/product/:id' element={<BookPage />} />
        <Route path='/forgot-password' element={<ForgotPasswordPage />} />
        <Route path='/reset-password/:token' element={<ResetPasswordPage />} />
        <Route path='/admin/login' element={<AdminLoginPage />} />
        <Route path='/admin/forgot-password' element={<AdminForgotPasswordPage />} />
        <Route path='/admin/reset-password/:token' element={<AdminResetPasswordPage />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/verify-email/:token' element={<VerifyEmailPage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/resend-verification' element={<ResendVerificationPage />} />
        <Route path='/faq' element={<FAQPage />} />
        {/* Policy Pages */}
        <Route path='/policies/terms' element={<Terms />} />
        <Route path='/policies/privacy' element={<Privacy />} />
        <Route path='/policies/security' element={<Security />} />
        <Route path='/policies/cookie' element={<Cookie />} />

        {/* Category Page Route */}
        <Route path='/category/:slug' element={<CategoryPage />} />
        <Route path='/new-releases' element={<NewReleasesPage />} />

        {/* Payment Pending Page (public route) */}
        <Route path='/payment-pending' element={<PaymentPendingPage />} />
        {/* Protected Routes - User must be logged in */}
        <Route path='' element={<ProtectedRoute />}>
          <Route path='/shipping' element={<ShippingPage />} />
          <Route path='/payment' element={<PaymentPage />} />
          <Route path='/placeorder' element={<PlaceOrderPage />} />
          <Route path='/order/:id' element={<OrderPage />} />
          <Route path='/profile' element={<ProfilePage />} />
          <Route path='/profile/orders' element={<ProfilePage tab='orders' />} />
        </Route>
      </Route>

      {/* ADMIN LAYOUT ROUTES */}
      <Route path='' element={<AdminRoute />}> 
        <Route element={<AdminLayout />}> 
          <Route path='/admin/dashboard' element={<AdminDashboard />} /> 
          <Route path='/admin/books' element={<AdminBooks />} /> 
          <Route path='/admin/categories' element={<AdminCategories />} /> 
          <Route path='/admin/authors' element={<AdminAuthors />} /> 
          <Route path='/admin/publishers' element={<AdminPublishers />} /> 
          <Route path='/admin/orders' element={<AdminOrders />} /> 
          <Route path='/admin/payments' element={<AdminPayments />} /> 
          <Route path='/admin/analytics' element={<AdminAnalytics />} /> 
          <Route path='/admin/users' element={<AdminUsers />} /> 
          <Route path='/admin/reviews' element={<AdminReviews />} /> 
          <Route path='/admin/messages' element={<AdminMessages />} /> 
          <Route path='/admin/system' element={<AdminSystem />} /> 
          <Route path='/admin/settings' element={<AdminSettings />} /> 
          <Route path='/admin/book/create' element={<BookCreatePage />} />
          <Route path='/admin/book/:id/edit' element={<BookEditPage />} />
          <Route path='/admin/user/:id/edit' element={<UserEditPage />} />
          {/* Redirect /admin to /admin/dashboard */}
          <Route path='/admin' element={<Navigate to='/admin/dashboard' replace />} />
        </Route>
      </Route>

      {/* Redirect /admin/profile to /profile so admin uses the public profile page */}
      <Route path='/admin/profile' element={<Navigate to='/profile' replace />} />

    </Route>
  )
);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  </React.StrictMode>
);