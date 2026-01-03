import React from 'react';
import { Container, Accordion } from 'react-bootstrap';

const FAQPage = () => (
  <Container className="py-5">
    <h2 className="mb-4 fw-bold text-center">Frequently Asked Questions</h2>
    <Accordion defaultActiveKey="0" flush>
      <Accordion.Item eventKey="0">
        <Accordion.Header>How do I create an account?</Accordion.Header>
        <Accordion.Body>
          Click the Register link in the header or footer, fill in your details, and follow the instructions sent to your email.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="1">
        <Accordion.Header>How can I reset my password?</Accordion.Header>
        <Accordion.Body>
          Use the "Forgot Password?" link on the login page. You will receive an email with instructions to reset your password.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="2">
        <Accordion.Header>How do I contact support?</Accordion.Header>
        <Accordion.Body>
          Visit the Contact page from the footer or header and fill out the form. Our team will respond as soon as possible.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="3">
        <Accordion.Header>Can I track my orders?</Accordion.Header>
        <Accordion.Body>
          Yes, log in to your account and go to your profile to view order history and track your orders.
        </Accordion.Body>
      </Accordion.Item>
      <Accordion.Item eventKey="4">
        <Accordion.Header>How do I change my account details?</Accordion.Header>
        <Accordion.Body>
          Go to your profile page after logging in. You can update your name, email, and password there.
        </Accordion.Body>
      </Accordion.Item>
    </Accordion>
  </Container>
);

export default FAQPage;
