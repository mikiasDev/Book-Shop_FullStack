import React, { useState, useEffect } from 'react';
import { sendContactEmail } from '../../services/emailjsService';
import { Container, Row, Col, Form, Button, Dropdown, Accordion, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { 
  FaFacebook, FaTwitter, FaInstagram, FaLinkedin, 
  FaPaperPlane, FaCcVisa, FaCcMastercard, FaCcPaypal, 
  FaCcAmex, FaGlobe, FaChevronUp,
  FaPhone, FaEnvelope,
  FaShieldAlt, FaTruck, FaHeadset, FaMobileAlt
} from 'react-icons/fa';
import { BiStore } from 'react-icons/bi';

// Floating Back to Top Button
const BackToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', toggleVisibility);
    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  if (!isVisible) return null;
  return (
    <button
      className="back-to-top-btn btn btn-primary rounded-circle position-fixed"
      style={{ bottom: 32, right: 32, zIndex: 9999, width: 48, height: 48, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      onClick={scrollToTop}
      aria-label="Back to top"
    >
      <FaChevronUp />
    </button>
  );
};

// Newsletter form component
function FooterNewsletterForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    try {
      await sendContactEmail({ 
        name: 'Newsletter Subscriber', 
        email, 
        subject: 'Newsletter Signup', 
        message: 'Please add me to the newsletter.', 
        to_email: 'mikiasmulu93@gmail.com' 
      });
      setSubmitted(true);
      setEmail('');
      setTimeout(() => setSubmitted(false), 4000);
    } catch (error) {
      console.error('Subscription failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form className="newsletter-form" onSubmit={handleSubmit}>
      <div className="input-group mb-3">
        <Form.Control
          type="email"
          placeholder="Enter your email"
          className="newsletter-input rounded-start"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
          disabled={loading || submitted}
          aria-label="Email address for newsletter"
        />
        <Button 
          type="submit" 
          variant="primary" 
          className="rounded-end px-4"
          disabled={loading || submitted}
          aria-label={loading ? 'Subscribing...' : 'Subscribe to newsletter'}
        >
          {loading ? (
            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
          ) : submitted ? (
            '✓'
          ) : (
            <FaPaperPlane />
          )}
        </Button>
      </div>
      {submitted && (
        <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
          Successfully subscribed! Check your email for confirmation.
        </div>
      )}
    </Form>
  );
}

// Store Status Component
const StoreStatus = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}`);
      setIsOpen(hours >= 9 && hours < 18);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="store-status d-flex align-items-center mb-3">
      <BiStore className={`fs-5 me-2 ${isOpen ? 'text-success' : 'text-secondary'}`} />
      <div>
        <small className="d-block">{isOpen ? 'Open Now' : 'Closed'}</small>
        <small className="text-muted">9am - 6pm • {currentTime}</small>
      </div>
    </div>
  );
};

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <>
      <footer className="footer-modern py-5" role="contentinfo">
        <Container>
          {/* Main Footer Content */}
          <Row className="g-4 mb-4">
            {/* Brand & Description */}
            <Col lg={3} md={6} className="mb-4">
              <div className="footer-brand mb-4">
                <div className="brand-logo d-flex align-items-center mb-3">
                  <div className="logo-icon me-2">
                    <i className="fas fa-book-open fs-3 text-primary"></i>
                  </div>
                  <h2 className="h4 fw-bold mb-0">Book Shop</h2>
                </div>
                <p className="text-muted mb-4">
                  Your gateway to literary worlds. Discover curated collections of fiction, non-fiction, and academic titles.
                </p>
                
                <StoreStatus />
                
                <div className="trust-badges d-flex flex-wrap gap-2 mb-4">
                  <Badge bg="light" text="dark" className="d-flex align-items-center py-2">
                    <FaShieldAlt className="me-1" /> Secure Payment
                  </Badge>
                  <Badge bg="light" text="dark" className="d-flex align-items-center py-2">
                    <FaTruck className="me-1" /> Free Shipping
                  </Badge>
                </div>
              </div>
            </Col>

            {/* Quick Links */}
            <Col lg={2} md={6} className="mb-4">
              <h5 className="footer-heading mb-4">Shop</h5>
              <ul className="footer-links list-unstyled">
                <li className="mb-3">
                  <Link to="/" className="footer-link d-flex align-items-center">
                    <span className="link-icon">📚</span>
                    <span>All Books</span>
                  </Link>
                </li>
              </ul>
            </Col>

            {/* Customer Service */}
            <Col lg={2} md={6} className="mb-4">
              <h5 className="footer-heading mb-4">Support</h5>
              <ul className="footer-links list-unstyled">
                <li className="mb-3">
                  <Link to="/contact" className="footer-link d-flex align-items-center">
                    <FaHeadset className="me-2" />
                    <span>Contact Us</span>
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/faq" className="footer-link d-flex align-items-center">
                    <span className="link-icon">❓</span>
                    <span>FAQ</span>
                  </Link>
                </li>
                <li className="mb-3">
                  <Link to="/shipping" className="footer-link d-flex align-items-center">
                    <FaTruck className="me-2" />
                    <span>Shipping Info</span>
                  </Link>
                </li>

              </ul>
            </Col>

            {/* Newsletter & Contact */}
            <Col lg={5} md={6} className="mb-4">
              <div className="newsletter-card p-4 rounded-3">
                <h5 className="footer-heading mb-3">Stay Updated</h5>
                <p className="text-muted mb-4">
                  Subscribe to get weekly book recommendations, author interviews, and exclusive offers.
                </p>
                <FooterNewsletterForm />
                
                <div className="contact-info mt-4 pt-3 border-top">
                  <div className="row g-3">
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center">
                        <FaPhone className="text-muted me-3" />
                        <div>
                          <small className="text-muted d-block">Phone</small>
                          <a href="tel:+251918527553" className="footer-link">+251 918 527 553</a>
                        </div>
                      </div>
                    </div>
                    <div className="col-sm-6">
                      <div className="d-flex align-items-center">
                        <FaEnvelope className="text-muted me-3" />
                        <div>
                          <small className="text-muted d-block">Email</small>
                          <a href="mailto:mikiasmulu93@gmail.com" className="footer-link">mikiasmulu93@gmail.com</a>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Mobile Accordion Footer (hidden on desktop) */}
          <div className="d-md-none mb-4">
            <Accordion flush>
              <Accordion.Item eventKey="0">
                <Accordion.Header>Quick Links</Accordion.Header>
                <Accordion.Body>
                  {/* Quick links content */}
                </Accordion.Body>
              </Accordion.Item>
              <Accordion.Item eventKey="1">
                <Accordion.Header>Support</Accordion.Header>
                <Accordion.Body>
                  {/* Support content */}
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </div>

          {/* Social & Payment Section */}
          <Row className="align-items-center py-4 border-top">
            <Col md={6} className="mb-3 mb-md-0">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <span className="text-muted">Follow us:</span>
                <div className="social-icons d-flex gap-2">
                  {[
                    { icon: FaFacebook, label: 'Facebook', color: '#1877F2', href: 'https://facebook.com/' },
                    { icon: FaTwitter, label: 'Twitter', color: '#1DA1F2', href: 'https://twitter.com/' },
                    { icon: FaInstagram, label: 'Instagram', color: '#E4405F', href: 'https://instagram.com/' },
                    { icon: FaLinkedin, label: 'LinkedIn', color: '#0A66C2', href: 'https://linkedin.com/' },
                  ].map((social, idx) => (
                    <a
                      key={idx}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="social-icon-link rounded-circle d-flex align-items-center justify-content-center"
                      style={{ background: social.color, color: '#fff', width: 40, height: 40, fontSize: 20, marginRight: 12 }}
                      aria-label={social.label}
                    >
                      <social.icon />
                    </a>
                  ))}
                </div>
                
                <div className="d-flex align-items-center ms-3">
                  <FaMobileAlt className="me-2 text-muted" />
                  <small>
                    <Link to="/app" className="footer-link">Get Our App</Link>
                  </small>
                </div>
              </div>
            </Col>
            
            <Col md={6} className="text-md-end">
              <div className="payment-methods d-flex align-items-center justify-content-md-end gap-2 mb-2">
                <span className="text-muted me-2">We accept:</span>
                <FaCcVisa className="fs-4 text-muted" />
                <FaCcMastercard className="fs-4 text-muted" />
                <FaCcPaypal className="fs-4 text-muted" />
                <FaCcAmex className="fs-4 text-muted" />
              </div>
              
              <div className="language-selector d-inline-block">
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" size="sm">
                    <FaGlobe className="me-1" /> English
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item>English</Dropdown.Item>
                    <Dropdown.Item>Amharic</Dropdown.Item>
                    <Dropdown.Item>French</Dropdown.Item>
                    <Dropdown.Item>Spanish</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </Col>
          </Row>

          {/* Bottom Bar */}
          <Row className="pt-4 border-top">
            <Col md={6} className="mb-3 mb-md-0">
              <div className="d-flex flex-wrap align-items-center gap-3">
                <small className="text-muted">&copy; {currentYear} Book Haven. All rights reserved.</small>
                <div className="legal-links d-flex gap-3">
                  <Link to="/policies/privacy" className="footer-link small">Privacy Policy</Link>
                  <Link to="/policies/terms" className="footer-link small">Terms of Service</Link>
                  <Link to="/policies/cookie" className="footer-link small">Cookie Policy</Link>
                </div>
              </div>
            </Col>
            
            <Col md={6} className="text-md-end">
              {/* Only this link should go to admin login. All other login/register actions go to /login or home. */}
              <div className="admin-links">
                <small>
                  <Link to="/admin/login" className="footer-link me-3">Admin</Link>
                </small>
              </div>
            </Col>
          </Row>
        </Container>
      </footer>
      
      <BackToTop />
      
    
    </>
  );
};

export default Footer;