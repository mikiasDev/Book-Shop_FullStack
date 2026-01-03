import React from 'react';
import { Row, Col } from 'react-bootstrap';
import BookCard from './BookCard';

const BookList = ({ books }) => {
  return (
    <Row aria-label="Book list">
      {books.map((book) => (
        <Col key={book._id} sm={12} md={6} lg={4} xl={3}>
          <BookCard book={book} />
        </Col>
      ))}
    </Row>
  );
};

export default BookList;