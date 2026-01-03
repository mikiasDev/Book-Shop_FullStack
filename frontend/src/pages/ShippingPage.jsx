import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Card, ListGroup, Image, FloatingLabel } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { FaShippingFast, FaArrowLeft } from 'react-icons/fa';
import CheckoutSteps from '../components/cart/CheckoutSteps';
import { saveShippingAddress } from '../redux/slices/cartSlice';

const ShippingPage = () => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress, cartItems } = cart;
  const [address, setAddress] = useState(shippingAddress?.address || '');
  const [city, setCity] = useState(shippingAddress?.city || '');
  const [postalCode, setPostalCode] = useState(shippingAddress?.postalCode || '');
  const [country, setCountry] = useState(shippingAddress?.country || '');
  const [phone, setPhone] = useState(shippingAddress?.phone || '');
  // const [submitted, setSubmitted] = useState(false); // Not used
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0).toFixed(2);
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const totalPrice = (Number(itemsPrice) + Number(shippingPrice)).toFixed(2);
  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, city, postalCode, country, phone }));
    navigate('/placeorder');
  };
  return (
    <>
      <div className="bg-light min-vh-100 py-5">
        <Container>
          <CheckoutSteps step1 step2 />
          <Row className="g-5 mt-4">
            <Col lg={8}>
              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4 p-md-5">
                  <h3 className="mb-4 fw-bold d-flex align-items-center">
                    <FaShippingFast className="text-primary me-3" /> 
                    Shipping Details
                  </h3>
                  <Form onSubmit={submitHandler}>
                    <Row className="mb-3">
                      <Col md={12}>
                        <FloatingLabel controlId="phone" label="Contact Number" className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="(555) 123-4567"
                            value={phone}
                            required
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </FloatingLabel>
                      </Col>
                    </Row>
                    <FloatingLabel controlId="address" label="Street Address" className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="123 Main St"
                        value={address}
                        required
                        onChange={(e) => setAddress(e.target.value)}
                      />
                    </FloatingLabel>
                    <Row>
                      <Col md={6}>
                        <FloatingLabel controlId="city" label="City" className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="New York"
                            value={city}
                            required
                            onChange={(e) => setCity(e.target.value)}
                          />
                        </FloatingLabel>
                      </Col>
                      <Col md={6}>
                        <FloatingLabel controlId="postalCode" label="Postal Code" className="mb-3">
                          <Form.Control
                            type="text"
                            placeholder="10001"
                            value={postalCode}
                            required
                            onChange={(e) => setPostalCode(e.target.value)}
                          />
                        </FloatingLabel>
                      </Col>
                    </Row>
                    <FloatingLabel controlId="country" label="Country" className="mb-4">
                      <Form.Control
                        type="text"
                        placeholder="United States"
                        value={country}
                        required
                        onChange={(e) => setCountry(e.target.value)}
                      />
                    </FloatingLabel>
                    <div className="d-flex justify-content-between align-items-center mt-5">
                      <Link to="/cart" className="text-decoration-none text-muted fw-bold">
                        <FaArrowLeft className="me-2" /> Back to Cart
                      </Link>
                      <Button type="submit" variant="primary" size="lg" className="px-5 shadow-sm fw-bold">
                        Continue to Payment
                      </Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </Col>

            {/* RIGHT COLUMN: Order Summary Sidepanel */}
            <Col lg={4}>
              <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px', zIndex: 1 }}>
                <Card.Header className="bg-white border-bottom py-3">
                  <h5 className="mb-0 fw-bold">Order Summary</h5>
                </Card.Header>
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    {/* Scrollable list of items */}
                    <div className="p-3 bg-light" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                      {cartItems.map((item, index) => (
                        <div key={index} className="d-flex align-items-center mb-3 bg-white p-2 rounded shadow-sm">
                          <Image 
                            src={item.image} 
                            alt={item.name} 
                            rounded 
                            style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                          />
                          <div className="ms-3 flex-grow-1">
                            <div className="fw-bold">{item.name}</div>
                            <div className="text-muted small">Qty: {item.qty}</div>
                          </div>
                          <div className="fw-bold">${(item.price * item.qty).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center bg-transparent border-0 px-3 py-2">
                      <span className="fw-bold">Subtotal</span>
                      <span>${itemsPrice}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center bg-transparent border-0 px-3 py-2">
                      <span className="fw-bold">Shipping</span>
                      <span>{shippingPrice === 0 ? <span className="text-success">Free</span> : `$${shippingPrice}`}</span>
                    </ListGroup.Item>
                    <ListGroup.Item className="d-flex justify-content-between align-items-center bg-transparent border-0 px-3 py-2">
                      <span className="fw-bold">Total</span>
                      <span className="text-primary fw-bold">${totalPrice}</span>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

export default ShippingPage;