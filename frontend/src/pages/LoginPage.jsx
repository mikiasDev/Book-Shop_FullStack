import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container, Spinner, Alert, InputGroup } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaGoogle, FaGithub, FaEnvelope, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { useLoginMutation } from '../redux/slices/userApiSlice';
import { setCredentials } from '../redux/slices/authSlice';
import { addToCart } from '../redux/slices/cartSlice';
import { useGetBookDetailsQuery } from '../redux/slices/booksApiSlice';
import { fetchAndInitUserProfile } from '../redux/slices/userProfileInit';
import { toast } from 'react-toastify'; // Assuming you have toastify, if not use Alert

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [login, { isLoading, error }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';
  const addBookId = sp.get('addBook');
  const addBookQty = sp.get('qty') || 1;
  const { data: addBookData } = useGetBookDetailsQuery(addBookId, { skip: !addBookId });

  // On mount, check if redirected from OAuth and sync session
  useEffect(() => {
    // Only run on initial mount, not on userInfo change
    if (!userInfo) {
      dispatch(fetchAndInitUserProfile());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Redirect only if authenticated
  useEffect(() => {
    if (userInfo) {
      // If redirected from add-to-cart, complete the action
      if (addBookId && addBookData && addBookData._id) {
        dispatch(addToCart({ ...addBookData, qty: Number(addBookQty) }));
        navigate('/cart');
        return;
      }
      // Redirect admins to admin dashboard, others to normal destination
      if (userInfo.isAdmin || userInfo.role === 'admin') {
        navigate('/admin/dashboard');
        return;
      } else if (redirect && redirect !== '/login') {
        navigate(redirect);
      }
      // If redirect is /login, do not redirect again (prevents loop)
    }
  }, [navigate, redirect, userInfo, addBookId, addBookData, addBookQty, dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const trimmedEmail = typeof email === 'string' ? email.trim() : email;
      const res = await login({ email: trimmedEmail, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      // If admin, redirect immediately
      if (res.isAdmin || res.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate(redirect);
      }
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Functionality for Social Logins
  const handleSocialLogin = (provider) => {
    // Redirect to backend OAuth endpoint
    const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
    if (provider === 'google') {
      window.location.href = `${backendUrl}/auth/google`;
    } else if (provider === 'github') {
      window.location.href = `${backendUrl}/auth/github`;
    }
  };

  return (
    <main
      style={{
        minHeight: '100vh',
        overflow: 'hidden',
        paddingTop: '80px',
        background: 'var(--color-background, #f8fafc)',
        color: 'var(--color-text, #212529)'
      }}
      className="d-flex align-items-center login-main-bg"
    >
      <Container fluid className="p-0">
        <Row className="g-0">
          
          {/* LEFT SIDE: LOGIN FORM */}
          <Col
            md={6}
            lg={5}
            className="d-flex flex-column justify-content-center align-items-center p-5 login-form-col"
            style={{ minHeight: '100vh', background: 'var(--card-bg, #fff)', color: 'var(--color-text, #212529)' }}
          >
            <div style={{ maxWidth: '400px', width: '100%' }}>
              
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-2" style={{ color: 'var(--color-text, #212529)' }}>Welcome Back!</h2>
                <p className="text-muted" style={{ color: 'var(--color-textMuted, #6c757d)' }}>Please enter your details to sign in.</p>
              </div>

              {error && (
                <Alert variant="danger" className="mb-4">
                  {error?.data?.message || error.error}
                </Alert>
              )}


              <Form onSubmit={submitHandler}>
                {/* Email Input */}
                <Form.Group className='mb-4' controlId='email'>
                  <Form.Label className="fw-semibold small" style={{ color: 'var(--color-text, #212529)' }}>Email Address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="login-input-bg border-end-0">
                      <FaEnvelope className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="login-input-bg border-start-0 py-2"
                      style={{ borderLeft: 'none', color: 'var(--color-text, #212529)' }}
                      required
                    />
                  </InputGroup>
                </Form.Group>
                {/* Terms, Privacy, Security Checkbox */}
                <Form.Group className='mb-3' controlId='terms'>
                  <Form.Check
                    type='checkbox'
                    required
                    label={<span>I agree to the <Link to="/policies/terms" target="_blank" style={{color:'#1976d2',textDecoration:'underline'}}>Terms</Link>, <Link to="/policies/privacy" target="_blank" style={{color:'#1976d2',textDecoration:'underline'}}>Privacy Policy</Link>, and <Link to="/policies/security" target="_blank" style={{color:'#1976d2',textDecoration:'underline'}}>Security Policy</Link></span>}
                  />
                </Form.Group>

                {/* Password Input */}
                <Form.Group className='mb-2' controlId='password'>
                  <Form.Label className="fw-semibold small" style={{ color: 'var(--color-text, #212529)' }}>Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text className="login-input-bg border-end-0">
                      <FaLock className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Enter your password'
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-input-bg border-start-0 py-2 border-end-0"
                      style={{ color: 'var(--color-text, #212529)' }}
                      required
                    />
                    <InputGroup.Text 
                      className="login-input-bg border-start-0 cursor-pointer" 
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: 'pointer' }}
                    >
                      {showPassword ? <FaEyeSlash className="text-muted" /> : <FaEye className="text-muted" />}
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>

                <div className="d-flex justify-content-between align-items-center mb-4">
                  <Form.Check type="checkbox" label="Remember me" id="remember" className="small text-muted" style={{ color: 'var(--color-textMuted, #bdbdbd)' }} />
                  <div className="text-end">
                    <Link to="/forgot-password" style={{ textDecoration: 'none', fontSize: '0.85rem', color: 'var(--primary-color, #4a00e0)' }} className="fw-semibold">
                      Forgot Password?
                    </Link>
                  </div>
                </div>

                <Button
                  disabled={isLoading}
                  type='submit'
                  variant='primary'
                  className="w-100 py-2 fw-bold shadow-sm login-btn-gradient"
                  style={{ border: 'none' }}
                >
                  {isLoading ? <Spinner animation="border" size="sm" /> : 'Sign In'}
                </Button>
              </Form>

              {/* OR CONTINUE WITH SECTION */}
              <div className="my-4 d-flex align-items-center">
                <div className="flex-grow-1 border-top" style={{ borderColor: 'var(--color-border, #dee2e6)' }}></div>
                <span className="mx-3 text-muted small fw-semibold" style={{ color: 'var(--color-textMuted, #bdbdbd)' }}>Or continue with</span>
                <div className="flex-grow-1 border-top" style={{ borderColor: 'var(--color-border, #dee2e6)' }}></div>
              </div>

              <Row className="g-2">
                <Col>
                  <Button 
                    variant="outline-secondary" 
                    className="w-100 py-2 d-flex align-items-center justify-content-center login-social-btn"
                    onClick={() => handleSocialLogin('google')}
                    style={{ background: 'var(--input-bg, #fff)', color: 'var(--color-text, #212529)', borderColor: 'var(--input-border, #ced4da)' }}
                  >
                    <FaGoogle className="me-2 text-danger" /> Google
                  </Button>
                </Col>
                <Col>
                  <Button 
                    variant="outline-secondary" 
                    className="w-100 py-2 d-flex align-items-center justify-content-center login-social-btn"
                    onClick={() => handleSocialLogin('github')}
                    style={{ background: 'var(--input-bg, #fff)', color: 'var(--color-text, #212529)', borderColor: 'var(--input-border, #ced4da)' }}
                  >
                    <FaGithub className="me-2 text-dark" /> GitHub
                  </Button>
                </Col>
              </Row>


              <div className="text-center mt-4">
                <span className="text-muted small" style={{ color: 'var(--color-textMuted, #bdbdbd)' }}>Don't have an account? </span>
                <Link 
                  to={redirect ? `/register?redirect=${redirect}` : '/register'} 
                  className="fw-bold text-decoration-none"
                  style={{ color: 'var(--primary-color, #4a00e0)' }}
                >
                  Create an account
                </Link>
              </div>

            </div>
          </Col>

          {/* RIGHT SIDE: IMAGE BANNER (Hidden on Mobile) */}
          <Col md={6} lg={7} className="d-none d-md-block position-relative">
            <div 
              style={{ 
                backgroundImage: 'url("https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")', 
                backgroundSize: 'cover', 
                backgroundPosition: 'center',
                height: '100%',
                width: '100%'
              }} 
            />
            {/* Overlay */}
            <div 
              className="position-absolute top-0 start-0 w-100 h-100 d-flex flex-column justify-content-end p-5 login-banner-overlay"
            >
              <h1 className="display-4 fw-bold mb-3 login-banner-text">Discover New Worlds</h1>
              <p className="lead mb-4 login-banner-text">"A reader lives a thousand lives before he dies. The man who never reads lives only one."</p>
              <div className="d-flex align-items-center">
                <div className="bg-white rounded-circle p-1 me-2" style={{ width: 40, height: 40, overflow: 'hidden' }}>
                  <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" className="w-100 h-100" />
                </div>
                <div>
                  <p className="mb-0 fw-bold login-banner-text">Sarah J.</p>
                  <small className="login-banner-text">Joined 2 days ago</small>
                </div>
              </div>
            </div>
          </Col>

        </Row>
      </Container>
    </main>
  );
};

export default LoginPage;