import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux'; // <--- Added useSelector
import { useGetBookDetailsQuery } from '../redux/slices/booksApiSlice';
import { addToCart } from '../redux/slices/cartSlice';
import BookPageSkeleton from '../components/books/BookPageSkeleton';
import Message from '../components/common/Message';
import Rating from '../components/books/Rating';

const BookPage = () => {
  const { id: bookId } = useParams();
  const [qty, setQty] = useState(1);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // --- Get User Info ---
  const { userInfo } = useSelector((state) => state.auth);

  const { data: book, isLoading, error } = useGetBookDetailsQuery(bookId);

  // --- UPDATED ADD TO CART HANDLER ---
  const addToCartHandler = () => {
    if (!book?._id) return;
    if (!userInfo) {
      navigate(`/login?redirect=/cart&addBook=${book._id}&qty=${qty}`);
      return;
    }
    // Dispatch addToCart with all required book data
    dispatch(addToCart({
      _id: book._id,
      name: book.name,
      title: book.title || book.name,
      price: book.price,
      image: book.image,
      qty,
      countInStock: book.countInStock || 1,
      author: book.author || book.brand || '',
    }));
    // Only navigate after successful add-to-cart and authentication
    navigate('/cart');
  };

  return (
    <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <Link className='btn btn-light my-3' to='/'>
        Go Back
      </Link>
      {isLoading ? (
        <BookPageSkeleton />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Row>
          <Col md={5}>
            <Image src={book.image} alt={book.name} fluid />
          </Col>
          <Col md={4}>
            <ListGroup variant='flush'>
              <ListGroup.Item>
                <h3>{book.name}</h3>
              </ListGroup.Item>
              <ListGroup.Item>
                <Rating value={book.rating} text={`${book.numReviews} reviews`} />
              </ListGroup.Item>
              <ListGroup.Item>Price: ${book.price}</ListGroup.Item>
              <ListGroup.Item>Description: {book.description}</ListGroup.Item>
            </ListGroup>
          </Col>
          <Col md={3}>
            <Card>
              <ListGroup variant='flush'>
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
                          as='select'
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
                    className='btn-block w-100'
                    type='button'
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
      )}
    </main>
  );
};

export default BookPage;