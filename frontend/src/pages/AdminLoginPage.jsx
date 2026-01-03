
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import { useLoginMutation } from '../redux/slices/userApiSlice';

const AdminLoginPage = () => {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login] = useLoginMutation();
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await login({ email, password }).unwrap();
      if (!res.isAdmin && res.role !== 'admin') {
        setError('Access denied: Not an admin');
        setLoading(false);
        localStorage.removeItem('userInfo');
        navigate('/login');
        return;
      }
      dispatch(setCredentials({ ...res }));
      localStorage.setItem('userInfo', JSON.stringify({ ...res }));
      navigate('/admin/dashboard');
    } catch (err) {
      setError(err?.data?.message || err.error || 'Login failed');
      setLoading(false);
      localStorage.removeItem('userInfo');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light" style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%)' }}>
      <Card className="shadow-lg border-0" style={{ maxWidth: 400, width: '100%' }}>
        <Card.Body className="p-4">
          <div className="text-center mb-4">
            <div style={{ fontSize: 48, color: '#4a00e0', fontWeight: 700, letterSpacing: 1 }}>
              <span role="img" aria-label="Book">📚</span>
            </div>
            <h3 className="fw-bold mb-1" style={{ color: '#4a00e0' }}>Admin Portal</h3>
            <div className="text-muted mb-2" style={{ fontSize: 15 }}>Sign in to your admin account</div>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit} autoComplete="on">
            <Form.Group className="mb-3" controlId="adminEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter admin email"
                autoFocus
                autoComplete="username"
                aria-label="Admin email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="adminPassword">
              <Form.Label>Password</Form.Label>
              <div className="input-group">
                <Form.Control
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  autoComplete="current-password"
                  aria-label="Password"
                />
                <Button
                  variant="outline-secondary"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  tabIndex={-1}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <i className="fas fa-eye-slash"></i> : <i className="fas fa-eye"></i>}
                </Button>
              </div>
            </Form.Group>
            {/* Terms, Privacy, Security Checkbox */}
            <Form.Group className="mb-3" controlId="terms">
              <Form.Check
                type="checkbox"
                required
                label={<span>I agree to the <Link to="/policies/terms" target="_blank" style={{color:'#1976d2',textDecoration:'underline'}}>Terms</Link>, <Link to="/policies/privacy" target="_blank" style={{color:'#1976d2',textDecoration:'underline'}}>Privacy Policy</Link>, and <Link to="/policies/security" target="_blank" style={{color:'#1976d2',textDecoration:'underline'}}>Security Policy</Link></span>}
              />
            </Form.Group>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Link to="/admin/forgot-password" className="small" style={{ color: '#4a00e0' }}>Forgot password?</Link>
            </div>
            <Button type="submit" variant="primary" disabled={loading} className="w-100 fw-bold py-2" style={{ background: 'linear-gradient(90deg, #4a00e0 0%, #8e2de2 100%)', border: 'none' }}>
              {loading ? <Spinner size="sm" /> : 'Login'}
            </Button>
          </Form>
          <div className="text-center mt-4">
            <span className="text-muted small">Not an admin? </span>
            <Link to="/login" className="small" style={{ color: '#4a00e0' }}>User Login</Link>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminLoginPage;
