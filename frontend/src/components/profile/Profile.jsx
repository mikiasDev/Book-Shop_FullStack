import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setCredentials } from '../../redux/slices/authSlice';
import { useProfileMutation } from '../../redux/slices/usersApiSlice';
import Loader from '../common/Loader';
import { toast } from 'react-toastify';
import axios from 'axios';


const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';

const Profile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [avatar, setAvatar] = useState('');
  const [bio, setBio] = useState('');
  const [address, setAddress] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dateOfBirth, setDateOfBirth] = useState('');
  const [gender, setGender] = useState('');
  const [uploading, setUploading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  const [updateProfile, { isLoading: loadingUpdate }] = useProfileMutation();

  useEffect(() => {
    if (userInfo) {
      setName(userInfo.name || '');
      setEmail(userInfo.email || '');
      setAvatar(userInfo.avatar || '');
      setBio(userInfo.bio || '');
      setAddress(userInfo.address || '');
      setPhoneNumber(userInfo.phoneNumber || '');
      // Format date for input type="date" (YYYY-MM-DD)
      if (userInfo.dateOfBirth) {
        const date = new Date(userInfo.dateOfBirth);
        setDateOfBirth(date.toISOString().split('T')[0]);
      } else {
        setDateOfBirth('');
      }
      setGender(userInfo.gender || '');
    }
  }, [userInfo]);

  // Password strength validation helper
  const isStrongPassword = (pwd) => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(pwd);
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    if (newPassword) {
      if (!isStrongPassword(newPassword)) {
        toast.error('Password must be at least 8 characters and include uppercase, lowercase, number, and special character.');
        return;
      }
      if (newPassword !== confirmPassword) {
        toast.error('Passwords do not match');
        return;
      }
    }
    try {
      const res = await updateProfile({
        _id: userInfo._id,
        name,
        email,
        avatar,
        bio,
        phoneNumber,
        dateOfBirth,
        gender,
        ...(newPassword ? { password: newPassword } : {}),
        address,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success('Profile updated successfully');
    } catch (err) {
      toast.error(err?.data?.message || err.error);
    }
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];

    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);
    try {
      const { data } = await axios.post('/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      setAvatar(data.url);
      // Immediately update Redux and localStorage so avatar persists everywhere
      const updatedUser = { ...userInfo, avatar: data.url };
      dispatch(setCredentials(updatedUser));
      // Auto-save profile after image upload
      await updateProfile({
        _id: userInfo._id,
        name,
        email,
        avatar: data.url,
        bio,
        phoneNumber,
        dateOfBirth,
        gender,
        address,
      }).unwrap();
      toast.success('Image uploaded and profile updated!');
    } catch (error) {
      toast.error('Image upload failed');
    }
    setUploading(false);
  };
        // setAvatar causing infinite re-render removed. Avatar normalization handled in useEffect and upload handler only.
  return (
    <>
      <div className="d-flex align-items-center mb-4">
        {userInfo?.avatar ? (
          <img src={userInfo.avatar} alt="Avatar" className="me-3" style={{ width: 64, height: 64, borderRadius: '50%', objectFit: 'cover', background: '#f0f0f0' }} />
        ) : (
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={{ width: '64px', height: '64px', fontSize: '24px' }}>
            {userInfo?.name?.charAt(0).toUpperCase()}
          </div>
        )}
        <div>
          <h3 className="mb-0">Profile Settings</h3>
          <p className="text-muted mb-0">Update your personal information</p>
        </div>
      </div>

      {loadingUpdate && <Loader />}

      <Form onSubmit={submitHandler} role="form" aria-label="Profile update form">
        <Row>
          <Col md={6}>
            <Form.Group controlId='name' className='mb-3'>
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-label="Full Name"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='email' className='mb-3'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-label="Email Address"
              ></Form.Control>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId='phoneNumber' className='mb-3'>
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter phone number'
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                aria-label="Phone Number"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='gender' className='mb-3'>
              <Form.Label>Gender</Form.Label>
              <Form.Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                aria-label="Gender"
              >
                <option value=''>Select Gender</option>
                <option value='Male'>Male</option>
                <option value='Female'>Female</option>
                <option value='Other'>Other</option>
                <option value='Prefer not to say'>Prefer not to say</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group controlId='dateOfBirth' className='mb-3'>
              <Form.Label>Date of Birth</Form.Label>
              <Form.Control
                type='date'
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                aria-label="Date of Birth"
              ></Form.Control>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='avatar' className='mb-3'>
              <Form.Label>Profile Picture</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter image URL'
                value={avatar}
                onChange={(e) => setAvatar(e.target.value)}
                aria-label="Avatar URL"
              />
              <Form.Control
                type='file'
                label='Upload Profile Picture'
                onChange={uploadFileHandler}
                accept='image/*'
                className='mt-2'
                aria-label="Upload Profile Picture"
              />
              {uploading && <Loader />}
               <div className="mt-3">
                 <img
                   src={
                     avatar
                       ? avatar.startsWith('/uploads')
                         ? `${backendUrl}${avatar}`
                         : avatar
                       : '/images/default-avatar.png'
                   }
                   alt="Profile"
                   style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', background: '#f0f0f0' }}
                   onError={e => { e.target.onerror = null; e.target.src = '/images/default-avatar.png'; }}
                 />
                 {/* No debug info, just image preview */}
               </div>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group controlId='address' className='mb-3'>
          <Form.Label>Address</Form.Label>
          <Form.Control
            type='text'
            placeholder='Enter your address'
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            aria-label="Address"
          ></Form.Control>
        </Form.Group>
        <Form.Group controlId='bio' className='mb-3'>
          <Form.Label>Bio</Form.Label>
          <Form.Control
            as='textarea'
            rows={3}
            placeholder='Tell us a little about yourself...'
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            aria-label="Bio"
          ></Form.Control>
        </Form.Group>

        <Row>
          <Col md={6}>
            <Form.Group controlId='newPassword' className='mb-3'>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter new password'
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                aria-label="New Password"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group controlId='confirmPassword' className='mb-3'>
              <Form.Label>Confirm New Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm new password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                aria-label="Confirm New Password"
              />
            </Form.Group>
          </Col>
        </Row>

        <div className="d-grid gap-2 d-md-flex justify-content-md-end mt-4">
          <Button type='submit' variant='primary' className='px-4' aria-label="Update Profile">
            Update Profile
          </Button>
        </div>
      </Form>
    </>
  );
};

export default Profile;