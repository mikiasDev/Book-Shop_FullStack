import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Alert, Button, Container, Card } from 'react-bootstrap';
import Loader from '../components/common/Loader';
import { useVerifyEmailMutation } from '../redux/slices/userApiSlice';
import { setCredentials } from '../redux/slices/authSlice';

const VerifyEmailPage = () => {
  const { token } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [verifyEmail, { isLoading, isSuccess, isError, error }] = useVerifyEmailMutation();
  const [status, setStatus] = useState('verifying'); // verifying, success, error

  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    if (userInfo) {
      navigate('/');
    }
  }, [userInfo, navigate]);

  useEffect(() => {
    if (token) {
      const verify = async () => {
        try {
          const res = await verifyEmail(token).unwrap();
          dispatch(setCredentials(res));
          setStatus('success');
        } catch (err) {
          setStatus('error');
        }
      };
      verify();
    }
  }, [token, verifyEmail, dispatch]);

  return (
    <Container className="d-flex justify-content-center align-items-center py-5">
      <Card className="shadow-sm p-4 text-center" style={{ maxWidth: '500px', width: '100%' }}>
        <Card.Body>
          <h2 className="mb-4">Email Verification</h2>
          
          {isLoading && <Loader />}
          
          {status === 'success' && (
            <>
              <Alert variant="success">
                Your email has been successfully verified!
              </Alert>
              <p>You are now logged in.</p>
              <Link to="/">
                <Button variant="primary">Go to Home</Button>
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <Alert variant="danger">
                {error?.data?.message || 'Verification failed. The link may be invalid or expired.'}
              </Alert>
              <Link to="/login">
                <Button variant="secondary">Go to Login</Button>
              </Link>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VerifyEmailPage;