import React from 'react';
import { Row, Col, Image, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart, removeFromCart } from '../../redux/slices/cartSlice';

const CartItem = ({ item }) => {
  const dispatch = useDispatch();

  return (
    <Row className="align-items-center mb-3">
      <Col md={2}>
        <Image src={item.image} alt={item.title ? `Cover of ${item.title}` : 'Book cover'} fluid rounded aria-label={item.title ? `Book cover for ${item.title}` : 'Book cover'} />
      </Col>
      <Col md={3}>
        <Link to={`/book/${item._id}`} aria-label={`Book title: ${item.title}`}>{item.title}</Link>
      </Col>
      <Col md={2} aria-label={`Price: $${item.price}`}>${item.price}</Col>
      <Col md={2}>
        <Form.Control
          as="select"
          value={item.qty}
          onChange={(e) =>
            dispatch(addToCart({ ...item, qty: Number(e.target.value) }))
          }
          aria-label={`Select quantity for ${item.title}`}
        >
          {[...Array(item.countInStock).keys()].map((x) => (
            <option key={x + 1} value={x + 1}>
              {x + 1}
            </option>
          ))}
        </Form.Control>
      </Col>
      <Col md={2}>
        <Button
          type="button"
          variant="light"
          onClick={() => dispatch(removeFromCart(item._id))}
          aria-label={`Remove ${item.title} from cart`}
        >
          <i className="fas fa-trash" aria-label="Remove" />
        </Button>
      </Col>
    </Row>
  );
};

export default CartItem;