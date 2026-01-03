import React, { useState } from 'react';
import { Table, Badge, Card, Row, Col, Pagination, Button } from 'react-bootstrap';
import { FaEdit } from 'react-icons/fa';
import AuthorEditModal from './AuthorEditModal';
import { useGetAuthorsQuery, useUpdateAuthorMutation } from '../redux/slices/authorsApiSlice';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const AdminAuthors = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [showEdit, setShowEdit] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState(null);
  const { data, isLoading, error, refetch } = useGetAuthorsQuery({ pageNumber, pageSize: 5 });
  const [updateAuthor, { isLoading: loadingUpdate }] = useUpdateAuthorMutation();
  const authors = data?.authors || [];
  const page = data?.page || 1;
  const pages = data?.pages || 1;
  const total = data?.total || 0;

  return (
    <Card className="border-0 shadow-sm rounded-3 p-4">
      <h4 className="mb-4">Author Management</h4>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Row className="mb-3">
            <Col>
              <div className="text-muted">
                Total Authors: {total}
              </div>
            </Col>
          </Row>
          <Table hover responsive className='table-sm align-middle'>
            <thead className="bg-light">
              <tr>
                <th>AUTHOR NAME</th>
                <th>BOOKS PUBLISHED</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {authors.map((author, index) => (
                <tr key={index}>
                  <td className="fw-bold">{author.name}</td>
                  <td>
                    <Badge bg="info" pill>{author.count}</Badge>
                  </td>
                  <td>
                    <Badge bg="success">Active</Badge>
                    <Button
                      variant="light"
                      className="btn-sm ms-2"
                      onClick={() => {
                        setSelectedAuthor(author);
                        setShowEdit(true);
                      }}
                    >
                      <FaEdit />
                    </Button>
                  </td>
                </tr>
              ))}
                  <AuthorEditModal
                    show={showEdit}
                    onHide={() => setShowEdit(false)}
                    author={selectedAuthor}
                    onSave={async (updated) => {
                      if (!updated || !updated.name || updated.name === selectedAuthor.name) {
                        setShowEdit(false);
                        return;
                      }
                      try {
                        await updateAuthor({ oldName: selectedAuthor.name, newName: updated.name }).unwrap();
                        setShowEdit(false);
                        refetch();
                      } catch (err) {
                        alert(err?.data?.message || 'Failed to update author');
                      }
                    }}
                  />
                  {loadingUpdate && <Loader />}
            </tbody>
          </Table>
          {pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev
                  onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                  disabled={page === 1}
                />
                {page > 1 && (
                  <Pagination.Item onClick={() => setPageNumber(page - 1)}>{page - 1}</Pagination.Item>
                )}
                <Pagination.Item active>{page}</Pagination.Item>
                {page < pages && (
                  <Pagination.Item onClick={() => setPageNumber(page + 1)}>{page + 1}</Pagination.Item>
                )}
                <Pagination.Next
                  onClick={() => setPageNumber(prev => Math.min(prev + 1, pages))}
                  disabled={page === pages}
                />
              </Pagination>
              <div className="ms-3 align-self-center text-muted">
                Page {page} of {pages}
              </div>
            </div>
          )}
        </>
      )}
    </Card>
  );
};

export default AdminAuthors;
