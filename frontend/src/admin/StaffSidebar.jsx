import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Nav } from 'react-bootstrap';
import { FaTachometerAlt, FaBook, FaTags, FaUserTie, FaShoppingCart, FaComment, FaEnvelope, FaUsers } from 'react-icons/fa';

const StaffSidebar = () => {
  const location = useLocation();
  return (
    <aside style={{ width: 220, background: 'var(--book-bg, #fff)', borderRight: '1px solid #e0e0e0', padding: '2rem 1rem 2rem 1.5rem', position: 'sticky', top: 64, height: 'calc(100vh - 64px)' }}>
      <Nav className="flex-column" as="ul">
        {/* Dashboard */}
        <Nav.Item as="li" style={{ marginBottom: 18 }}>
          <Nav.Link as={Link} to="/admin/staff/dashboard" active={location.pathname === '/admin/staff/dashboard'} style={{ color: 'var(--book-price, #1976d2)', fontWeight: 600, fontSize: '1.08rem', background: 'none' }}>
            <FaTachometerAlt className="me-2" /> Dashboard
          </Nav.Link>
        </Nav.Item>
        {/* Books & Users */}
        <Nav.Item as="li" style={{ marginBottom: 6 }}>
          <Nav.Link as={Link} to="/admin/staff/books" active={location.pathname === '/admin/staff/books'} style={{ color: 'var(--book-price, #1976d2)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaBook className="me-2" /> Books</Nav.Link>
          <Nav.Link as={Link} to="/admin/staff/authors" active={location.pathname === '/admin/staff/authors'} style={{ color: 'var(--book-price, #1976d2)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaUserTie className="me-2" /> Authors</Nav.Link>
          <Nav.Link as={Link} to="/admin/staff/categories" active={location.pathname === '/admin/staff/categories'} style={{ color: 'var(--book-price, #1976d2)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaTags className="me-2" /> Categories</Nav.Link>
          <Nav.Link as={Link} to="/admin/staff/users" active={location.pathname === '/admin/staff/users'} style={{ color: 'var(--book-price, #1976d2)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaUsers className="me-2" /> Users</Nav.Link>
        </Nav.Item>
        {/* Orders */}
        <Nav.Item as="li" style={{ marginBottom: 6 }}>
          <Nav.Link as={Link} to="/admin/staff/orders" active={location.pathname === '/admin/staff/orders'} style={{ color: 'var(--book-price, #1976d2)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaShoppingCart className="me-2" /> Orders</Nav.Link>
        </Nav.Item>
        {/* Reviews & Messages */}
        <Nav.Item as="li" style={{ marginBottom: 6 }}>
          <Nav.Link as={Link} to="/admin/staff/reviews" active={location.pathname === '/admin/staff/reviews'} style={{ color: 'var(--book-price, #1976d2)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaComment className="me-2" /> Reviews</Nav.Link>
          <Nav.Link as={Link} to="/admin/staff/messages" active={location.pathname === '/admin/staff/messages'} style={{ color: 'var(--book-price, #1976d2)', fontWeight: 500, fontSize: '1.02rem', background: 'none', marginLeft: 16 }}><FaEnvelope className="me-2" /> Messages</Nav.Link>
        </Nav.Item>
      </Nav>
    </aside>
  );
};

export default StaffSidebar;
