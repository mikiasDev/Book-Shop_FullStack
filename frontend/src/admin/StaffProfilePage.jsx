import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setCredentials } from '../redux/slices/authSlice';
import { Form, Button, Card, Alert, Spinner, Image } from 'react-bootstrap';
import axios from 'axios';

const StaffProfilePage = () => {
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState(userInfo?.avatar || '');
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(userInfo?.avatar || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const fileInputRef = useRef();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(avatar);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      if (password) formData.append('password', password);
      if (imageFile) formData.append('avatar', imageFile);
      const { data } = await axios.put('/api/staff/profile', formData, { withCredentials: true });
      setSuccess('Profile updated successfully!');
      setAvatar(data.avatar);
      setPreview(data.avatar);
      setPassword('');
      // Update Redux and localStorage for header sync
      dispatch(setCredentials({ ...userInfo, name: data.name, email: data.email, avatar: data.avatar }));
    } catch (err) {
      setError(err?.response?.data?.message || 'Update failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-4">
      <Card className="mx-auto shadow-sm border-0" style={{ maxWidth: 480 }}>
        <Card.Body>
          <h3 className="mb-4 fw-bold" style={{ color: '#1976d2' }}>My Profile</h3>
          {error && <Alert variant="danger">{error}</Alert>}
          {success && <Alert variant="success">{success}</Alert>}
          <Form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="text-center mb-3">
              <Image
                src={preview || '/images/default-profile.png'}
                roundedCircle
                width={96}
                height={96}
                style={{ objectFit: 'cover', border: '2px solid #1976d2', background: '#fff' }}
                alt="Profile Preview"
                onClick={() => fileInputRef.current.click()}
                className="mb-2"
                onError={e => { e.target.onerror = null; e.target.src = '/images/default-profile.png'; }}
              />
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                ref={fileInputRef}
                style={{ display: 'none' }}
              />
              <div>
                <Button variant="outline-primary" size="sm" onClick={() => fileInputRef.current.click()}>
                  Change Photo
                </Button>
              </div>
            </div>
            <Form.Group className="mb-3" controlId="profileName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                placeholder="Enter your name"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="profileEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="profilePassword">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Leave blank to keep current password"
                autoComplete="new-password"
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="w-100 fw-bold py-2" disabled={loading}>
              {loading ? <Spinner size="sm" /> : 'Update Profile'}
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
};

export default StaffProfilePage;
