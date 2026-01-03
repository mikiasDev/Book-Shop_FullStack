import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, NavDropdown, Form, Button } from 'react-bootstrap';
import { FaShoppingCart, FaSun, FaMoon, FaSearch } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';
import { resetCart } from '../../redux/slices/cartSlice';
import { toast } from 'react-toastify';
import { useLogoutMutation } from '../../redux/slices/userApiSlice';
import { useGetCategoriesQuery } from '../../redux/slices/categoriesApiSlice';

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [logoutApiCall] = useLogoutMutation();
  // Fetch all categories for the navbar
  const { data: categoriesData, isLoading: loadingCategories, error: errorCategories } = useGetCategoriesQuery({ pageNumber: 1, pageSize: 1000 });

  // ... (Theme state and useEffect remain the same) ...
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light';
  });
  
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.setAttribute('data-bs-theme', 'dark');
      root.classList.add('dark-mode');
    } else {
      root.setAttribute('data-bs-theme', 'light');
      root.classList.remove('dark-mode');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
  };

  // --- UPDATED LOGOUT HANDLER ---
  const logoutHandler = async () => {
    try {
      await logoutApiCall().unwrap();
      dispatch(logout());
      dispatch(resetCart());
      localStorage.clear();
      sessionStorage.clear();
      // Robust cookie removal for all paths and domains
      document.cookie.split(';').forEach((c) => {
        const base = c.split('=')[0].trim();
        // Remove for root path
        document.cookie = `${base}=;expires=${new Date(0).toUTCString()};path=/`;
        // Remove for current path
        document.cookie = `${base}=;expires=${new Date(0).toUTCString()};path=${window.location.pathname}`;
        // Remove for domain and subdomains
        const domainParts = window.location.hostname.split('.');
        for (let i = 0; i < domainParts.length - 1; i++) {
          const domain = domainParts.slice(i).join('.');
          document.cookie = `${base}=;expires=${new Date(0).toUTCString()};path=/;domain=.${domain}`;
        }
      });
      toast.success('Logged out successfully!');
      navigate('/login', { replace: true });
    } catch (err) {
      toast.error('Logout failed. Please try again.');
      console.error('Logout error:', err);
    }
  };

  const [keyword, setKeyword] = useState('');

  const submitSearchHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
    } else {
      navigate('/');
    }
  };

  return (
    <header>
      <Navbar 
        expand='lg' 
        fixed="top" 
        collapseOnSelect 
        className="glass-navbar py-3 border-bottom"
        bg={theme === 'dark' ? 'dark' : 'white'}
        variant={theme}
      >
        <Container fluid="lg" role="navigation" aria-label="Main navigation">
          <LinkContainer to='/'>
            <Navbar.Brand className="fw-bold fs-4 d-flex align-items-center">
              <i className="fas fa-book-open text-primary me-2"></i> 
              <span className="brand-text">Book Shop</span>
            </Navbar.Brand>
          </LinkContainer>

          {/* ... (Rest of your Header JSX remains exactly the same) ... */}
          
          <div className="d-flex align-items-center order-lg-3">
             <Button 
              variant="link" 
              onClick={toggleTheme} 
              className="d-lg-none me-2 text-decoration-none nav-icon-btn"
            >
              {theme === 'dark' ? <FaSun className="text-warning" /> : <FaMoon className="text-secondary" />}
            </Button>
            
            <LinkContainer to='/cart' className="d-lg-none me-2">
              <Button variant="link" className="position-relative text-decoration-none p-0 nav-icon-btn">
                <FaShoppingCart className="fs-5" />
                {cartItems.length > 0 && (
                  <Badge pill bg='danger' className="position-absolute top-0 start-100 translate-middle badge-sm">
                    {cartItems.reduce((a, c) => a + c.qty, 0)}
                  </Badge>
                )}
              </Button>
            </LinkContainer>

            <Navbar.Toggle aria-controls='basic-navbar-nav' />
          </div>

          <Navbar.Collapse id='basic-navbar-nav'>
            <Nav className="me-auto align-items-center">
              <LinkContainer to='/' className="mx-2">
                <Nav.Link>Home</Nav.Link>
              </LinkContainer>
              
              <NavDropdown title="Categories" id="categories-dropdown" className="mx-2">
                {loadingCategories ? (
                  <NavDropdown.Item>Loading...</NavDropdown.Item>
                ) : errorCategories ? (
                  <NavDropdown.Item>Error loading categories</NavDropdown.Item>
                ) : (
                  (categoriesData?.categories || []).map((cat) => (
                    <LinkContainer to={`/search/${cat.name}`} key={cat._id}>
                      <NavDropdown.Item>{cat.name}</NavDropdown.Item>
                    </LinkContainer>
                  ))
                )}
                <NavDropdown.Divider />
                <LinkContainer to='/'>
                  <NavDropdown.Item>All Books</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              
              <LinkContainer to='/about' className="mx-2">
                <Nav.Link>About</Nav.Link>
              </LinkContainer>
            </Nav>

            <Form onSubmit={submitSearchHandler} className="d-flex mx-3 my-2 my-lg-0 flex-grow-1" style={{ maxWidth: '400px' }}>
              <div className="input-group">
                <Form.Control
                  type='text'
                  name='q'
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder='Search books...'
                  className="border-end-0 rounded-start-pill bg-body-tertiary"
                />
                <Button type='submit' variant="outline-secondary" className="border-start-0 rounded-end-pill bg-body-tertiary">
                  <FaSearch />
                </Button>
              </div>
            </Form>

            <Nav className="align-items-center ms-lg-3">
              <Button variant="link" onClick={toggleTheme} className="d-none d-lg-block me-3 text-decoration-none nav-icon-btn">
                {theme === 'dark' ? <FaSun className="text-warning fs-5" /> : <FaMoon className="text-secondary fs-5" />}
              </Button>

              <LinkContainer to='/cart' className="d-none d-lg-block me-3">
                <Button variant="link" className="position-relative text-decoration-none nav-icon-btn">
                  <FaShoppingCart className="fs-5" />
                  {cartItems.length > 0 && (
                    <Badge pill bg='danger' className="position-absolute top-0 start-100 translate-middle badge-sm">
                      {cartItems.reduce((a, c) => a + c.qty, 0)}
                    </Badge>
                  )}
                </Button>
              </LinkContainer>

              {userInfo ? (
                <NavDropdown title={userInfo.name} id='username' align="end">
                  <LinkContainer to='/profile'>
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  {userInfo.isAdmin && (
                    <LinkContainer to='/admin'>
                      <NavDropdown.Item>Admin Dashboard</NavDropdown.Item>
                    </LinkContainer>
                  )}
                  <NavDropdown.Item onClick={logoutHandler} className="text-danger">
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to='/login'>
                  <Button variant="primary" className="rounded-pill px-4">Sign In</Button>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;