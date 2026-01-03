import React, { useState } from 'react';
import { Form, Button, Alert, Card } from 'react-bootstrap';
import axios from 'axios';

const AdminForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await axios.post('/api/staff/forgot-password', { email });
      setMessage('If your email exists, a password reset link has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #4a00e0 0%, #8e2de2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card className="shadow-lg border-0" style={{ maxWidth: 400, width: '100%' }}>
        <Card.Body className="p-4">
          <h3 className="mb-3 text-center" style={{ color: '#4a00e0' }}>Admin Password Reset</h3>
          {message && (
            <>
              <Alert variant="success">{message}</Alert>
              <div className="mb-3 text-center text-muted small">
                Please check your email for a password reset link.<br />
                If you don't see it, check your spam folder.<br />
              </div>
              <Button variant="outline-primary" className="w-100 mt-2" href="/admin/login">
                Return to Login
              </Button>
            </>
          )}
          {error && <Alert variant="danger">{error}</Alert>}
          {!message && (
            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-3" controlId="email">
                <Form.Label>Email address</Form.Label>
                <Form.Control
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your admin email"
                />
              </Form.Group>
              <Button type="submit" variant="primary" disabled={loading} className="w-100">
                {loading ? 'Sending...' : 'Send Reset Link'}
              </Button>
            </Form>
          )}
        </Card.Body>
      </Card>
    </div>
  );
};

export default AdminForgotPasswordPage;
