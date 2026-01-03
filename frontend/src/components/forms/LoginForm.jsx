import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Form, 
  Button, 
  Row, 
  Col, 
  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6} lg={5}>
          <Card className="shadow-lg border-0 rounded-4">
            <Card.Body className="p-4">
              <h2 className="mb-4 text-center fw-bold">Sign In</h2>
              {error && <Message variant="danger">{error}</Message>}
              {loading && <Loader />}
              <Form onSubmit={submitHandler} role="form" aria-label="Sign in form">
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email address</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaEnvelope aria-label="Email icon" /></InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      aria-label="Email address"
                    />
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Password</Form.Label>
                  <InputGroup>
                    <InputGroup.Text><FaLock aria-label="Password icon" /></InputGroup.Text>
                    <Form.Control
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      aria-describedby="togglePassword"
                      aria-label="Password"
                    />
                    <Button
                      variant="outline-secondary"
                      onClick={() => setShowPassword(!showPassword)}
                      tabIndex="0"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      id="togglePassword"
                    >
                      {showPassword ? <FaEyeSlash aria-label="Hide password icon" /> : <FaEye aria-label="Show password icon" />}
                    </Button>
                  </InputGroup>
                </Form.Group>
                <Form.Group className="mb-3" controlId="rememberMe">
                  <Form.Check
                    type="checkbox"
                    label="Remember me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    aria-label="Remember me"
                  />
                </Form.Group>
                <Button type="submit" variant="primary" className="w-100 mb-3" aria-label="Sign in">
                  Sign In
                </Button>
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Button
                    variant="link"
                    className="p-0 text-decoration-none"
                    onClick={() => setIsForgotPassword(true)}
                    aria-label="Forgot password"
                  >
                    Forgot password?
                  </Button>
                  <Link to="/register" className="small text-decoration-none" aria-label="Register new account">
                    New user? Register
                  </Link>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
    };
  }, [navigate, userInfo, redirect]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password && !isForgotPassword) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6 && !isForgotPassword) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const submitHandler = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (isForgotPassword) {
      // Handle forgot password
      alert(`Password reset instructions sent to ${email}`);
      setIsForgotPassword(false);
      return;
    }
    
    dispatch(login({ email, password }));
    
    if (rememberMe) {
      localStorage.setItem('rememberedEmail', email);
    } else {
      localStorage.removeItem('rememberedEmail');
    }
  };

  const demoLogin = (type) => {
    const demoCredentials = {
      student: { email: 'student@uog.edu.et', password: 'student123' },
      faculty: { email: 'faculty@uog.edu.et', password: 'faculty123' },
      customer: { email: 'customer@example.com', password: 'customer123' }
    };
    
    const creds = demoCredentials[type];
    setEmail(creds.email);
    setPassword(creds.password);
  };

  const shoppingBenefits = [
    { icon: <FaPercent />, text: 'Exclusive Member Discounts', color: 'success' },
    { icon: <FaGift />, text: 'Rewards & Loyalty Points', color: 'warning' },
    { icon: <FaTruck />, text: 'Free Shipping Over $50', color: 'info' },
    { icon: <FaShieldAlt />, text: 'Secure Checkout', color: 'primary' }
  ];

  return (
    <Container fluid className="login-shopping-page py-5">
      <Row className="justify-content-center align-items-center g-4">
        {/* Left Column - Shopping Benefits */}
        <Col lg={6} className="d-none d-lg-block">
          <div className="shopping-benefits-section p-4">
            <Link to="/" className="text-decoration-none">
              <Button variant="outline-primary" className="mb-4">
                <FaArrowLeft className="me-2" />
                Continue Shopping
              </Button>
            </Link>
            
            <div className="mb-5">
              <h1 className="display-5 fw-bold mb-3">
                Welcome Back to <span className="text-primary">BookStore</span>
              </h1>
              <p className="lead text-muted">
                Sign in to unlock exclusive shopping benefits and continue your reading journey.
              </p>
            </div>
            
            {/* Shopping Stats */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body>
                <h5 className="fw-bold mb-3">
                  <FaShoppingCart className="me-2 text-primary" />
                  Your Shopping Benefits
                </h5>
                <Row>
                  {shoppingBenefits.map((benefit, index) => (
                    <Col md={6} key={index} className="mb-3">
                      <div className="d-flex align-items-center">
                        <div className="benefit-icon p-2 rounded-circle me-3" style={{ background: 'rgba(var(--accent-rgb, 255,179,0), 0.10)' }}>
                          <span style={{ color: 'var(--accent, #ffb300)' }}>
                            {benefit.icon}
                          </span>
                        </div>
                        <span className="fw-medium">{benefit.text}</span>
                      </div>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
            
            {/* Cart Preview */}
            <Card className="border-0 shadow-sm mb-4">
              <Card.Header className="bg-white border-0">
                <h5 className="fw-bold mb-0">Quick Access</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button 
                    variant="outline-primary" 
                    onClick={() => navigate('/cart')}
                    className="text-start"
                  >
                    <FaShoppingCart className="me-2" />
                    View Your Cart
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => navigate('/order-history')}
                    className="text-start"
                  >
                    <i className="fas fa-history me-2"></i>
                    Order History
                  </Button>
                  <Button 
                    variant="outline-success" 
                    onClick={() => navigate('/wishlist')}
                    className="text-start"
                  >
                    <i className="fas fa-heart me-2"></i>
                    Your Wishlist
                  </Button>
                </div>
              </Card.Body>
            </Card>
            
            {/* Demo Accounts */}
            <div>
              <h6 className="fw-bold mb-3">Quick Sign In:</h6>
              <div className="d-flex gap-2">
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => demoLogin('student')}
                >
                  Student Account
                </Button>
                <Button 
                  variant="outline-success" 
                  size="sm"
                  onClick={() => demoLogin('faculty')}
                >
                  Faculty Account
                </Button>
                <Button 
                  variant="outline-info" 
                  size="sm"
                  onClick={() => demoLogin('customer')}
                >
                  Customer Account
                </Button>
              </div>
            </div>
          </div>
        </Col>

        {/* Right Column - Login Form */}
        <Col lg={6} md={8} sm={10}>
          <Card className="border-0 shadow-lg login-card-shopping">
            <Card.Body className="p-4 p-md-5">
              {/* Header */}
              <div className="text-center mb-4">
                <div className="login-icon-circle mb-3">
                  <FaLock size={28} className="text-primary" />
                </div>
                <h2 className="fw-bold mb-2">Sign In to Continue</h2>
                <p className="text-muted mb-4">
                  Access your account for faster checkout and personalized recommendations
                </p>
                
                {redirect && redirect !== '/' && (
                  <Alert variant="info" className="py-2">
                    <FaShoppingCart className="me-2" />
                    Complete your purchase after signing in
                  </Alert>
                )}
              </div>

              {/* Error Message */}
              {error && (
                <Message variant="danger" className="mb-4">
                  {error}
                </Message>
              )}

              {/* Loading */}
              {loading && <Loader />}

              {/* Social Login */}
              <div className="mb-4">
                <div className="d-grid gap-2">
                  <Button 
                    variant="outline-primary" 
                    className="social-btn"
                    onClick={() => window.location.href = 'http://localhost:5000/auth/google'}
                  >
                    <FaGoogle className="me-2" />
                    Continue with Google
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    className="social-btn"
                    onClick={() => window.location.href = 'http://localhost:5000/auth/github'}
                  >
                    <FaGithub className="me-2" />
                    Continue with GitHub
                  </Button>
                </div>
                <div className="text-center my-3">
                  <span className="divider-text">or sign in with email</span>
                </div>
              </div>

              {/* Login Form */}
              <Form onSubmit={submitHandler}>
                {/* Email Field */}
                <Form.Group className="mb-4">
                  <Form.Label className="fw-semibold">
                    <FaEnvelope className="me-2" />
                    Email Address
                  </Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <FaEnvelope className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors({...errors, email: ''});
                      }}
                      className="py-2"
                      isInvalid={!!errors.email}
                    />
                  </InputGroup>
                  {errors.email && (
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>

                {/* Password Field */}
                {!isForgotPassword && (
                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      <FaKey className="me-2" />
                      Password
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaLock className="text-muted" />
                      </InputGroup.Text>
                      <Form.Control
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          if (errors.password) setErrors({...errors, password: ''});
                        }}
                        className="py-2"
                        isInvalid={!!errors.password}
                      />
                      <Button
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        className="border-start-0"
                      >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                      </Button>
                    </InputGroup>
                    {errors.password && (
                      <Form.Control.Feedback type="invalid">
                        {errors.password}
                      </Form.Control.Feedback>
                    )}
                  </Form.Group>
                )}

                {/* Remember & Forgot */}
                <Row className="mb-4 align-items-center">
                  <Col xs={6}>
                    <Form.Check
                      type="checkbox"
                      id="remember-me"
                      label="Remember me"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="small"
                    />
                  </Col>
                  <Col xs={6} className="text-end">
                    <Button
                      variant="link"
                      className="text-decoration-none p-0 small"
                      onClick={() => setIsForgotPassword(!isForgotPassword)}
                    >
                      {isForgotPassword ? 'Back to Login' : 'Forgot Password?'}
                    </Button>
                  </Col>
                </Row>

                {/* Submit Button */}
                <div className="d-grid mb-4">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    className="py-3 fw-semibold"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Signing In...
                      </>
                    ) : isForgotPassword ? (
                      <>
                        <FaKey className="me-2" />
                        Reset Password
                      </>
                    ) : (
                      <>
                        <FaLock className="me-2" />
                        Sign In to Continue Shopping
                      </>
                    )}
                  </Button>
                </div>

                {/* OAuth Buttons */}
                <div className="text-center mb-3">
                  <Button
                    variant="primary"
                    onClick={() => window.location.href = 'http://localhost:5000/auth/google'}
                    className="me-2"
                  >
                    <FaGoogle className="me-2" />
                    Login with Google
                  </Button>
                  <Button
                    variant="secondary"
                    onClick={() => window.location.href = 'http://localhost:5000/auth/github'}
                  >
                    <FaGithub className="me-2" />
                    Login with GitHub
                  </Button>
                </div>

                {/* Register Link */}
                <div className="text-center pt-3 border-top">
                  <p className="mb-2">
                    New to BookStore?{' '}
                    <Link 
                      to={redirect ? `/register?redirect=${redirect}` : '/register'}
                      className="text-decoration-none fw-semibold"
                    >
                      <FaUserPlus className="me-1" />
                      Create an Account
                    </Link>
                  </p>
                  <p className="text-muted small mb-0">
                    Get personalized recommendations and faster checkout
                  </p>
                </div>
              </Form>

              {/* Security Badge */}
              <div className="text-center mt-4 pt-3 border-top">
                <div className="d-flex align-items-center justify-content-center">
                  <FaShieldAlt className="text-success me-2" />
                  <span className="small text-muted">
                    Your information is protected with 256-bit SSL encryption
                  </span>
                </div>
              </div>
            </Card.Body>
          </Card>
          
          {/* Guest Checkout Option */}
          <Card className="border-0 shadow-sm mt-4">
            <Card.Body className="text-center p-3">
              <p className="mb-2">Shopping for the first time?</p>
              <Button 
                variant="outline-success" 
                size="sm"
                onClick={() => navigate('/register')}
                className="me-2"
              >
                Create Account
              </Button>
              <Button 
                variant="outline-secondary" 
                size="sm"
                onClick={() => navigate('/cart')}
              >
                Continue as Guest
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default LoginForm;