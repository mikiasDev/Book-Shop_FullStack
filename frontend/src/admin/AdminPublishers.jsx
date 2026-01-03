import React, { useState } from 'react';
import { Card, Button, Table, Pagination } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import PublisherEditModal from './PublisherEditModal';
import { 
  useGetPublishersQuery, 
  useCreatePublisherMutation, 
  useUpdatePublisherMutation, 
  useDeletePublisherMutation 
} from '../redux/slices/publishersApiSlice';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const AdminPublishers = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5;
  const { data, isLoading, error, refetch } = useGetPublishersQuery({ pageNumber, pageSize });
  const [createPublisher, { isLoading: loadingCreate }] = useCreatePublisherMutation();
  const [updatePublisher, { isLoading: loadingUpdate }] = useUpdatePublisherMutation();
  const [deletePublisher, { isLoading: loadingDelete }] = useDeletePublisherMutation();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
  const [selectedPublisher, setSelectedPublisher] = useState(null);

  const handleShowCreate = () => {
    setModalType('create');
    setSelectedPublisher(null);
    setShowModal(true);
  };

  const handleShowEdit = (publisher) => {
    setModalType('edit');
    setSelectedPublisher(publisher);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this publisher?')) {
      try {
        await deletePublisher(id).unwrap();
        refetch();
      } catch (err) {
        alert(err?.data?.message || err.error);
      }
    }
  };

  const handleSave = async (publisher) => {
    try {
      if (modalType === 'create') {
        await createPublisher(publisher).unwrap();
      } else {
        await updatePublisher({ id: selectedPublisher._id, ...publisher }).unwrap();
      }
      setShowModal(false);
      refetch();
    } catch (err) {
      alert(err?.data?.message || err.error);
    }
  };

  const publishers = data?.publishers || [];
  const page = data?.page || 1;
  const pages = data?.pages || 1;
  const total = data?.total || 0;

  return (
    <Card className="mb-4 p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Publisher Management</h4>
        <Button variant="success" onClick={handleShowCreate}><FaPlus /> Add Publisher</Button>
      </div>
      {loadingCreate || loadingUpdate || loadingDelete ? <Loader /> : null}
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <div className="text-muted mb-2">Total Publishers: {total}</div>
          <Table bordered hover responsive className="align-middle">
            <thead className="bg-light">
              <tr>
                <th>Name</th>
                <th>Country</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {publishers.map((publisher) => (
                <tr key={publisher._id}>
                  <td>{publisher.name}</td>
                  <td>{publisher.country}</td>
                  <td>
                    <Button variant="light" className="btn-sm mx-2" onClick={() => handleShowEdit(publisher)}><FaEdit /></Button>
                    <Button variant="danger" className="btn-sm" onClick={() => handleDelete(publisher._id)}><FaTrash /></Button>
                  </td>
                </tr>
              ))}
              {(!publishers || publishers.length === 0) && (
                <tr>
                  <td colSpan="3" className="text-center py-4">No publishers found.</td>
                </tr>
              )}
            </tbody>
          </Table>
          {pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.Prev onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))} disabled={page === 1} />
                {page > 1 && <Pagination.Item onClick={() => setPageNumber(page - 1)}>{page - 1}</Pagination.Item>}
                <Pagination.Item active>{page}</Pagination.Item>
                {page < pages && <Pagination.Item onClick={() => setPageNumber(page + 1)}>{page + 1}</Pagination.Item>}
                <Pagination.Next onClick={() => setPageNumber(prev => Math.min(prev + 1, pages))} disabled={page === pages} />
              </Pagination>
              <div className="ms-3 align-self-center text-muted">Page {page} of {pages}</div>
            </div>
          )}
        </>
      )}
      <PublisherEditModal
        show={showModal}
        onHide={() => setShowModal(false)}
        publisher={modalType === 'edit' ? selectedPublisher : null}
        onSave={handleSave}
      />
    </Card>
  );
};

export default AdminPublishers;
