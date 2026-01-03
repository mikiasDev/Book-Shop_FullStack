import React, { useState } from 'react';
import { Row, Col, Card, Button, Badge, Form, Modal } from 'react-bootstrap';
import { FaPlus, FaPencilAlt, FaTrash, FaMapMarkerAlt } from 'react-icons/fa';

const UserAddresses = () => {
  const [showModal, setShowModal] = useState(false);
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      type: 'Home',
      street: '123 Main St',
      city: 'New York',
      state: 'NY',
      zip: '10001',
      country: 'USA',
      isDefault: true,
    },
    {
      id: 2,
      type: 'Work',
      street: '456 Corporate Blvd',
      city: 'San Francisco',
      state: 'CA',
      zip: '94105',
      country: 'USA',
      isDefault: false,
    },
  ]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      setAddresses(addresses.filter((addr) => addr.id !== id));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>My Addresses</h3>
        <Button variant="primary" size="sm" onClick={handleShow}>
          <FaPlus className="me-2" /> Add New Address
        </Button>
      </div>

      <Row>
        {addresses.map((address) => (
          <Col md={6} className="mb-4" key={address.id}>
            <Card className={`h-100 shadow-sm ${address.isDefault ? 'border-primary' : 'border-0'}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <Badge bg={address.type === 'Home' ? 'info' : 'secondary'}>{address.type}</Badge>
                  {address.isDefault && <Badge bg="primary">Default</Badge>}
                </div>
                <Card.Title className="h5 mb-3">
                  <FaMapMarkerAlt className="text-muted me-2" />
                  {address.street}
                </Card.Title>
                <Card.Text className="text-muted">
                  {address.city}, {address.state} {address.zip}
                  <br />
                  {address.country}
                </Card.Text>
                <hr />
                <div className="d-flex justify-content-end gap-2">
                  <Button variant="outline-secondary" size="sm">
                    <FaPencilAlt /> Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(address.id)}>
                    <FaTrash /> Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Address Modal (Placeholder for functionality) */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Address</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Address Type</Form.Label>
              <Form.Select>
                <option>Home</option>
                <option>Work</option>
                <option>Other</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Street Address</Form.Label>
              <Form.Control type="text" placeholder="123 Main St" />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" placeholder="City" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control type="text" placeholder="State" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Zip Code</Form.Label>
                  <Form.Control type="text" placeholder="Zip" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Country</Form.Label>
                  <Form.Control type="text" placeholder="Country" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Set as default address" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Address
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default UserAddresses;
