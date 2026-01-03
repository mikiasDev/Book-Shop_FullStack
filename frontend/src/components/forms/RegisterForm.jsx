import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Loader from '../common/Loader';
import Message from '../common/Message';
import { useRegisterMutation } from '../../redux/slices/userApiSlice';
import { setCredentials } from '../../redux/slices/authSlice';
import { FaGoogle, FaGithub } from 'react-icons/fa';

const RegisterForm = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { search } = useLocation();
  const redirect = search ? search.split('=')[1] : '/';

  const { userInfo } = useSelector((state) => state.auth);

  const [register, { isLoading }] = useRegisterMutation();

  useEffect(() => {
    if (userInfo) {
      return (
        <>
          <h1>Sign Up</h1>
          {message && <Message variant='danger'>{message}</Message>}
          {successMessage && <Alert variant='success'>{successMessage}</Alert>}
          {isLoading && <Loader />}
          <Form onSubmit={submitHandler} role="form" aria-label="Register form" className="register-form-container">
            <Form.Group className='my-2' controlId='name'>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type='text'
                placeholder='Enter name'
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                aria-label="Name"
              />
            </Form.Group>
            <Form.Group className='my-2' controlId='email'>
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                type='email'
                placeholder='Enter email'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                aria-label="Email address"
              />
            </Form.Group>
            <Form.Group className='my-2' controlId='password'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Enter password'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                aria-label="Password"
              />
            </Form.Group>
            <Form.Group className='my-2' controlId='confirmPassword'>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type='password'
                placeholder='Confirm password'
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                aria-label="Confirm password"
              />
            </Form.Group>
            <Button type='submit' variant='primary' className='mt-3 w-100' aria-label="Register">
              Register
            </Button>
          </Form>
        </>
      );
            <Form.Control
              type='password'
              placeholder='Enter password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Form.Group className='my-3' controlId='confirmPassword'>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type='password'
              placeholder='Confirm password'
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            ></Form.Control>
          </Form.Group>

          <Button type='submit' variant='primary' className='mt-2 w-100'>
            Register
          </Button>
        </Form>
      )}

      <div className="text-center my-4">
        <p>Or sign up with:</p>
        <div className="d-flex justify-content-center gap-3">
          <Button
            variant="outline-danger"
            onClick={() => window.location.href = 'http://localhost:5000/auth/google'}
            className="d-flex align-items-center"
          >
            <FaGoogle className="me-2" /> Google
          </Button>
          <Button
            variant="outline-dark"
            onClick={() => window.location.href = 'http://localhost:5000/auth/github'}
            className="d-flex align-items-center"
          >
            <FaGithub className="me-2" /> GitHub
          </Button>
        </div>
      </div>

      <Row className='py-3'>
        <Col>
          Have an Account?{' '}
          <Link to={redirect ? `/login?redirect=${redirect}` : '/login'}>
            Login
          </Link>
        </Col>
      </Row>
    </>
  );
};

export default RegisterForm;