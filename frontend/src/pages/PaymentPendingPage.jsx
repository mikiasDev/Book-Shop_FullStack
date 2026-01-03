import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { FaHourglassHalf, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const PaymentPendingPage = () => {
  const navigate = useNavigate();
  return (
    <Container className="py-5 d-flex flex-column align-items-center justify-content-center min-vh-100">
      <Card className="shadow-sm p-4 text-center" style={{ maxWidth: 480 }}>
        <FaHourglassHalf size={48} className="text-warning mb-3" />
        <h2 className="fw-bold mb-3">Payment Pending Verification</h2>
        <p className="mb-4 text-muted">
          Thank you for submitting your payment. Your payment proof has been received and is pending manual verification by our team. You will receive an email or notification once your payment is confirmed and your book(s) are available for download.
        </p>
        <Button variant="outline-primary" onClick={() => navigate('/')}>Back to Home</Button>
      </Card>
    </Container>
  );
};

export default PaymentPendingPage;
