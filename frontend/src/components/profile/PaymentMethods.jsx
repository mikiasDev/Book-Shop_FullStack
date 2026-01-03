import React, { useState } from 'react';
import { Row, Col, Card, Button, Badge, Modal, Form } from 'react-bootstrap';
import { FaPlus, FaTrash, FaCcVisa, FaCcMastercard, FaCcAmex } from 'react-icons/fa';

const PaymentMethods = () => {
  const [showModal, setShowModal] = useState(false);
  const [cards, setCards] = useState([
    { id: 1, type: 'Visa', last4: '4242', expiry: '12/25', isDefault: true },
    { id: 2, type: 'Mastercard', last4: '8888', expiry: '09/24', isDefault: false },
  ]);

  const handleClose = () => setShowModal(false);
  const handleShow = () => setShowModal(true);

  const getCardIcon = (type) => {
    switch (type) {
      case 'Visa': return <FaCcVisa size={32} className="text-primary" />;
      case 'Mastercard': return <FaCcMastercard size={32} className="text-warning" />;
      case 'Amex': return <FaCcAmex size={32} className="text-info" />;
      default: return <FaCcVisa size={32} className="text-secondary" />;
    }
  };

  const handleDelete = (id) => {
    if (window.confirm('Remove this payment method?')) {
      setCards(cards.filter(c => c.id !== id));
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Payment Methods</h3>
        <Button variant="primary" size="sm" onClick={handleShow}>
          <FaPlus className="me-2" /> Add New Card
        </Button>
      </div>

      <Row>
        {cards.map((card) => (
          <Col md={6} className="mb-4" key={card.id}>
            <Card className={`h-100 shadow-sm ${card.isDefault ? 'border-primary' : 'border-0'}`}>
              <Card.Body>
                <div className="d-flex justify-content-between align-items-start mb-3">
                  {getCardIcon(card.type)}
                  {card.isDefault && <Badge bg="primary">Default</Badge>}
                </div>
                <Card.Title className="h5 mb-1">
                  •••• •••• •••• {card.last4}
                </Card.Title>
                <Card.Text className="text-muted small mb-3">
                  Expires {card.expiry}
                </Card.Text>
                <div className="d-flex justify-content-end">
                  <Button variant="outline-danger" size="sm" onClick={() => handleDelete(card.id)}>
                    <FaTrash /> Remove
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Add Card Modal */}
      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Card</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Card Number</Form.Label>
              <Form.Control type="text" placeholder="0000 0000 0000 0000" />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Expiry Date</Form.Label>
                  <Form.Control type="text" placeholder="MM/YY" />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>CVC</Form.Label>
                  <Form.Control type="text" placeholder="123" />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Cardholder Name</Form.Label>
              <Form.Control type="text" placeholder="Name on card" />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Check type="checkbox" label="Set as default payment method" />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Card
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentMethods;
