import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { resetCart } from '../redux/slices/cartSlice';
import { logout } from '../redux/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { useLocation, Link } from 'react-router-dom';
import { Collapse, Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaBook, FaTags, FaUserTie, FaBuilding, FaShoppingCart, FaCreditCard, FaUsers, FaComment, FaEnvelope, FaCogs, FaChartLine, FaStore, FaChartPie } from 'react-icons/fa';

const AdminSidebar = () => {
  const location = useLocation();
  const [open, setOpen] = useState({
    inventory: true,
    sales: true,
    users: true,
    system: true,
  });
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleLogout = () => {
    try {
      dispatch(logout());
      dispatch({ type: 'user/logout' }); // Also clear userSlice
      dispatch(resetCart());
      localStorage.removeItem('userInfo');
      localStorage.removeItem('cart');
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
      toast.success('Admin logged out successfully!');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error('Admin logout failed. Please try again.');
      console.error('Admin logout error:', err);
    }
  };
  const toggle = section => setOpen(prev => ({ ...prev, [section]: !prev[section] }));
  return (
    <aside style={{ width: 240, background: 'var(--book-bg, #fff)', borderRight: '1px solid #e0e0e0', padding: '2rem 1rem 2rem 1.5rem', position: 'sticky', top: 64, height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <div style={{ flex: 1, overflowY: 'auto', minHeight: 0 }}>
        <Nav className="flex-column" as="ul">
        {/* Dashboard */}
        <Nav.Item as="li" style={{ marginBottom: 18 }}>
          <Nav.Link as={Link} to="/admin/dashboard" active={location.pathname === '/admin/dashboard'} style={{ color: 'var(--book-price, #4a00e0)', fontWeight: 600, fontSize: '1.08rem', background: 'none' }}>
            <FaTachometerAlt className="me-2" /> Dashboard
          </Nav.Link>
        </Nav.Item>

        {/* Inventory */}
        <Nav.Item as="li" style={{ marginBottom: 6 }}>
          <div style={{ fontWeight: 700, fontSize: '1.01rem', color: '#888', cursor: 'pointer', marginBottom: 4 }} onClick={() => toggle('inventory')}>
            Inventory {open.inventory ? '▾' : '▸'}
          </div>
          <Collapse in={open.inventory}>
            <div>
              <Nav.Link as={Link} to="/admin/books" active={location.pathname === '/admin/books'} style={{ color: 'var(--book-price, #4a00e0)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaBook className="me-2" /> Books</Nav.Link>
              <Nav.Link as={Link} to="/admin/categories" active={location.pathname === '/admin/categories'} style={{ color: 'var(--book-price, #4a00e0)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaTags className="me-2" /> Categories</Nav.Link>
              <Nav.Link as={Link} to="/admin/authors" active={location.pathname === '/admin/authors'} style={{ color: 'var(--book-price, #4a00e0)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaUserTie className="me-2" /> Authors</Nav.Link>
              <Nav.Link as={Link} to="/admin/publishers" active={location.pathname === '/admin/publishers'} style={{ color: 'var(--book-price, #4a00e0)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaBuilding className="me-2" /> Publishers</Nav.Link>
            </div>
          </Collapse>
        </Nav.Item>

        {/* Sales */}
        <Nav.Item as="li" style={{ marginBottom: 6 }}>
          <div style={{ fontWeight: 700, fontSize: '1.01rem', color: '#888', cursor: 'pointer', marginBottom: 4 }} onClick={() => toggle('sales')}>
            Sales {open.sales ? '▾' : '▸'}
          </div>
          <Collapse in={open.sales}>
            <div>
              <Nav.Link as={Link} to="/admin/orders" active={location.pathname === '/admin/orders'} style={{ color: 'var(--book-price, #4a00e0)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaShoppingCart className="me-2" /> Orders</Nav.Link>
              <Nav.Link as={Link} to="/admin/payments" active={location.pathname === '/admin/payments'} style={{ color: 'var(--book-price, #4a00e0)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaCreditCard className="me-2" /> Payments</Nav.Link>
              <Nav.Link as={Link} to="/admin/analytics" active={location.pathname === '/admin/analytics'} style={{ color: 'var(--book-price, #4a00e0)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaChartLine className="me-2" /> Analytics</Nav.Link>
            </div>
          </Collapse>
        </Nav.Item>

        {/* Users & Staff */}
        <Nav.Item as="li" style={{ marginBottom: 6 }}>
          <div style={{ fontWeight: 700, fontSize: '1.01rem', color: '#888', cursor: 'pointer', marginBottom: 4 }} onClick={() => toggle('users')}>
            Users & Staff {open.users ? '▾' : '▸'}
          </div>
          <Collapse in={open.users}>
            <div>
              <Nav.Link as={Link} to="/admin/users" active={location.pathname === '/admin/users'} style={{ color: 'var(--book-price, #4a00e0)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaUsers className="me-2" /> Users</Nav.Link>
              {/* Staff management link removed for non-admins; only visible in admin dashboard */}
              <Nav.Link as={Link} to="/admin/reviews" active={location.pathname === '/admin/reviews'} style={{ color: 'var(--book-price, #4a00e0)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaComment className="me-2" /> Reviews</Nav.Link>
              <Nav.Link as={Link} to="/admin/messages" active={location.pathname === '/admin/messages'} style={{ color: 'var(--book-price, #4a00e0)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaEnvelope className="me-2" /> Messages</Nav.Link>
            </div>
          </Collapse>
        </Nav.Item>

        {/* System */}
        <Nav.Item as="li" style={{ marginBottom: 6 }}>
          <div style={{ fontWeight: 700, fontSize: '1.01rem', color: '#888', cursor: 'pointer', marginBottom: 4 }} onClick={() => toggle('system')}>
            System {open.system ? '▾' : '▸'}
          </div>
          <Collapse in={open.system}>
            <div>
              <Nav.Link as={Link} to="/admin/system" active={location.pathname === '/admin/system'} style={{ color: 'var(--book-price, #4a00e0)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaCogs className="me-2" /> System</Nav.Link>
              <Nav.Link as={Link} to="/admin/analytics" active={location.pathname === '/admin/analytics'} style={{ color: 'var(--book-price, #4a00e0)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaChartPie className="me-2" /> Analytics</Nav.Link>
              <Nav.Link as={Link} to="/admin/settings" active={location.pathname === '/admin/settings'} style={{ color: 'var(--book-price, #4a00e0)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaCogs className="me-2" /> Settings</Nav.Link>
            </div>
          </Collapse>
        </Nav.Item>

        {/* Store Link */}
        <Nav.Item as="li" style={{ marginTop: 24 }}>
          <Nav.Link as={Link} to="/" style={{ color: '#888', fontWeight: 500, fontSize: '1.02rem', background: 'none' }}>
            <FaStore className="me-2" /> View Store
          </Nav.Link>
        </Nav.Item>
        </Nav>
      </div>
      {/* Logout button removed as requested */}
    </aside>
  );
};

export default AdminSidebar;
