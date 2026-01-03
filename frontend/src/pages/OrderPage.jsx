import React, { useState, useEffect } from 'react';
import BookDownloadButton from '../components/books/BookDownloadButton';
import { Link, useParams } from 'react-router-dom';
import { Row, Col, ListGroup, Image, Card, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useSelector } from 'react-redux';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';

import Message from '../components/common/Message';
import Loader from '../components/common/Loader';
import {
  useGetOrderDetailsQuery,
  usePayOrderMutation,
  useCreatePaymentIntentMutation,
  useDeliverOrderMutation,
} from '../redux/slices/ordersApiSlice';

// --- STYLING FOR THE CARD INPUT ---
const cardStyle = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4',
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a',
    },
  },
};

// --- CHECKOUT FORM COMPONENT ---
const CheckoutForm = ({ order, refetch }) => {
  const stripe = useStripe();
  const elements = useElements();
  
  const [payOrder] = usePayOrderMutation();
  const [createPaymentIntent] = useCreatePaymentIntentMutation();
  
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [clientSecret, setClientSecret] = useState('');

  useEffect(() => {
    // Create PaymentIntent as soon as the component loads
    if (order) {
      createPaymentIntent({ amount: Math.round(order.totalPrice * 100) }) // Amount in cents
        .unwrap()
        .then((res) => setClientSecret(res.clientSecret))
        .catch((err) => console.error(err));
    }
  }, [order, createPaymentIntent]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret) {
      return;
    }

    setProcessing(true);

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
        billing_details: {
          name: order.user.name,
          email: order.user.email,
        },
      },
    });

    if (payload.error) {
      setError(`Payment failed: ${payload.error.message}`);
      setProcessing(false);
    } else {
      // Payment Successful - Update Database
      try {
        await payOrder({
          orderId: order._id,
          details: {
            id: payload.paymentIntent.id,
            status: payload.paymentIntent.status,
            update_time: String(Date.now()),
            email_address: order.user.email,
          },
        }).unwrap();
        
        refetch(); // Reload page to show "Paid" status
        toast.success('Bybit Card Payment Successful!');
        setProcessing(false);
      } catch (err) {
        setError(err?.data?.message || err.message);
        setProcessing(false);
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <div className="mb-3 p-3 border rounded bg-light">
        <h6 className="mb-3 text-muted">Enter Bybit / Mastercard Details:</h6>
        <CardElement id="card-element" options={cardStyle} />
      </div>
      
      {error && <Message variant="danger">{error}</Message>}
      
      <Button
        disabled={processing || !stripe || !clientSecret}
        id="submit"
        type="submit"
        variant="warning" // Bybit Orange/Yellow Theme
        className="w-100"
      >
        <span id="button-text">
          {processing ? <Loader size="sm" /> : `Pay $${order.totalPrice}`}
        </span>
      </Button>
    </Form>
  );
};

// --- MAIN ORDER PAGE ---
const OrderPage = () => {
  const { id: orderId } = useParams();
  const { data: order, refetch, isLoading, error } = useGetOrderDetailsQuery(orderId);
  
  const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
  const { userInfo } = useSelector((state) => state.auth);

  // Load Stripe (Replace with your own Publishable Key)
  const [stripePromise] = useState(() => 
    loadStripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE') 
  );

  const deliverHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success('Order delivered');
    } catch (err) {
      toast.error(err?.data?.message || err.message);
    }
  };

  return isLoading ? (
    <Loader />
  ) : error ? (
    <Message variant='danger'>{error?.data?.message || error.error}</Message>
  ) : (
    <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <>
        <Button variant="outline-secondary" className="mb-3" onClick={() => window.history.back()}>
          &larr; Back
        </Button>
        <h1>Order {order._id}</h1>
        <Row>
          <Col md={8}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h2>Shipping</h2>
                <p>
                  <strong>Name: </strong> {order.user.name}
                </p>
                <p>
                  <strong>Email: </strong>{' '}
                  <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
                </p>
                <p>
                  <strong>Address: </strong>
                  {order.shippingAddress.address}, {order.shippingAddress.city}{' '}
                  {order.shippingAddress.postalCode},{' '}
                  {order.shippingAddress.country}
                </p>
                {order.isDelivered ? (
                  <Message variant='success'>
                    Delivered on {order.deliveredAt || 'now'}
                  </Message>
                ) : order.paymentProof && order.paymentProof.status === 'Verified' ? (
                  <Message variant='success'>Delivered (auto after payment)</Message>
                ) : (
                  <Message variant='danger'>Not Delivered</Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Payment Method</h2>
                <p>
                  <strong>Method: </strong>
                  {order.paymentMethod === 'BybitCard' ? 'Bybit Card (Mastercard)' : order.paymentMethod}
                </p>
                {order.isPaid ? (
                  <Message variant='success'>Paid on {order.paidAt || 'now'}</Message>
                ) : order.paymentProof && order.paymentProof.status === 'Verified' ? (
                  <Message variant='success'>Paid (auto after payment)</Message>
                ) : (
                  <Message variant='danger'>Not Paid</Message>
                )}
              </ListGroup.Item>

              <ListGroup.Item>
                <h2>Order Items</h2>
                {order.orderItems.length === 0 ? (
                  <Message>Order is empty</Message>
                ) : (
                  <ListGroup variant='flush'>
                    {order.orderItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row className="align-items-center">
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} x ${item.price} = $
                            {(item.qty * item.price).toFixed(2)}
                          </Col>
                          <Col md={3} className="text-end">
                            <BookDownloadButton 
                              bookId={item.product}
                              fileUrl={item.fileUrl}
                              isPaid={order.isPaid || (order.paymentProof && order.paymentProof.status === 'Verified')}
                            />
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={4}>
            <Card>
              <ListGroup variant='flush'>
                <ListGroup.Item>
                  <h2>Order Summary</h2>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Items</Col>
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Shipping</Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Tax</Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item>
                  <Row>
                    <Col>Total</Col>
                    <Col>${order.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                
                {/* Payment UI removed as requested */}

                {loadingDeliver && <Loader />}

                {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                  <ListGroup.Item>
                    <Button
                      type='button'
                      className='btn btn-block'
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </Button>
                  </ListGroup.Item>
                )}

              </ListGroup>
            </Card>
          </Col>
        </Row>
      </>
    </main>
  );
};

export default OrderPage;