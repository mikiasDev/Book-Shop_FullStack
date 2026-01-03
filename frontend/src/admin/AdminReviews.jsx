import React, { useMemo } from 'react';
import { Table, Card, Row, Col, Button } from 'react-bootstrap';
import { FaTrash } from 'react-icons/fa';
import { useGetBooksQuery, useDeleteReviewMutation } from '../redux/slices/booksApiSlice';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import Rating from '../components/books/Rating';
import { toast } from 'react-toastify';

const AdminReviews = () => {
  const { data: books, isLoading, error, refetch } = useGetBooksQuery({});
  const [deleteReview, { isLoading: loadingDelete }] = useDeleteReviewMutation();

  const allReviews = useMemo(() => {
    if (!books) return [];
    let reviews = [];
    books.forEach(book => {
      if (book.reviews && book.reviews.length > 0) {
        book.reviews.forEach(review => {
          reviews.push({
            ...review,
            bookTitle: book.name,
            bookId: book._id
          });
        });
      }
    });
    return reviews;
  }, [books]);

  const handleDelete = async (bookId, reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        await deleteReview({ bookId, reviewId }).unwrap();
        toast.success('Review deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  return (
    <Card className="border-0 shadow-sm rounded-3 p-4">
      <h4 className="mb-4">Review Management</h4>
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Row className="mb-3">
            <Col>
              <div className="text-muted">
                Total Reviews: {allReviews.length}
              </div>
            </Col>
          </Row>
          <Table hover responsive className='table-sm align-middle'>
            <thead className="bg-light">
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>BOOK</th>
                <th>RATING</th>
                <th>COMMENT</th>
                <th>DATE</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {allReviews.map((review) => (
                <tr key={review._id}>
                  <td>{review._id}</td>
                  <td>{review.name}</td>
                  <td>{review.bookTitle}</td>
                  <td>
                    <Rating value={review.rating} />
                  </td>
                  <td>{review.comment.substring(0, 50)}...</td>
                  <td>{review.createdAt.substring(0, 10)}</td>
                  <td>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => handleDelete(review.bookId, review._id)}
                    >
                      <FaTrash style={{ color: 'var(--color-textInverted, #fff)' }} />
                    </Button>
                  </td>
                </tr>
              ))}
              {allReviews.length === 0 && (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    No reviews found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </>
      )}
    </Card>
  );
};

export default AdminReviews;
