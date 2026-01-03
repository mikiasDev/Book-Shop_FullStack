import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col, Table, Badge } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';
import { useProfileMutation } from '../../redux/slices/usersApiSlice';
import Message from '../common/Message';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';
import axios from 'axios';

const AdminProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [role, setRole] = useState('Admin');
  const [activityLogs, setActivityLogs] = useState([]);
  const [uploading, setUploading] = useState(false);

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdate }] = useProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      setAvatar(userInfo.avatar || '');
      setBio(userInfo.bio || '');
      setPhoneNumber(userInfo.phoneNumber || '');
      setRole(userInfo.role || 'Admin');
      // Simulate activity logs (replace with real API)
      setActivityLogs([
        { action: 'Logged in', date: '2025-12-28', status: 'Success' },
        { action: 'Updated book', date: '2025-12-27', status: 'Success' },
        { action: 'Changed password', date: '2025-12-26', status: 'Success' },
      ]);
    }
  }, [userInfo]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      // Replace with your backend upload endpoint or Cloudinary API
      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAvatar(data.url);
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Image upload failed');
    }
    setUploading(false);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        name,
        email,
        avatar,
        bio,
        phoneNumber,
        role,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Admin profile updated successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <section className="admin-profile-root">
      <header className="admin-profile-header">
        {avatar ? (
          <img src={avatar} alt="Admin" className="admin-profile-avatar" />
        ) : (
          <div className="admin-profile-avatar admin-profile-avatar-fallback">
            {name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h2 className="admin-profile-title">Admin Profile</h2>
          <p className="admin-profile-desc">Full admin controls and activity logs</p>
        </div>
      </header>
      {loadingUpdate && <Loader />}
      <form className="admin-profile-form" onSubmit={submitHandler} role="form" aria-label="Admin profile update form">
        <div className="admin-profile-fields">
          <div className="admin-profile-field">
            <label htmlFor="name">Full Name</label>
            <input id="name" type="text" value={name} onChange={e => setName(e.target.value)} aria-label="Full Name" />
          </div>
          <div className="admin-profile-field">
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" value={email} onChange={e => setEmail(e.target.value)} aria-label="Email Address" />
          </div>
          <div className="admin-profile-field">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input id="phoneNumber" type="text" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} aria-label="Phone Number" />
          </div>
          <div className="admin-profile-field">
            <label htmlFor="role">Role</label>
            <input id="role" type="text" value={role} disabled aria-label="Role" />
            <span className="admin-profile-role-badge">Admin</span>
          </div>
          <div className="admin-profile-field">
            <label htmlFor="avatar">Profile Picture</label>
            <input id="avatar" type="text" value={avatar} onChange={e => setAvatar(e.target.value)} aria-label="Avatar URL" />
            <input type="file" onChange={uploadFileHandler} accept="image/*" aria-label="Upload Profile Picture" />
            {uploading && <Loader />}
            {avatar && (
              <div className="admin-profile-avatar-preview">
                <img src={avatar} alt="Profile" />
              </div>
            )}
          </div>
          <div className="admin-profile-field admin-profile-bio-field">
            <label htmlFor="bio">Bio</label>
            <textarea id="bio" rows={3} value={bio} onChange={e => setBio(e.target.value)} aria-label="Bio" />
          </div>
        </div>
        <div className="admin-profile-actions">
          <button type="submit" className="admin-profile-save-btn" aria-label="Update Admin Profile">
            Update Admin Profile
          </button>
        </div>
      </form>
      <section className="admin-profile-logs">
        <h3>Recent Activity Logs</h3>
        <table className="admin-profile-logs-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {activityLogs.map((log, idx) => (
              <tr key={idx}>
                <td>{log.action}</td>
                <td>{log.date}</td>
                <td>
                  <span className={`admin-profile-log-status${log.status === 'Success' ? ' success' : ' danger'}`}>{log.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </section>
  );
};

export default AdminProfile;
