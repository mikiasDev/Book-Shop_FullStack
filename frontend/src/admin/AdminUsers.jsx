import React from 'react';
import { Table, Button, Form, InputGroup, OverlayTrigger, Popover } from 'react-bootstrap';
import { FaSearch, FaEdit, FaTrash, FaCheck, FaTimes } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useGetUsersQuery, useDeleteUserMutation } from '../redux/slices/usersApiSlice';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { toast } from 'react-toastify';


const AdminUsers = () => {
  const [pageNumber, setPageNumber] = React.useState(1);
  const [search, setSearch] = React.useState('');
  const [isAdmin, setIsAdmin] = React.useState('');
  const pageSize = 5;
  const { data, isLoading, error, refetch } = useGetUsersQuery({ pageNumber, pageSize, search, isAdmin });
  const [deleteUser, { isLoading: loadingDelete }] = useDeleteUserMutation();

  const [confirmingId, setConfirmingId] = React.useState(null);
  const deleteHandler = async (id) => {
    try {
      await deleteUser(id);
      toast.success('User deleted successfully');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
    setConfirmingId(null);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPageNumber(1);
    refetch();
  };

  return (
    <>
      <div className="admin-page-content">
        <h2 className="admin-page-title">User Management</h2>
        <div className="d-flex justify-content-between mb-3">
          <Form style={{ width: 340 }} onSubmit={handleSearch} className="d-flex gap-2">
            <InputGroup style={{ width: 200 }}>
              <Form.Control
                placeholder="Search users..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <Button variant="outline-secondary" type="submit">
                <FaSearch />
              </Button>
            </InputGroup>
            <Form.Select
              style={{ width: 120 }}
              value={isAdmin}
              onChange={e => { setIsAdmin(e.target.value); setPageNumber(1); }}
              aria-label="Filter by admin"
            >
              <option value="">All Roles</option>
              <option value="true">Admins</option>
              <option value="false">Users</option>
            </Form.Select>
          </Form>
          <div className="text-muted align-self-center">
            Total Users: {data?.total || 0}
          </div>
        </div>
      </div>
      {loadingDelete && <Loader />}
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
                <th>EMAIL</th>
                <th>ADMIN</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {data.users.map((user) => (
                <tr key={user._id}>
                  <td>{user._id.substring(0, 10)}...</td>
                  <td className="fw-bold">{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    {user.isAdmin ? (
                      <FaCheck style={{ color: 'green' }} />
                    ) : (
                      <FaTimes style={{ color: 'red' }} />
                    )}
                  </td>
                  <td>
                    <LinkContainer to={`/admin/user/${user._id}/edit`}>
                      <Button variant='light' className='btn-sm mx-2'>
                        <FaEdit />
                      </Button>
                    </LinkContainer>
                    <Button
                      variant='danger'
                      className='btn-sm'
                      onClick={() => setConfirmingId(user._id)}
                    >
                      <FaTrash style={{ color: 'var(--color-textInverted, #fff)' }} />
                    </Button>
                    <OverlayTrigger
                      show={confirmingId === user._id}
                      placement="left"
                      overlay={
                        <Popover id="popover-basic">
                          <Popover.Body>
                            <div className="d-flex flex-column align-items-center">
                              <span>Confirm delete?</span>
                              <div className="mt-2">
                                <Button size="sm" variant="danger" onClick={() => deleteHandler(user._id)} className="me-2">Yes</Button>
                                <Button size="sm" variant="secondary" onClick={() => setConfirmingId(null)}>No</Button>
                              </div>
                            </div>
                          </Popover.Body>
                        </Popover>
                      }
                    >
                      <span></span>
                    </OverlayTrigger>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {data.pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
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
    </>
  );
};

export default AdminUsers;