import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Container, InputGroup, Spinner } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAndInitUserProfile } from '../redux/slices/userProfileInit';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaGoogle, FaGithub, FaArrowRight } from 'react-icons/fa';
import { useRegisterMutation } from '../redux/slices/userApiSlice';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get('redirect') || '/';

  const dispatch = useDispatch();

  // On mount, check if redirected from OAuth and sync session
  useEffect(() => {
    // Only run on initial mount, not on userInfo change
    if (!userInfo) {
      dispatch(fetchAndInitUserProfile());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (userInfo) {
      if (redirect && redirect !== '/register') {
        navigate(redirect);
      }
      // If redirect is /register, do not redirect again (prevents loop)
    }
  }, [navigate, redirect, userInfo]);

  const togglePasswordVisibility = () => setShowPassword(!showPassword);

  const [showVerifyMsg, setShowVerifyMsg] = useState(false);
  // Password strength validation helper
  const isStrongPassword = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pwd);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!isStrongPassword(password)) {
      toast.error('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    try {
      await register({ name, email, password }).unwrap();
      setShowVerifyMsg(true);
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // FUNCTIONALITY FOR SOCIAL LOGIN
  const handleSocialRegister = (provider) => {
    // This redirects the browser to your backend API
    // Ensure your backend is running on port 5000 or change the URL accordingly
    const backendUrl = 'http://localhost:5000'; 
    
    if (provider === 'google') {
      window.location.href = `${backendUrl}/auth/google`;
    } else if (provider === 'github') {
      window.location.href = `${backendUrl}/auth/github`;
    }
  };

  return (
    <main className="min-vh-100 d-flex align-items-center bg-light" style={{ paddingTop: '80px' }}>
      <Container fluid className="p-0">
        <Row className="g-0 min-vh-100">
          {/* LEFT SIDE: Visual Image & Branding */}
          <Col lg={6} className="d-none d-lg-flex flex-column justify-content-center align-items-center text-white p-5 position-relative">
            <div 
              className="position-absolute top-0 start-0 w-100 h-100"
              style={{
                backgroundImage: 'url("https://images.unsplash.com/photo-1457369804613-52c61a468e7d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                filter: 'brightness(0.5)'
              }}
            ></div>
            <div className="position-relative z-1 text-center" style={{ maxWidth: '500px' }}>
              <div className="mb-4">
                <i className="fas fa-book-reader display-4 text-warning mb-3"></i>
                <h1 className="fw-bold display-5">Join the Community</h1>
              </div>
              <p className="lead fs-4 text-white-50">
                "Reading gives us someplace to go when we have to stay where we are."
              </p>
              <p className="mt-2 fst-italic text-white">- Mason Cooley</p>
            </div>
          </Col>

          {/* RIGHT SIDE: Register Form */}
          <Col lg={6} className="d-flex align-items-center justify-content-center bg-white">
            <div className="w-100 p-4 p-md-5" style={{ maxWidth: '600px' }}>
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-2 text-dark">Create Account</h2>
                <p className="text-muted">Unlock a world of stories today.</p>
              </div>
              {showVerifyMsg ? (
                <div className="text-center p-4 rounded bg-light border">
                  <h4 className="mb-3 text-success">Registration Successful!</h4>
                  <p className="mb-2">Please check your email and click the verification link to activate your account.</p>
                  <p className="mb-2">Didn't get the email?</p>
                  <Link to="/resend-verification" className="fw-bold text-decoration-none text-primary">Resend Verification Email</Link>
                  <div className="mt-4">
                    <Link to="/login">
                      <Button variant="dark">Go to Login</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <Form onSubmit={submitHandler}>
                  {/* Name Input */}
                  <Form.Group className="mb-3" controlId="name">
                    <Form.Label className="fw-medium small text-uppercase text-muted">Full Name</Form.Label>
                    <InputGroup className="input-group-lg border rounded bg-light">
                      <InputGroup.Text className="bg-transparent border-0 text-muted">
                        <FaUser size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="text"
                        placeholder="Enter your full name" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="bg-transparent border-0 shadow-none fs-6"
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                  {/* Email Input */}
                  <Form.Group className="mb-3" controlId="email">
                    <Form.Label className="fw-medium small text-uppercase text-muted">Email Address</Form.Label>
                    <InputGroup className="input-group-lg border rounded bg-light">
                      <InputGroup.Text className="bg-transparent border-0 text-muted">
                        <FaEnvelope size={18} />
                      </InputGroup.Text>
                      <Form.Control
                        type="email"
                        placeholder="name@gmail.com" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-transparent border-0 shadow-none fs-6"
                        required
                      />
                    </InputGroup>
                  </Form.Group>
                  <Row>
                    <Col md={6}>
                      {/* Password Input */}
                      <Form.Group className="mb-3" controlId="password">
                        <Form.Label className="fw-medium small text-uppercase text-muted">Password</Form.Label>
                        <InputGroup className="input-group-lg border rounded bg-light">
                          <InputGroup.Text className="bg-transparent border-0 text-muted">
                            <FaLock size={18} />
                          </InputGroup.Text>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="•••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="bg-transparent border-0 shadow-none fs-6"
                            required
                          />
                        </InputGroup>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      {/* Confirm Password Input */}
                      <Form.Group className="mb-4" controlId="confirmPassword">
                        <Form.Label className="fw-medium small text-uppercase text-muted">Confirm</Form.Label>
                        <InputGroup className="input-group-lg border rounded bg-light">
                          <InputGroup.Text className="bg-transparent border-0 text-muted">
                            <FaLock size={18} />
                          </InputGroup.Text>
                          <Form.Control
                            type={showPassword ? "text" : "password"}
                            placeholder="•••••••"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="bg-transparent border-0 shadow-none fs-6"
                            required
                          />
                          <Button 
                            variant="link" 
                            onClick={togglePasswordVisibility}
                            className="text-muted text-decoration-none px-2"
                          >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>
                  {/* Submit Button */}
                  <Button 
                    disabled={isLoading} 
                    type="submit" 
                    variant="dark" 
                    size="lg" 
                    className="w-100 mb-4 rounded-pill fw-bold shadow-sm d-flex align-items-center justify-content-center"
                    style={{ transition: 'all 0.3s' }}
                  >
                    {isLoading ? (
                      <>
                        <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" /> 
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Register <FaArrowRight className="ms-2" size={14} />
                      </>
                    )}
                  </Button>
                  {/* Social Register Divider */}
                  <div className="position-relative text-center mb-4">
                    <hr className="text-muted opacity-25" />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small text-uppercase">
                      Or register with
                    </span>
                  </div>
                  {/* Social Buttons (Functional) */}
                  <div className="d-flex justify-content-center gap-3 mb-4">
                    <Button 
                      variant="outline-danger" 
                      className="w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => handleSocialRegister('google')}
                    >
                      <FaGoogle /> Google
                    </Button>
                    <Button 
                      variant="outline-dark" 
                      className="w-100 py-2 d-flex align-items-center justify-content-center gap-2"
                      onClick={() => handleSocialRegister('github')}
                    >
                      <FaGithub /> GitHub
                    </Button>
                  </div>
                  {/* Login Link */}
                  <div className="text-center p-3 rounded bg-light">
                    <span className="text-muted">Already have an account? </span>
                    <Link 
                      to={redirect ? `/login?redirect=${redirect}` : '/login'}
                      className="fw-bold text-decoration-none text-dark"
                    >
                      Login
                    </Link>
                  </div>
                </Form>
              )}
            </div>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default RegisterPage;