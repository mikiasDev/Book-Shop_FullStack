import React, { useState } from 'react';
import { Table, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { 
  useGetCategoriesQuery, 
  useCreateCategoryMutation, 
  useUpdateCategoryMutation, 
  useDeleteCategoryMutation 
} from '../redux/slices/categoriesApiSlice';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { toast } from 'react-toastify';


const AdminCategories = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 5;
  const { data, isLoading, error, refetch } = useGetCategoriesQuery({ pageNumber, pageSize });

  const [createCategory, { isLoading: loadingCreate }] = useCreateCategoryMutation();
  const [updateCategory, { isLoading: loadingUpdate }] = useUpdateCategoryMutation();
  const [deleteCategory, { isLoading: loadingDelete }] = useDeleteCategoryMutation();

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('create'); // 'create' or 'edit'
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleShowCreate = () => {
    setModalType('create');
    setName('');
    setDescription('');
    setShowModal(true);
  };

  const handleShowEdit = (category) => {
    setModalType('edit');
    setSelectedCategory(category);
    setName(category.name);
    setDescription(category.description || '');
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure? This will move all books in this category to "Uncategorized".')) {
      try {
        await deleteCategory(id).unwrap();
        toast.success('Category deleted');
        refetch();
      } catch (err) {
        toast.error(err?.data?.message || err.error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalType === 'create') {
        await createCategory({ name, description }).unwrap();
        toast.success('Category created');
      } else {
        await updateCategory({ categoryId: selectedCategory._id, name, description }).unwrap();
        toast.success('Category updated');
      }
      setShowModal(false);
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <div className="p-4">
      <Row className='align-items-center mb-4'>
        <Col>
          <h4>Category Management</h4>
        </Col>
        <Col className='text-end'>
          <Button className='my-3' onClick={handleShowCreate}>
            <FaPlus /> Create Category
          </Button>
        </Col>
      </Row>

      {loadingCreate || loadingUpdate || loadingDelete ? <Loader /> : null}

      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <>
          <Table hover responsive className='table-sm align-middle'>
            <thead className="bg-light">
              <tr>
                <th>ID</th>
                <th>NAME</th>
                <th>DESCRIPTION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data?.categories?.map((category) => (
                <tr key={category._id}>
                  <td>{category._id}</td>
                  <td>{category.name}</td>
                  <td>{category.description}</td>
                  <td>
                    <Button
                      variant='light'
                      className='btn-sm mx-2'
                      onClick={() => handleShowEdit(category)}
                    >
                      <FaEdit />
                    </Button>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => handleDelete(category._id)}
                    >
                      <FaTrash style={{ color: 'var(--color-textInverted, #fff)' }} />
                    </Button>
                  </td>
                </tr>
              ))}
              {(!data?.categories || data?.categories.length === 0) && (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
          {/* Pagination Controls */}
          {data?.pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Button
                variant="outline-secondary"
                className="me-2"
                onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
                disabled={data.page === 1}
              >
                Prev
              </Button>
              {[...Array(data.pages).keys()].map((x) => (
                <Button
                  key={x + 1}
                  variant={x + 1 === data.page ? 'primary' : 'outline-primary'}
                  className="mx-1"
                  onClick={() => setPageNumber(x + 1)}
                >
                  {x + 1}
                </Button>
              ))}
              <Button
                variant="outline-secondary"
                className="ms-2"
                onClick={() => setPageNumber((prev) => Math.min(prev + 1, data.pages))}
                disabled={data.page === data.pages}
              >
                Next
              </Button>
              <div className="ms-3 align-self-center text-muted">
                Page {data.page} of {data.pages}
              </div>
            </div>
          )}
        </>
      )}

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'create' ? 'Create Category' : 'Edit Category'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className='my-2' controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter category name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              ></Form.Control>
            </Form.Group>

            <Form.Group className='my-2' controlId='description'>
              <Form.Label>Description</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter description (optional)'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Form.Control>
            </Form.Group>

            <Button type='submit' variant='primary' className='mt-3'>
              {modalType === 'create' ? 'Create' : 'Update'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminCategories;
