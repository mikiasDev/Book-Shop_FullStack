import React from 'react';
import { Card, Table, Button, Spinner } from 'react-bootstrap';
import { FaEye } from 'react-icons/fa';
import { useGetBooksQuery } from '../redux/slices/booksApiSlice';

const StaffBooks = () => {
  const { data: books, isLoading, error } = useGetBooksQuery();

  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">Books</Card.Header>
      <Card.Body>
        {isLoading ? (
          <div className="text-center py-4"><Spinner animation="border" /></div>
        ) : error ? (
          <div className="text-danger">{error?.data?.message || error.error}</div>
        ) : (
          <Table bordered hover responsive>
            <thead>
              <tr>
                <th>Cover</th>
                <th>Title</th>
                <th>Author</th>
                <th>Category</th>
                <th>Price</th>
                <th>Stock</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books && books.length > 0 ? books.map((book) => (
                <tr key={book._id}>
                  <td><img src={book.coverImage || '/images/default-book.png'} alt="cover" style={{ width: 40, height: 60, objectFit: 'cover' }} /></td>
                  <td>{book.title}</td>
                  <td>{book.author?.name || '-'}</td>
                  <td>{book.category?.name || '-'}</td>
                  <td>${book.price?.toFixed(2) || '0.00'}</td>
                  <td>{book.countInStock}</td>
                  <td>
                    <Button variant="outline-primary" size="sm" href={`/books/${book._id}`}><FaEye /></Button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="7" className="text-center">No books found</td></tr>
              )}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
};

export default StaffBooks;
