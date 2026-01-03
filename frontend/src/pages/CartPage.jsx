import React, { useState } from 'react';
import styles from './CartPage.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  Container, Row, Col, Card, Button, ListGroup, Image, Form, 
  Badge, ProgressBar 
} from 'react-bootstrap';
import { 
  FaTrash, FaArrowLeft, FaShoppingBag, FaLock, FaPlus, FaMinus, 
  FaHeart, FaGift, FaTruck 
} from 'react-icons/fa';
import { addToCart, removeFromCart } from '../redux/slices/cartSlice';
import { toast } from 'react-toastify';

// Mock data for recommendations (Replace with API call in real app)
const recommendedBooks = [
  { _id: 'rec1', name: 'The Art of Code', author: 'Jane Doe', price: 29.99, image: '/images/sample-book-1.jpg' },
  { _id: 'rec2', name: 'System Design', author: 'John Smith', price: 34.50, image: '/images/sample-book-2.jpg' },
  { _id: 'rec3', name: 'React Mastery', author: 'Mike Dev', price: 24.99, image: '/images/sample-book-3.jpg' },
];

const CartPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [selectedItems, setSelectedItems] = useState([]);

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;
  const { userInfo } = useSelector((state) => state.auth);

  // Calculations
  // Only count selected items
  const itemsCount = selectedItems.length > 0
    ? selectedItems.reduce((acc, item) => acc + item.qty, 0)
    : cartItems.reduce((acc, item) => acc + item.qty, 0);
  const subtotal = selectedItems.length > 0
    ? selectedItems.reduce((acc, item) => acc + item.qty * item.price, 0)
    : cartItems.reduce((acc, item) => acc + item.qty * item.price, 0);
  const freeShippingThreshold = 100;
  const progress = Math.min((subtotal / freeShippingThreshold) * 100, 100);
  const shippingFee = subtotal >= freeShippingThreshold ? 0 : 10;
  const tax = subtotal * 0.08;
  const total = subtotal + shippingFee + tax;

  const addToCartHandler = async (product, qty) => {
    // Ensure countInStock and image fields exist for recommended books
    const item = {
      ...product,
      qty,
      countInStock: product.countInStock || 10, // Default to 10 if not present
      image: product.image || '/images/default-avatar.png',
    };
    dispatch(addToCart(item));
    toast.success('Cart updated!');
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
    toast.info('Item removed');
  };


  return (
    <main className={styles['cart-main-bg'] + ' min-vh-100 py-5'} style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <Container>
        
        {/* Header Section */}
        <div className="d-flex align-items-center justify-content-between mb-4">
          <h2 className={"fw-bold mb-0 " + styles['cart-header']}>Shopping Cart ({itemsCount})</h2>
          <Link to="/" className={"text-decoration-none fw-bold " + styles['cart-link']}>
            <FaArrowLeft className="me-2" /> Continue Shopping
          </Link>
        </div>

        {Array.isArray(cartItems) && cartItems.length === 0 ? (
          <EmptyCartState />
        ) : (
          <Row className="g-4">
            
            {/* LEFT COLUMN: Cart Items */}
            <Col lg={8}>
              
              {/* Free Shipping Progress Bar */}
              <Card className={"border-0 shadow-sm mb-4 " + styles['cart-card']}>
                <Card.Body>
                  <div className="d-flex justify-content-between align-items-center mb-2">
                    <span className="fw-bold text-success">
                      {progress === 100 ? '🎉 You have unlocked Free Shipping!' : `Add $${(freeShippingThreshold - subtotal).toFixed(2)} for Free Shipping`}
                    </span>
                    <FaTruck className={progress === 100 ? 'text-success' : 'text-muted'} />
                  </div>
                  <ProgressBar 
                    now={progress} 
                    variant={progress === 100 ? "success" : "info"} 
                    style={{ height: '8px', borderRadius: '4px' }} 
                  />
                </Card.Body>
              </Card>

              {/* Cart List */}
              <Card className={"border-0 shadow-sm mb-4 " + styles['cart-card']}>
                <Card.Body className="p-0">
                  <ListGroup variant="flush">
                    {cartItems.map((item) => (
                      <ListGroup.Item key={item._id} className={"p-4 border-bottom " + styles['cart-list-item']}>
                        <Row className="align-items-center">
                          {/* Select Checkbox */}
                          <Col xs={1} className="text-center">
                            <Form.Check
                              type="checkbox"
                              checked={selectedItems.some(i => i._id === item._id)}
                              onChange={e => {
                                if (e.target.checked) {
                                  setSelectedItems(prev => [...prev, item]);
                                } else {
                                  setSelectedItems(prev => prev.filter(i => i._id !== item._id));
                                }
                              }}
                              aria-label={`Select ${item.name}`}
                            />
                          </Col>
                          {/* Image */}
                          <Col xs={3} sm={2}>
                            <Image src={item.image} alt={item.name} fluid rounded className="border" />
                          </Col>

                          {/* Details */}
                          <Col xs={9} sm={5}>
                            <Link to={`/product/${item._id}`} className={"text-dark text-decoration-none " + styles['cart-link']}>
                              <h5 className="mb-1 fw-bold" style={{ color: 'var(--color-text, #212529)' }}>{item.name}</h5>
                            </Link>
                            <p className="text-muted small mb-1">by {item.author}</p>
                            <Badge bg="light" text="dark" className="border">Hardcover</Badge>
                          </Col>

                          {/* Qty & Price */}
                          <Col xs={12} sm={5} className="mt-3 mt-sm-0 d-flex justify-content-between align-items-center">
                            <div className="input-group input-group-sm" style={{ width: '110px' }}>
                              <Button 
                                variant="outline-secondary" 
                                onClick={() => addToCartHandler(item, item.qty - 1)}
                                disabled={item.qty <= 1}
                              >
                                <FaMinus size={10} />
                              </Button>
                              <Form.Control 
                                className={"text-center " + styles['cart-input-bg']}
                                value={item.qty} 
                                readOnly 
                              />
                              <Button 
                                variant="outline-secondary" 
                                onClick={() => addToCartHandler(item, item.qty + 1)}
                                disabled={item.qty >= item.countInStock}
                              >
                                <FaPlus size={10} />
                              </Button>
                            </div>

                            <div className="text-end">
                              <h5 className="mb-0 fw-bold" style={{ color: 'var(--color-text, #212529)' }}>${(item.price * item.qty).toFixed(2)}</h5>
                              <small className="text-muted" style={{ color: 'var(--color-textMuted, #bdbdbd)' }}>${item.price} each</small>
                            </div>
                            
                            <Button 
                              variant="link" 
                              className="text-danger p-0 ms-3"
                              onClick={() => removeFromCartHandler(item._id)}
                            >
                              <FaTrash />
                            </Button>
                          </Col>
                        </Row>
                        
                        {/* Utility Links */}
                        <div className="d-flex gap-3 mt-2 ms-sm-auto justify-content-end">
                          <small className="text-muted cursor-pointer hover-primary">
                            <FaHeart className="me-1" /> Save for later
                          </small>
                          <small className="text-muted cursor-pointer hover-primary">
                            <FaGift className="me-1" /> Add gift wrap
                          </small>
                        </div>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </Card.Body>
              </Card>

              {/* Recommendations Section */}
              <h4 className="fw-bold mb-3" style={{ color: 'var(--color-text, #212529)' }}>You might also like</h4>
              <Row className="g-3">
                {recommendedBooks.map(book => (
                  <Col md={4} key={book._id}>
                    <Card className={"h-100 border-0 shadow-sm " + styles['cart-card']}>
                      <div className="position-relative">
                        <Card.Img variant="top" src={book.image} style={{ height: '150px', objectFit: 'cover' }} />
                        <Badge bg="danger" className="position-absolute top-0 start-0 m-2">Hot</Badge>
                      </div>
                      <Card.Body className="p-3">
                        <h6 className="text-truncate fw-bold" style={{ color: 'var(--color-text, #212529)' }}>{book.name}</h6>
                        <p className="small text-muted mb-2" style={{ color: 'var(--color-textMuted, #bdbdbd)' }}>{book.author}</p>
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="fw-bold">${book.price}</span>
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="rounded-circle p-2"
                            onClick={() => { addToCartHandler(book, 1); navigate('/cart'); }}
                          >
                            <FaPlus />
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

            </Col>

            {/* RIGHT COLUMN: Summary */}
            <Col lg={4}>
              <Card className={"border-0 shadow-sm sticky-top " + styles['cart-summary']} style={{ top: '90px', zIndex: 1 }}>
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4" style={{ color: 'var(--color-text, #212529)' }}>Order Summary</h5>
                  
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted" style={{ color: 'var(--color-textMuted, #bdbdbd)' }}>Subtotal</span>
                    <span className="fw-bold" style={{ color: 'var(--color-text, #212529)' }}>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted" style={{ color: 'var(--color-textMuted, #bdbdbd)' }}>Shipping</span>
                    <span className={shippingFee === 0 ? "text-success fw-bold" : "fw-bold"} style={{ color: shippingFee === 0 ? 'var(--success-color, #28a745)' : 'var(--color-text, #212529)' }}>
                      {shippingFee === 0 ? 'Free' : `$${shippingFee}`}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between mb-3">
                    <span className="text-muted" style={{ color: 'var(--color-textMuted, #bdbdbd)' }}>Estimated Tax</span>
                    <span className="fw-bold" style={{ color: 'var(--color-text, #212529)' }}>${tax.toFixed(2)}</span>
                  </div>
                  
                  <hr className="my-3" />
                  
                  <div className="d-flex justify-content-between mb-4">
                    <span className="h5 fw-bold" style={{ color: 'var(--color-text, #212529)' }}>Total</span>
                    <span className="h4 fw-bold text-primary" style={{ color: 'var(--primary-color, #4a00e0)' }}>${total.toFixed(2)}</span>
                  </div>



                  <Button 
                    variant="primary" 
                    size="lg" 
                    className={"w-100 mb-3 fw-bold shadow-sm " + styles['cart-btn-gradient']}
                    onClick={() => {
                      // Store only selected items for checkout
                      if (selectedItems.length > 0) {
                        localStorage.setItem('selectedCartItems', JSON.stringify(selectedItems));
                      } else {
                        localStorage.removeItem('selectedCartItems');
                      }
                      if (userInfo) navigate('/shipping');
                      else navigate('/login?redirect=/shipping');
                    }}
                    disabled={cartItems.length === 0 || (selectedItems.length === 0 && cartItems.length > 1)}
                  >
                    Proceed to Checkout
                  </Button>
                  
                  <div className="text-center text-muted small">
                    <FaLock className="me-1" /> Secure Checkout
                  </div>
                  
                  <div className="d-flex justify-content-center gap-2 mt-3 opacity-50">
                    <i className="fab fa-cc-visa fa-lg"></i>
                    <i className="fab fa-cc-mastercard fa-lg"></i>
                    <i className="fab fa-cc-paypal fa-lg"></i>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        )}
      </Container>
    </main>
  );
};

// Sub-component for Empty State to keep main code clean
const EmptyCartState = () => (
  <div className={"text-center py-5 " + styles['cart-empty-bg']}>
    <div className="mb-4">
      <div className="rounded-circle d-inline-flex align-items-center justify-content-center shadow-sm" style={{ width: '120px', height: '120px', background: 'var(--card-bg, #fff)' }}>
        <FaShoppingBag size={50} className="text-muted opacity-50" />
      </div>
    </div>
    <h2 className="fw-bold mb-3" style={{ color: 'var(--color-text, #212529)' }}>Your cart is empty</h2>
    <p className="text-muted mb-4" style={{ maxWidth: '400px', margin: '0 auto', color: 'var(--color-textMuted, #bdbdbd)' }}>
      Looks like you haven't added anything to your cart yet. Explore our top categories to find your next favorite read.
    </p>
    <div className="d-flex justify-content-center gap-3 mb-5">
      <Button variant="primary" size="lg" as={Link} to="/">Browse Books</Button>
    </div>
  </div>
);

export default CartPage;