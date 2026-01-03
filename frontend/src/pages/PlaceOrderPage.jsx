import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Row, Col, ListGroup, Card, Container } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaReceipt, FaShieldAlt } from 'react-icons/fa';
import CheckoutSteps from '../components/cart/CheckoutSteps';
import Message from '../components/common/Message';
import Loader from '../components/common/Loader';

const PlaceOrderPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const [reviewConfirmed, setReviewConfirmed] = useState(false);
  const itemsPrice = cart.cartItems ? cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0) : 0;
  const shippingPrice = itemsPrice > 100 ? 0 : 10;
  const taxPrice = Number((0.08 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice + taxPrice).toFixed(2);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!cart.shippingAddress || !cart.shippingAddress.address) {
      navigate('/shipping');
    }
  }, [cart.shippingAddress, navigate]);

  const placeOrderHandler = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      // Simulate order placement
      navigate('/payment');
    }, 1000);
  };

  return (
    <Container className="py-5">
      <CheckoutSteps step1 step2 step3 step4 />
      <Row className="g-5 mt-4">
        <Col lg={8}>
          <Card className="border-0 shadow-sm mb-4">
            <Card.Body className="p-4">
              <h4 className="fw-bold mb-3">Order Items</h4>
              {cart.cartItems && cart.cartItems.length > 0 ? (
                <ListGroup variant="flush">
                  {cart.cartItems.map((item) => (
                    <ListGroup.Item key={item._id} className="border-0 px-0 py-3">
                      <Row className="align-items-center">
                        <Col xs={12} sm={8}>
                          <Link to={`/product/${item._id}`} className="text-decoration-none text-dark fw-bold">
                            {item.name}
                          </Link>
                          <p className="text-muted small mb-0">Qty: {item.qty}</p>
                        </Col>
                        <Col xs={12} sm={4} className="text-sm-end mt-2 mt-sm-0">
                          <span className="text-muted">{item.qty} x ${item.price} = </span>
                          <span className="fw-bold">${(item.qty * item.price).toFixed(2)}</span>
                        </Col>
                      </Row>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <Message variant="info">Your cart is empty.</Message>
              )}
            </Card.Body>
          </Card>
        </Col>
        <Col lg={4}>
          <Card className="border-0 shadow-sm sticky-top" style={{ top: '20px', zIndex: 1 }}>
            <Card.Header className="bg-white border-bottom py-3">
              <h5 className="mb-0 fw-bold d-flex align-items-center">
                <FaReceipt className="me-2 text-primary" /> Order Summary
              </h5>
            </Card.Header>
            <Card.Body className="p-4">
              <ListGroup variant='flush' className="bg-transparent">
                <ListGroup.Item className="bg-transparent d-flex justify-content-between border-0 px-0 py-2">
                  <span className="text-muted">Items</span>
                  <span className="fw-bold">${itemsPrice.toFixed(2)}</span>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent d-flex justify-content-between border-0 px-0 py-2">
                  <span className="text-muted">Shipping</span>
                  <span className="fw-bold">{shippingPrice === 0 ? 'Free' : `$${shippingPrice}`}</span>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent d-flex justify-content-between border-0 px-0 py-2">
                  <span className="text-muted">Tax</span>
                  <span className="fw-bold">${taxPrice.toFixed(2)}</span>
                </ListGroup.Item>
                <hr className="my-3" />
                <ListGroup.Item className="bg-transparent d-flex justify-content-between border-0 px-0 py-2">
                  <span className="h5 fw-bold mb-0">Total</span>
                  <span className="h4 fw-bold text-primary mb-0">${totalPrice}</span>
                </ListGroup.Item>
                <ListGroup.Item className="bg-transparent px-0 pt-3">
                  {error && (
                    <Message variant='danger'>{error}</Message>
                  )}
                </ListGroup.Item>
                <div className="mb-3">
                  <input
                    type="checkbox"
                    id="reviewConfirm"
                    checked={reviewConfirmed}
                    onChange={e => setReviewConfirmed(e.target.checked)}
                    className="form-check-input me-2"
                  />
                  <label htmlFor="reviewConfirm" className="form-check-label">
                    I have reviewed my order and confirm the details
                  </label>
                </div>
                <Button
                  type='button'
                  className='w-100 py-3 fw-bold shadow-sm'
                  disabled={cart.cartItems && cart.cartItems.length === 0 || !reviewConfirmed}
                  onClick={placeOrderHandler}
                  size="lg"
                >
                  Confirm & Continue to Payment
                </Button>
                {isLoading && <div className="mt-3"><Loader /></div>}
              </ListGroup>
            </Card.Body>
            <Card.Footer className="bg-light text-center py-3 border-top-0">
              <small className="text-muted d-flex align-items-center justify-content-center">
                <FaShieldAlt className="me-2" /> Secure Transaction
              </small>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default PlaceOrderPage;