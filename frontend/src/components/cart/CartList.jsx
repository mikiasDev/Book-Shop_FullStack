import React from 'react';
import { ListGroup } from 'react-bootstrap';
import CartItem from './CartItem';
import Message from '../common/Message';
import { Link } from 'react-router-dom';

const CartList = ({ cartItems }) => {
  if (cartItems.length === 0) {
    return (
      <Message aria-label="Your cart is empty">Your cart is empty <Link to="/">Go Back</Link></Message>
    );
  }

  return (
    <ListGroup variant="flush" aria-label="Cart items list">
      {cartItems.map((item) => (
        <ListGroup.Item key={item._id}>
          <CartItem item={item} />
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};

export default CartList;