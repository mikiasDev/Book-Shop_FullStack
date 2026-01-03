import React, { useState } from 'react';
import { Form, Button, Alert, Row, Col } from 'react-bootstrap';
import { FaShieldAlt, FaMobileAlt, FaHistory } from 'react-icons/fa';

const SecuritySettings = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const submitHandler = (e) => {
    e.preventDefault();
    // Handle password change logic
    alert('Password update logic to be implemented');
  };

  return (
    <div>
      <h3 className="mb-4">Security Settings</h3>
      
      <div className="mb-5">
        <h5 className="mb-3">Change Password</h5>
        <Form onSubmit={submitHandler}>
          <Form.Group className="mb-3">
            <Form.Label>Current Password</Form.Label>
            <Form.Control 
              type="password" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </Form.Group>
          <Row>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control 
                  type="password" 
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
            </Col>
          </Row>
          <Button variant="primary" type="submit">Update Password</Button>
        </Form>
      </div>

      <hr />

      <div className="mb-5">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div>
            <h5 className="mb-1"><FaShieldAlt className="text-success me-2"/> Two-Factor Authentication (2FA)</h5>
            <p className="text-muted mb-0">Add an extra layer of security to your account.</p>
          </div>
          <Form.Check 
            type="switch"
            id="2fa-switch"
            checked={twoFactorEnabled}
            onChange={(e) => setTwoFactorEnabled(e.target.checked)}
            label={twoFactorEnabled ? "Enabled" : "Disabled"}
          />
        </div>
      </div>

      <hr />

      <div>
        <h5 className="mb-3"><FaHistory className="me-2"/> Recent Login Activity</h5>
        <Alert variant="light" className="border">
          <div className="d-flex justify-content-between">
            <div>
              <strong>Windows PC - Chrome</strong>
              <div className="text-muted small">New York, USA • Just now</div>
            </div>
            <span className="badge bg-success align-self-center">Active Now</span>
          </div>
        </Alert>
        <Alert variant="light" className="border">
          <div className="d-flex justify-content-between">
            <div>
              <strong>iPhone 13 - Safari</strong>
              <div className="text-muted small">New York, USA • 2 hours ago</div>
            </div>
          </div>
        </Alert>
      </div>

      <hr />

      <div className="mt-5">
        <h5 className="text-danger mb-3">Danger Zone</h5>
        <div className="border border-danger rounded p-3 bg-danger bg-opacity-10">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h6 className="text-danger fw-bold">Delete Account</h6>
              <p className="text-muted mb-0 small">
                Once you delete your account, there is no going back. Please be certain.
              </p>
            </div>
            <Button variant="danger" size="sm">Delete Account</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
