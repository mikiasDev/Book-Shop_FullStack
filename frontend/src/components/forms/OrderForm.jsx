import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';

const OrderForm = ({ initialData, onSubmit }) => {
  const [address, setAddress] = useState(initialData.address || '');
  const [city, setCity] = useState(initialData.city || '');
  const [postalCode, setPostalCode] = useState(initialData.postalCode || '');
  const [country, setCountry] = useState(initialData.country || '');

  const submitHandler = (e) => {
    e.preventDefault();
    onSubmit({ address, city, postalCode, country });
  };

  return (
    <Form onSubmit={submitHandler} role="form" aria-label="Order form">
      <Form.Group controlId="address" className="my-2">
        <Form.Label>Address</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter address"
          value={address}
          required
          onChange={(e) => setAddress(e.target.value)}
          aria-label="Address"
        ></Form.Control>
      </Form.Group>

      <Form.Group controlId="city" className="my-2">
        <Form.Label>City</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter city"
          value={city}
          required
          onChange={(e) => setCity(e.target.value)}
          aria-label="City"
        ></Form.Control>
      </Form.Group>

      <Form.Group controlId="postalCode" className="my-2">
        <Form.Label>Postal Code</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter postal code"
          value={postalCode}
          required
          onChange={(e) => setPostalCode(e.target.value)}
          aria-label="Postal code"
        ></Form.Control>
      </Form.Group>

      <Form.Group controlId="country" className="my-2">
        <Form.Label>Country</Form.Label>
        <Form.Control
          type="text"
          placeholder="Enter country"
          value={country}
          required
          onChange={(e) => setCountry(e.target.value)}
          aria-label="Country"
        ></Form.Control>
      </Form.Group>

      <Button type="submit" variant="primary" className="mt-3 w-100" aria-label="Submit order">
        Submit
      </Button>
    </Form>
  );
};

export default OrderForm;