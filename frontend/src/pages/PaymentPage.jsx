import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Col, Container, Form, ListGroup, Row, Alert } from 'react-bootstrap';
import CheckoutSteps from '../components/cart/CheckoutSteps';

const bankAccounts = {
  CBE: '1000529312637',
  Abyssinia: '3376238976',
  Telebirr: '1000529312637',
};
const phoneNumber = '0918527553';

const PaymentPage = () => {
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentProof, setPaymentProof] = useState(null);
  const [paymentId, setPaymentId] = useState('');
  const [formError, setFormError] = useState('');
  const [readyToConfirm, setReadyToConfirm] = useState(false);
  const [finished, setFinished] = useState(false);

  const itemsPrice = cart.cartItems ? cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) : 0;
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice)).toFixed(2);

  const handleMadePayment = (e) => {
    e.preventDefault();
    setFormError('');
    if (!paymentMethod) {
      setFormError('Please select a payment method.');
      return;
    }
    if (!paymentProof) {
      setFormError('Please upload your payment proof.');
      return;
    }
    if (!paymentId.trim()) {
      setFormError('Please enter your Payment ID or Transaction Reference.');
      return;
    }
    setReadyToConfirm(true);
  };

  const handleConfirm = () => {
    setFinished(true);
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  if (finished) {
    return (
      <div className="bg-light min-vh-100 py-5 d-flex align-items-center justify-content-center" style={{minHeight:'60vh'}}>
        <h2 className="text-success fw-bold">Thank you! Your payment is confirmed.</h2>
      </div>
    );
  }

  return (
    <div className="bg-light min-vh-100 py-5">
      <Container>
        <CheckoutSteps step1 step2 step3 step4 />
        <Row className="g-5 mt-4">
          <Col lg={8}>
            <Card className="border-0 shadow-sm mb-4">
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-3">Select Payment Method</h4>
                <Form>
                  <Form.Check
                    type="radio"
                    id="CBE"
                    label="CBE Bank"
                    name="paymentMethod"
                    value="CBE"
                    checked={paymentMethod === 'CBE'}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    id="Abyssinia"
                    label="Abyssinia Bank"
                    name="paymentMethod"
                    value="Abyssinia"
                    checked={paymentMethod === 'Abyssinia'}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="mb-2"
                  />
                  <Form.Check
                    type="radio"
                    id="Telebirr"
                    label="Telebirr"
                    name="paymentMethod"
                    value="Telebirr"
                    checked={paymentMethod === 'Telebirr'}
                    onChange={e => setPaymentMethod(e.target.value)}
                    className="mb-2"
                  />
                </Form>
                {paymentMethod && (
                  <Alert variant="info" className="mt-4">
                    <div><strong>Account Number:</strong> {bankAccounts[paymentMethod]}</div>
                    <div><strong>Phone Number:</strong> {phoneNumber}</div>
                  </Alert>
                )}
                {!readyToConfirm && (
                  <Form className="mt-4" onSubmit={handleMadePayment}>
                    <Form.Group className="mb-3" controlId="paymentProof">
                      <Form.Label>Upload Payment Proof <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*,application/pdf"
                        required
                        onChange={e => setPaymentProof(e.target.files[0] || null)}
                      />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="paymentId">
                      <Form.Label>Payment ID / Transaction Reference <span className="text-danger">*</span></Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Enter Payment ID or Reference"
                        required
                        value={paymentId}
                        onChange={e => setPaymentId(e.target.value)}
                      />
                    </Form.Group>
                    {formError && <Alert variant="danger">{formError}</Alert>}
                    <Button
                      type="submit"
                      variant="success"
                      size="lg"
                      className="fw-bold w-100 mt-2"
                      disabled={!paymentMethod || !paymentProof || !paymentId}
                    >
                      I Have Made Payment
                    </Button>
                  </Form>
                )}
                {readyToConfirm && (
                  <div className="mt-4 text-center">
                    <Button
                      variant="primary"
                      size="lg"
                      className="fw-bold w-100"
                      onClick={handleConfirm}
                    >
                      Confirm
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
          <Col lg={4}>
            <Card className="border-0 shadow-sm">
              <Card.Body>
                <h5 className="fw-bold mb-3">Order Summary</h5>
                <ListGroup variant="flush">
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Items</span>
                    <span>${itemsPrice.toFixed(2)}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Shipping</span>
                    <span>{shippingPrice === 0 ? 'Free' : `$${shippingPrice}`}</span>
                  </ListGroup.Item>
                  <ListGroup.Item className="d-flex justify-content-between">
                    <span>Total</span>
                    <span className="fw-bold text-primary">${totalPrice}</span>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PaymentPage;