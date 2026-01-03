import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Password strength validation helper
  const isStrongPassword = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pwd);
  };

  // Password strength meter
  const getStrength = (pwd) => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(pwd)) score++;
    return score;
  };
  const strength = getStrength(password);
  const strengthLabel = [
    'Too short',
    'Weak',
    'Fair',
    'Good',
    'Strong',
    'Very strong',
  ][strength];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    if (!isStrongPassword(password)) {
      setError('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    setLoading(true);
    try {
      await axios.post(`/api/password/reset-password/${token}`, { password });
      setMessage('Password reset successful! You can now log in.');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Form onSubmit={handleSubmit} className="p-4 shadow rounded bg-white" style={{ minWidth: 320 }}>
        <h3 className="mb-3">Reset Password</h3>
        {message && <Alert variant="success">{message}</Alert>}
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3" controlId="password">
          <Form.Label>New Password</Form.Label>
          <Form.Control
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter new password"
            isInvalid={!!error && !isStrongPassword(password)}
          />
          <div style={{ marginTop: 4 }}>
            <div style={{ height: 6, background: '#eee', borderRadius: 3 }}>
              <div style={{ width: `${(strength / 5) * 100}%`, height: 6, background: strength >= 4 ? '#4a00e0' : '#ff9800', borderRadius: 3, transition: 'width 0.3s' }} />
            </div>
            <small style={{ color: strength >= 4 ? '#4a00e0' : '#ff9800' }}>{strengthLabel}</small>
          </div>
        </Form.Group>
        <Form.Group className="mb-3" controlId="confirmPassword">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm new password"
          />
        </Form.Group>
        <Button type="submit" variant="primary" disabled={loading} className="w-100">
          {loading ? 'Resetting...' : 'Reset Password'}
        </Button>
      </Form>
    </div>
  );
};

export default ResetPasswordPage;
