import React from 'react';
import { useGetBooksQuery } from '../redux/slices/booksApiSlice';
import { Container, Row, Col, Spinner, Alert } from 'react-bootstrap';
import Product from '../components/Product';

const NewReleasesPage = () => {
  // Assume books have a 'createdAt' field and sort by newest
  const { data: booksData, isLoading, error } = useGetBooksQuery({ sort: 'newest', limit: 24 });
  const books = booksData?.books || [];

  if (isLoading) return <Spinner animation="border" className="d-block mx-auto mt-5" />;
  if (error) return <Alert variant="danger" className="mt-5">Failed to load new releases.</Alert>;

  return (
    <Container className="py-4">
      <h2 className="mb-4">🆕 New Releases</h2>
      {books.length === 0 ? (
        <Alert variant="info">No new releases found.</Alert>
      ) : (
        <Row xs={1} sm={2} md={3} lg={4} className="g-4">
          {books.map((book) => (
            <Col key={book._id}>
              <Product product={book} />
            </Col>
          ))}
        </Row>
      )}
    </Container>
  );
};

export default NewReleasesPage;
