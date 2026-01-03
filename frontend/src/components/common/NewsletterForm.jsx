import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { FaPaperPlane } from 'react-icons/fa';
import { sendContactEmail } from '../../services/emailjsService';

const NewsletterForm = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendContactEmail({ name: 'Newsletter Subscriber', email, subject: 'Newsletter Signup', message: 'Please add me to the newsletter.', to_email: 'mikiasmulu93@gmail.com' });
      setLoading(false);
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      setLoading(false);
      alert('Failed to subscribe. Please try again later.');
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="newsletter-main-form d-flex flex-column flex-sm-row align-items-center gap-2 p-3 bg-white rounded-4 shadow-sm mx-auto" style={{maxWidth: 480}}>
      <Form.Control
        type="email"
        placeholder="Your email..."
        className="rounded-pill px-4 flex-grow-1"
        aria-label="Your email address"
        value={email}
        onChange={e => setEmail(e.target.value)}
        required
        disabled={loading}
        style={{ minWidth: 0 }}
      />
      <Button type="submit" variant="primary" className="rounded-pill px-4 fw-bold d-flex align-items-center gap-2" disabled={loading} style={{whiteSpace: 'nowrap'}}>
        {loading ? '...' : <><FaPaperPlane /> Subscribe</>}
      </Button>
      {submitted && (
        <div className="small text-success w-100 text-center mt-3" style={{position:'static'}}>
          Thank you for subscribing!<br />
          <strong>- Mikias Mulu, Bookstore Owner</strong>
        </div>
      )}
    </Form>
  );
};

export default NewsletterForm;
