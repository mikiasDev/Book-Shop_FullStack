import React, { useState } from 'react';
import BookPreviewModal from './BookPreviewModal';
import { Link, useNavigate } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';

const BookDetails = ({ book }) => {
  const [qty, setQty] = useState(1);
  const [showPreview, setShowPreview] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...book, qty }));
    navigate('/cart');
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      <Row>
        <Col md={6}>
          <Image src={book.image} alt={book.title ? `Cover of ${book.title}` : 'Book cover'} fluid aria-label={book.title ? `Book cover for ${book.title}` : 'Book cover'} />
          {book.previewUrl && (
            <Button
              variant="outline-primary"
              className="mt-3 w-100 fw-bold"
              onClick={() => setShowPreview(true)}
              aria-label={`Preview book: ${book.title}`}
            >
              Preview Book
            </Button>
          )}
        </Col>
        <Col md={3}>
          <ListGroup variant="flush" aria-label="Book details">
            <ListGroup.Item>
              <h3 tabIndex="0" aria-label={`Title: ${book.title}`}>{book.title}</h3>
            </ListGroup.Item>
            <ListGroup.Item tabIndex="0" aria-label={`Author: ${book.author}`}>Author: {book.author}</ListGroup.Item>
            <ListGroup.Item tabIndex="0" aria-label={`Price: $${book.price}`}>Price: ${book.price}</ListGroup.Item>
            <ListGroup.Item tabIndex="0" aria-label={`Description: ${book.description}`}>Description: {book.description}</ListGroup.Item>
          </ListGroup>
        </Col>
        <Col md={3}>
          <Card>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <Row>
                  <Col>Price:</Col>
                  <Col>
                    <strong>${book.price}</strong>
                  </Col>
                </Row>
              </ListGroup.Item>

              <ListGroup.Item>
                <Row>
                  <Col>Status:</Col>
                  <Col>
                    {book.countInStock > 0 ? 'In Stock' : 'Out Of Stock'}
                  </Col>
                </Row>
              </ListGroup.Item>

              {book.countInStock > 0 && (
                <ListGroup.Item>
                  <Row>
                    <Col>Qty</Col>
                    <Col>
                      <Form.Control
                        as="select"
                        value={qty}
                        onChange={(e) => setQty(Number(e.target.value))}
                      >
                        {[...Array(book.countInStock).keys()].map((x) => (
                          <option key={x + 1} value={x + 1}>
                            {x + 1}
                          </option>
                        ))}
                      </Form.Control>
                    </Col>
                  </Row>
                </ListGroup.Item>
              )}

              <ListGroup.Item>
                <Button
                  className="btn-block"
                  type="button"
                  disabled={book.countInStock === 0}
                  onClick={addToCartHandler}
                >
                  Add To Cart
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
      <BookPreviewModal
        show={showPreview}
        onHide={() => setShowPreview(false)}
        previewUrl={book.previewUrl}
      />
    </>
  );
};

export default BookDetails;