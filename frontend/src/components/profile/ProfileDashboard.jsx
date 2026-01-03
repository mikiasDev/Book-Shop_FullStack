import React from 'react';
import { Row, Col, Card, Button } from 'react-bootstrap';
import { FaShoppingBag, FaUser, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { LinkContainer } from 'react-router-bootstrap';

const ProfileDashboard = ({ setActiveTab }) => {
  const { userInfo } = useSelector((state) => state.auth);

  // Helper to get absolute avatar URL
  const backendUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  const avatarUrl = userInfo?.avatar?.startsWith('/uploads')
    ? `${backendUrl}${userInfo.avatar}`
    : userInfo?.avatar;

  return (
    <div>
      <h2 className="mb-4">Dashboard</h2>
      <div className="mb-4 d-flex align-items-center gap-3">
        {avatarUrl ? (
          <img src={avatarUrl} alt="Avatar" style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover', background: '#f0f0f0' }} />
        ) : (
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, fontWeight: 700, color: '#4a00e0' }}>
            {userInfo?.name?.charAt(0).toUpperCase() || '?'}
          </div>
        )}
        <div>
          <h4>Welcome back, {userInfo?.name}!</h4>
          <p className="text-muted">
            From your account dashboard you can view your recent orders, manage your shipping and billing addresses, and edit your password and account details.
          </p>
        </div>
      </div>

      <Row className="g-4">
        <Col md={6} lg={4}>
          <Card className="h-100 border-0 shadow-sm text-center p-3 hover-card">
            <Card.Body>
              <div className="icon-circle bg-primary bg-opacity-10 text-primary mb-3 mx-auto">
                <FaShoppingBag size={24} />
              </div>
              <Card.Title>Orders</Card.Title>
              <Card.Text className="text-muted small">
                Check the status of your orders and view receipts.
              </Card.Text>
              <Button variant="outline-primary" size="sm" onClick={() => setActiveTab('orders')}>
                View Orders
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100 border-0 shadow-sm text-center p-3 hover-card">
            <Card.Body>
              <div className="icon-circle bg-success bg-opacity-10 text-success mb-3 mx-auto">
                <FaUser size={24} />
              </div>
              <Card.Title>Profile</Card.Title>
              <Card.Text className="text-muted small">
                Update your personal information and login credentials.
              </Card.Text>
              <Button variant="outline-success" size="sm" onClick={() => setActiveTab('profile')}>
                Edit Profile
              </Button>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} lg={4}>
          <Card className="h-100 border-0 shadow-sm text-center p-3 hover-card">
            <Card.Body>
              <div className="icon-circle bg-warning bg-opacity-10 text-warning mb-3 mx-auto">
                <FaMapMarkerAlt size={24} />
              </div>
              <Card.Title>Addresses</Card.Title>
              <Card.Text className="text-muted small">
                Manage your shipping and billing addresses.
              </Card.Text>
              <Button variant="outline-warning" size="sm" onClick={() => setActiveTab('addresses')}>
                Manage Addresses
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default ProfileDashboard;
