import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const PublisherEditModal = ({ show, onHide, publisher, onSave }) => {
  const [name, setName] = useState(publisher ? publisher.name : '');
  const [country, setCountry] = useState(publisher ? publisher.country : '');

  useEffect(() => {
    setName(publisher ? publisher.name : '');
    setCountry(publisher ? publisher.country : '');
  }, [publisher]);

  const handleSave = () => {
    if (name.trim()) {
      onSave({ ...publisher, name: name.trim(), country: country.trim() });
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{publisher ? 'Edit Publisher' : 'Add Publisher'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="publisherName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              autoFocus
            />
          </Form.Group>
          <Form.Group controlId="publisherCountry" className="mt-3">
            <Form.Label>Country</Form.Label>
            <Form.Control
              type="text"
              value={country}
              onChange={e => setCountry(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={!name.trim()}>
          Save
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default PublisherEditModal;
