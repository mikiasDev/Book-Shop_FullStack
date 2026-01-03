import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    setResent(false);
    try {
      await axios.post('/api/password/forgot-password', { email });
      setMessage('If your email exists, a password reset link has been sent.');
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong. Please check your email and try again.');
    }
    setLoading(false);
  };

  const handleResend = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      await axios.post('/api/password/forgot-password', { email });
      setResent(true);
      setMessage('Reset link resent. Please check your email.');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to resend. Please try again later.');
    }
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white" style={{ minWidth: 320 }}>
        <h3 className="mb-3">Forgot Password</h3>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3" controlId="email">
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </Form.Group>
        <Button type="submit" variant="primary" disabled={loading} className="w-100">
          {loading ? 'Sending...' : 'Send Reset Link'}
        </Button>
        <div className="mt-2 text-center">
          <Button variant="link" size="sm" onClick={handleResend} disabled={loading || !email} style={{ textDecoration: 'underline' }}>
            Resend reset link
          </Button>
          {resent && <div style={{ color: '#4a00e0', fontSize: 13 }}>Link resent!</div>}
        </div>
      </Form>
    </div>
  );
};

export default ForgotPasswordPage;
