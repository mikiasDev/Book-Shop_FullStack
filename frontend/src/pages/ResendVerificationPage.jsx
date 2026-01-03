import React, { useState } from 'react';
import { useResendVerificationMutation } from '../redux/slices/userApiSlice';
import { Container, Form, Button, Alert, Card } from 'react-bootstrap';

const ResendVerificationPage = () => {
  const [email, setEmail] = useState('');
  const [resendVerification, { isLoading }] = useResendVerificationMutation();
  const [status, setStatus] = useState('idle'); // idle, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('idle');
    setMessage('');
    try {
      await resendVerification({ email }).unwrap();
      setStatus('success');
      setMessage('Verification email sent! Please check your inbox.');
    } catch (err) {
      setStatus('error');
      setMessage(err?.data?.message || 'Failed to send verification email.');
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center py-5 min-vh-100">
      <Card className="shadow-sm p-4 text-center" style={{ maxWidth: '400px', width: '100%' }}>
        <Card.Body>
          <h2 className="mb-4">Resend Verification Email</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isLoading} className="w-100">
              {isLoading ? 'Sending...' : 'Resend Email'}
            </Button>
          </Form>
          {status === 'success' && <Alert variant="success" className="mt-3">{message}</Alert>}
          {status === 'error' && <Alert variant="danger" className="mt-3">{message}</Alert>}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ResendVerificationPage;
