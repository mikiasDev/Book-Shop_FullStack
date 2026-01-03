import React from 'react';
import { Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';

const Wishlist = () => {
  // Dummy data
  const wishlistItems = [
    { id: 1, title: 'The Great Gatsby', author: 'F. Scott Fitzgerald', price: 12.99, image: '/images/book1.jpg', inStock: true },
    { id: 2, title: '1984', author: 'George Orwell', price: 14.99, image: '/images/book2.jpg', inStock: false },
  ];

  return (
    <div>
      <h3 className="mb-4">My Wishlist</h3>
      {wishlistItems.length === 0 ? (
        <div className="text-center py-5">
          <FaHeart size={48} className="text-muted mb-3" />
          <h5>Your wishlist is empty</h5>
          <p className="text-muted">Save items you want to buy later!</p>
          <Button variant="primary">Browse Books</Button>
        </div>
      ) : (
        <Row>
          {wishlistItems.map((item) => (
            <Col md={6} lg={4} className="mb-4" key={item.id}>
              <Card className="h-100 border-0 shadow-sm">
                <div className="position-relative">
                  <Card.Img variant="top" src={item.image} style={{ height: '200px', objectFit: 'cover' }} />
                  <Button 
                    variant="light" 
                    className="position-absolute top-0 end-0 m-2 rounded-circle p-2 shadow-sm"
                    size="sm"
                  >
                    <FaTrash className="text-danger" />
                  </Button>
                </div>
                <Card.Body>
                  <Card.Title className="h6">{item.title}</Card.Title>
                  <Card.Text className="text-muted small mb-2">{item.author}</Card.Text>
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold">${item.price}</span>
                    {item.inStock ? (
                      <Badge bg="success">In Stock</Badge>
                    ) : (
                      <Badge bg="secondary">Out of Stock</Badge>
                    )}
                  </div>
                  <Button variant="outline-primary" className="w-100 mt-3" disabled={!item.inStock}>
                    <FaShoppingCart className="me-2" /> Add to Cart
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default Wishlist;
