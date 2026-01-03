
import React, { useState } from 'react';
import { Card, Button, Table, Modal, Form, Spinner } from 'react-bootstrap';
import { FaEdit, FaTrash, FaDownload, FaKey } from 'react-icons/fa';
import ExportCSV from '../components/common/ExportCSV';
import { useGetStaffQuery, useAddStaffMutation, useUpdateStaffMutation, useDeleteStaffMutation } from '../redux/slices/staffApiSlice';
import { useGetStaffActivityQuery } from '../redux/slices/staffActivityApiSlice';
import axios from 'axios';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { toast } from 'react-toastify';

const emptyStaff = { name: '', email: '', role: 'support', status: 'active', profileImage: '' };

const AdminStaff = () => {
  // Staff activity logs hook
  const { data: activityLogs, isLoading: loadingActivity, error: errorActivity } = useGetStaffActivityQuery();

  // Password reset handler
  const handleSendReset = async (staff) => {
    if (!window.confirm(`Send password reset email to ${staff.email}?`)) return;
    try {
      await axios.post('/api/staff/forgot-password', { email: staff.email });
      toast.success('Password reset email sent');
    } catch (err) {
      toast.error(err?.response?.data?.message || err.message);
    }
  };
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const { data: staff, isLoading, error, refetch } = useGetStaffQuery();
  const [addStaff, { isLoading: adding }] = useAddStaffMutation();
  const [updateStaff, { isLoading: updating }] = useUpdateStaffMutation();
  const [deleteStaff, { isLoading: deleting }] = useDeleteStaffMutation();

  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(emptyStaff);
  const [editId, setEditId] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');

  const handleShowAdd = () => {
    setForm(emptyStaff);
    setEditMode(false);
    setImageFile(null);
    setImagePreview('');
    setShowModal(true);
  };
  const handleShowEdit = (staff) => {
    setForm(staff);
    setEditId(staff._id);
    setEditMode(true);
    setImageFile(null);
    setImagePreview(staff.profileImage || '');
    setShowModal(true);
  };
  const handleClose = () => {
    setShowModal(false);
    setForm(emptyStaff);
    setEditId(null);
    setEditMode(false);
    setImageFile(null);
    setImagePreview('');
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setImagePreview('');
    }
  };
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (value !== undefined && value !== null) formData.append(key, value);
      });
      if (imageFile) {
        formData.append('profileImage', imageFile);
      }
      if (editMode) {
        await updateStaff({ id: editId, ...formData }).unwrap();
        toast.success('Staff updated');
      } else {
        await addStaff(formData).unwrap();
        toast.success('Staff added');
      }
      refetch();
      handleClose();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Delete this staff member?')) return;
    try {
      await deleteStaff(id).unwrap();
      toast.success('Staff deleted');
      refetch();
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  // Filter staff client-side (API can be extended for server-side filtering if needed)
  const filteredStaff = staff && staff.length > 0 ? staff.filter(s => {
    const matchesSearch = search === '' || s.name.toLowerCase().includes(search.toLowerCase()) || s.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = role === '' || s.role === role;
    const matchesStatus = status === '' || s.status === status;
    return matchesSearch && matchesRole && matchesStatus;
  }) : [];

  // Staff analytics
  const totalStaff = staff ? staff.length : 0;
  const countByRole = staff ? staff.reduce((acc, s) => { acc[s.role] = (acc[s.role] || 0) + 1; return acc; }, {}) : {};
  const countByStatus = staff ? staff.reduce((acc, s) => { acc[s.status] = (acc[s.status] || 0) + 1; return acc; }, {}) : {};
  const recentStaff = staff ? [...staff].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3) : [];

  return (
    <Card className="mb-4">
      <Card.Header className="bg-primary text-white">Staff Management</Card.Header>
      <Card.Body>
        {/* Analytics */}
        <div className="mb-3">
          <div className="d-flex flex-wrap gap-4 align-items-center mb-2">
            <div><strong>Total Staff:</strong> {totalStaff}</div>
            <div><strong>Admins:</strong> {countByRole.admin || 0}</div>
            <div><strong>Managers:</strong> {countByRole.manager || 0}</div>
            <div><strong>Support:</strong> {countByRole.support || 0}</div>
            <div><strong>Active:</strong> {countByStatus.active || 0}</div>
            <div><strong>Inactive:</strong> {countByStatus.inactive || 0}</div>
          </div>
          <div className="small text-muted">Recent Additions: {recentStaff.map(s => `${s.name} (${s.role})`).join(', ') || 'None'}</div>
        </div>
        <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
          <Button variant="success" onClick={handleShowAdd} disabled={adding || updating}>
            {adding ? <Spinner size="sm" /> : 'Add Staff'}
          </Button>
          <ExportCSV data={filteredStaff} filename="staff.csv">
            <Button variant="outline-primary" className="d-flex align-items-center gap-2"><FaDownload /> Export CSV</Button>
          </ExportCSV>
          <Form.Control
            style={{ width: 180, maxWidth: '100%' }}
            placeholder="Search name/email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <Form.Select style={{ width: 120 }} value={role} onChange={e => setRole(e.target.value)}>
            <option value="">All Roles</option>
            <option value="admin">Admin</option>
            <option value="manager">Manager</option>
            <option value="support">Support</option>
          </Form.Select>
          <Form.Select style={{ width: 120 }} value={status} onChange={e => setStatus(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Form.Select>
        </div>

        {isLoading ? <Loader /> : error ? (
          <Message variant="danger">{error?.data?.message || error.error}</Message>
        ) : (
          <>
            {/* Staff Activity Logs */}
            <div className="mt-4">
              <h5>Recent Staff Activity</h5>
              {loadingActivity ? <Loader /> : errorActivity ? (
                <Message variant="danger">{errorActivity?.data?.message || errorActivity.error}</Message>
              ) : (
                <div style={{ maxHeight: 220, overflowY: 'auto' }}>
                  <ul className="list-group">
                    {activityLogs && activityLogs.length > 0 ? activityLogs.map(log => (
                      <li key={log._id} className="list-group-item py-2 px-2">
                        <div className="d-flex justify-content-between align-items-center">
                          <span>
                            <strong>{log.action}</strong> for <strong>{log.staffId?.name || 'Unknown'}</strong>
                            {log.details && <span className="text-muted ms-2">({log.details})</span>}
                          </span>
                          <span className="small text-muted">{log.performedBy || ''} &middot; {log.createdAt ? new Date(log.createdAt).toLocaleString() : ''}</span>
                        </div>
                      </li>
                    )) : <li className="list-group-item small text-muted">No recent activity.</li>}
                  </ul>
                </div>
              )}
            </div>
            <Table bordered hover responsive>
              <thead>
                <tr>
                  <th>Profile</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStaff.length > 0 ? filteredStaff.map((s) => (
                  <tr key={s._id}>
                    <td>
                      <img
                        src={s.profileImage || '/images/default-avatar.png'}
                        alt="Profile"
                        style={{ width: 40, height: 40, borderRadius: '50%', objectFit: 'cover' }}
                      />
                    </td>
                    <td>{s.name}</td>
                    <td>{s.role}</td>
                    <td>{s.email}</td>
                    <td>{s.status}</td>
                    <td>
                      <Button variant="light" size="sm" className="me-2" onClick={() => handleShowEdit(s)}><FaEdit /></Button>
                      <Button variant="warning" size="sm" className="me-2" title="Send password reset" onClick={() => handleSendReset(s)}><FaKey /></Button>
                      <Button variant="danger" size="sm" onClick={() => handleDelete(s._id)} disabled={deleting}><FaTrash /></Button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="text-center">No staff found</td></tr>
                )}
              </tbody>
            </Table>
          </>
        )}

        <Modal show={showModal} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{editMode ? 'Edit Staff' : 'Add Staff'}</Modal.Title>
          </Modal.Header>
          <Form onSubmit={handleSubmit}>
            <Modal.Body>
              <Form.Group className="mb-3">
                <Form.Label>Profile Image</Form.Label>
                <div className="mb-2">
                  <img
                    src={imagePreview || form.profileImage || '/images/default-avatar.png'}
                    alt="Preview"
                    style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }}
                  />
                </div>
                <Form.Control type="file" accept="image/*" onChange={handleImageChange} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control name="name" value={form.name} onChange={handleChange} required />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control name="email" type="email" value={form.email} onChange={handleChange} required disabled={editMode} />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Role</Form.Label>
                <Form.Select name="role" value={form.role} onChange={handleChange} required>
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="support">Support</option>
                </Form.Select>
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={form.status} onChange={handleChange} required>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={adding || updating}>{adding || updating ? <Spinner size="sm" /> : 'Save'}</Button>
            </Modal.Footer>
          </Form>
        </Modal>
      </Card.Body>
    </Card>
  );
};

export default AdminStaff;
