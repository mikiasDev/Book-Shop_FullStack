import React, { useState, useEffect } from 'react';
import { sendContactEmail } from '../services/emailjsService';
import { 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Card, 
  Alert,
  Badge,
  Accordion
} from 'react-bootstrap';
import { 
  FaPaperPlane, 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock,
  FaCheckCircle,
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
  FaBook,
  FaShippingFast,
  FaExchangeAlt,
  FaCreditCard,
  FaQuestionCircle,
  FaUserGraduate,
  FaUniversity,
  FaGlobeAfrica,
  FaUsers
} from 'react-icons/fa';
import { useSelector } from 'react-redux';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    phone: '',
    department: ''
  });
  
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);
  const { userInfo } = useSelector((state) => state.auth);

  // Auto-fill if user is logged in
  useEffect(() => {
    if (userInfo) {
      setFormData(prev => ({
        ...prev,
        name: userInfo.name || '',
        email: userInfo.email || ''
      }));
    }
  }, [userInfo]);

  // Fix header overlap
  useEffect(() => {
    document.body.classList.add('contact-page');
    const header = document.querySelector('.glass-navbar');
    if (header) {
      const headerHeight = header.offsetHeight;
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.style.paddingTop = `${headerHeight + 30}px`;
      }
    }

    return () => {
      document.body.classList.remove('contact-page');
      const mainContent = document.querySelector('main');
      if (mainContent) {
        mainContent.style.paddingTop = '';
      }
    };
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendContactEmail(formData);
      setLoading(false);
      setSubmitted(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        phone: '',
        department: ''
      });
      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      setLoading(false);
      alert('Failed to send message. Please try again later.');
    }
  };

  const toggleAccordion = (index) => {
    setActiveAccordion(activeAccordion === index ? null : index);
  };

  const contactInfo = [
    {
      icon: <FaMapMarkerAlt className="text-primary" size={24} />,
      title: 'Visit Our Store',
      details: ['University of Gondar Main Campus', 'Maraki Campus, Faculty of Business', 'Gondar, Ethiopia'],
      color: 'primary'
    },
    {
      icon: <FaPhone className="text-success" size={24} />,
      title: 'Call Us',
      details: ['+251 91 234 5678', 'Mon-Fri: 8:30AM-5:30PM EAT', 'Sat: 9:00AM-1:00PM EAT'],
      color: 'success'
    },
    {
      icon: <FaEnvelope className="text-warning" size={24} />,
      title: 'Email Us',
      details: ['support@gondarbookstore.com', 'orders@gondarbookstore.com', 'academic@gondarbookstore.com'],
      color: 'warning'
    },
    {
      icon: <FaClock className="text-info" size={24} />,
      title: 'Business Hours',
      details: ['Mon-Fri: 8:30 AM - 5:30 PM', 'Saturday: 9:00 AM - 1:00 PM', 'Sunday: Closed'],
      color: 'info'
    }
  ];

  const socialLinks = [
    { icon: <FaFacebook />, name: 'Facebook', color: '#1877F2', link: 'https://facebook.com/gondarbookstore' },
    { icon: <FaTwitter />, name: 'Twitter', color: '#1DA1F2', link: 'https://twitter.com/gondarbooks' },
    { icon: <FaInstagram />, name: 'Instagram', color: '#E4405F', link: 'https://instagram.com/gondarbookstore' },
    { icon: <FaLinkedin />, name: 'LinkedIn', color: '#0A66C2', link: 'https://linkedin.com/company/gondar-bookstore' }
  ];

  const faqItems = [
    {
      question: "How long does shipping take within Gondar?",
      answer: "Within Gondar city, we offer same-day delivery for orders placed before 2 PM. Standard delivery takes 24-48 hours. For University of Gondar campus deliveries, we have special campus delivery hours from 10 AM to 4 PM daily.",
      icon: <FaShippingFast />
    },
    {
      question: "What is your return policy for academic books?",
      answer: "Academic textbooks can be returned within 7 days of purchase if they are in original condition with no markings. Reference books and novels can be returned within 30 days. Please keep your receipt for all returns.",
      icon: <FaExchangeAlt />
    },
    {
      question: "Do you accept Ethiopian Birr payments?",
      answer: "Yes! We accept cash payments in Ethiopian Birr, mobile banking (CBE Birr, TeleBirr, M-Birr), bank transfers, and major credit/debit cards. We also offer payment plans for bulk academic book purchases.",
      icon: <FaCreditCard />
    },
    {
      question: "Do you sell university course materials?",
      answer: "Yes, we have a dedicated academic section with textbooks for all University of Gondar faculties including Medicine, Business, Law, Engineering, and Social Sciences. We also provide course packs and reference materials.",
      icon: <FaBook />
    },
    {
      question: "Can I order books not available in store?",
      answer: "Absolutely! We offer special ordering services for any book not currently in stock. Delivery typically takes 2-4 weeks for international orders. A 30% deposit is required for special orders.",
      icon: <FaGlobeAfrica />
    },
    {
      question: "Do you offer student discounts?",
      answer: "Yes! University of Gondar students receive a 15% discount on all academic textbooks with valid student ID. We also offer additional discounts during exam periods and special student events.",
      icon: <FaUserGraduate />
    },
    {
      question: "How can I sell my used textbooks?",
      answer: "We buy used textbooks in good condition. Please bring your books to our store for evaluation. We offer cash or store credit. The best times for textbook buyback are at the beginning and end of each semester.",
      icon: <FaExchangeAlt />
    },
    {
      question: "Do you provide book recommendations?",
      answer: "Yes, our knowledgeable staff can help you find the perfect book. We also have a book recommendation service on our website and can create personalized reading lists based on your interests.",
      icon: <FaQuestionCircle />
    }
  ];

  const storeFeatures = [
    {
      title: "Academic Focus",
      description: "Specialized textbook collection for UoG curriculum",
      icon: <FaUniversity />
    },
    {
      title: "Student Support",
      description: "Discounts and study materials for students",
      icon: <FaUserGraduate />
    },
    {
      title: "Local Authors",
      description: "Promoting Ethiopian authors and literature",
      icon: <FaBook />
    },
    {
      title: "Community Hub",
      description: "Book clubs and author events",
      icon: <FaUsers />
    }
  ];

  return (
    <main style={{ paddingTop: '80px', minHeight: '100vh' }}>
      <Container fluid className="contact-page-container py-5">
        {/* Hero Section */}
        <Row className="mb-5">
          <Col className="text-center">
            <Badge bg="primary" className="px-3 py-2 mb-3">
              <FaGlobeAfrica className="me-2" />
              Serving Gondar Since 2015
            </Badge>
            <h1 className="display-5 fw-bold mb-3">Contact Gondar Bookstore</h1>
            <p className="lead text-muted max-w-800 mx-auto">
              Your premier academic and general bookstore at University of Gondar.
              We're committed to supporting the educational journey of students and the reading culture of our community.
            </p>
          </Col>
        </Row>

        {/* Store Features */}
        <Row className="mb-5">
          <Col>
            <Card className="border-0 shadow-sm store-features-card">
              <Card.Body className="p-4">
                <h3 className="text-center mb-4 fw-bold">Why Choose Gondar Bookstore?</h3>
                <Row>
                  {storeFeatures.map((feature, index) => (
                    <Col md={3} key={index} className="text-center mb-3">
                      <div className="feature-icon mb-3">
                        {feature.icon}
                      </div>
                      <h5 className="fw-semibold">{feature.title}</h5>
                      <p className="text-muted small">{feature.description}</p>
                    </Col>
                  ))}
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="g-4">
          {/* Left Column - Contact Info */}
          <Col lg={5} className="mb-4">
            <Card className="border-0 shadow-sm h-100 contact-info-card">
              <Card.Body className="p-4">
                <h3 className="mb-4 fw-bold">
                  <FaMapMarkerAlt className="me-2 text-primary" />
                  Store Information
                </h3>
                
                {contactInfo.map((info, index) => (
                  <div key={index} className="mb-4">
                    <div className="d-flex align-items-center mb-2">
                      <div className={`contact-icon bg-${info.color} bg-opacity-10 p-3 rounded-circle me-3`}>
                        {info.icon}
                      </div>
                      <h5 className="mb-0 fw-semibold">{info.title}</h5>
                    </div>
                    <ul className="list-unstyled mb-0 ps-5">
                      {info.details.map((detail, idx) => (
                        <li key={idx} className="mb-1 text-muted">
                          {detail}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Social Media */}
                <div className="mt-5 pt-4 border-top">
                  <h5 className="mb-3 fw-semibold">Connect With Us</h5>
                  <div className="d-flex gap-3">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.link}
                        className="social-icon-link"
                        style={{ 
                          backgroundColor: social.color,
                          color: 'white'
                        }}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.name}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                </div>

                {/* Store Location Map */}
                <div className="mt-5 pt-4 border-top">
                  <h5 className="mb-3 fw-semibold">
                    <FaMapMarkerAlt className="me-2 text-primary" />
                    Find Our Store in Gondar
                  </h5>
                  <div className="map-container rounded-3 overflow-hidden shadow-sm">
                    <div className="store-location p-4">
                      <div className="d-flex align-items-start mb-3">
                        <FaUniversity className="text-primary fs-3 me-3" />
                        <div>
                          <h6 className="fw-bold mb-1">University of Gondar Campus Location</h6>
                          <p className="text-muted mb-2">
                            Located at the heart of Maraki Campus, next to the Faculty of Business
                          </p>
                        </div>
                      </div>
                      
                      <div className="location-details">
                        <h6 className="fw-semibold mb-2">Directions:</h6>
                        <ul className="list-unstyled mb-3">
                          <li className="mb-2">
                            <Badge bg="light" text="dark" className="me-2">1</Badge>
                            Enter through Maraki Campus Main Gate
                          </li>
                          <li className="mb-2">
                            <Badge bg="light" text="dark" className="me-2">2</Badge>
                            Head towards Faculty of Business building
                          </li>
                          <li className="mb-2">
                            <Badge bg="light" text="dark" className="me-2">3</Badge>
                            Look for our blue bookstore sign
                          </li>
                          <li>
                            <Badge bg="light" text="dark" className="me-2">4</Badge>
                            We're on the ground floor, next to the cafeteria
                          </li>
                        </ul>
                      </div>
                      
                      <div className="campus-services mt-4">
                        <h6 className="fw-semibold mb-2">Campus Services:</h6>
                        <Row>
                          <Col xs={6}>
                            <p className="mb-1 small">
                              <FaCheckCircle className="text-success me-1" />
                              Free campus delivery
                            </p>
                          </Col>
                          <Col xs={6}>
                            <p className="mb-1 small">
                              <FaCheckCircle className="text-success me-1" />
                              Study area available
                            </p>
                          </Col>
                          <Col xs={6}>
                            <p className="mb-1 small">
                              <FaCheckCircle className="text-success me-1" />
                              Printing & photocopy
                            </p>
                          </Col>
                          <Col xs={6}>
                            <p className="mb-1 small">
                              <FaCheckCircle className="text-success me-1" />
                              Coffee corner
                            </p>
                          </Col>
                        </Row>
                      </div>
                      
                      <Button 
                        variant="outline-primary" 
                        className="w-100 mt-3"
                        onClick={() => window.open('https://maps.google.com/?q=University+of+Gondar,+Gondar,+Ethiopia', '_blank')}
                      >
                        <FaMapMarkerAlt className="me-2" />
                        Open in Google Maps
                      </Button>
                    </div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Right Column - Contact Form */}
          <Col lg={7}>
            <Card className="border-0 shadow-sm contact-form-card">
              <Card.Body className="p-4 p-md-5">
                <div className="text-center mb-4">
                  <Badge bg="primary" className="px-3 py-2 mb-3">
                    <FaPaperPlane className="me-2" />
                    Send us a message
                  </Badge>
                  <h2 className="fw-bold">How Can We Help You?</h2>
                  <p className="text-muted">
                    Fill out the form below and our team will get back to you within 24 hours.
                    For urgent matters, please call us directly.
                  </p>
                </div>

                {submitted && (
                  <Alert variant="success" className="d-flex align-items-center" onClose={() => setSubmitted(false)} dismissible>
                    <FaCheckCircle className="me-2" size={20} />
                    <div>
                      <h6 className="mb-1">Message Sent Successfully!</h6>
                      <p className="mb-0 small">Thank you for contacting Gondar Bookstore. We'll respond within 24 hours.</p>
                    </div>
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Full Name <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          placeholder="Enter your full name"
                          required
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Email Address <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          placeholder="Enter your email"
                          required
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Phone Number
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          placeholder="+251 91 234 5678"
                          className="py-2"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold">
                          Department/Faculty
                        </Form.Label>
                        <Form.Select 
                          name="department" 
                          value={formData.department} 
                          onChange={handleChange}
                          className="py-2"
                        >
                          <option value="">Select department (optional)</option>
                          <option value="medicine">Medicine & Health Sciences</option>
                          <option value="business">Business & Economics</option>
                          <option value="engineering">Engineering & Technology</option>
                          <option value="law">Law</option>
                          <option value="social">Social Sciences</option>
                          <option value="natural">Natural Sciences</option>
                          <option value="other">Other</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">
                      Subject <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Select 
                      name="subject" 
                      value={formData.subject} 
                      onChange={handleChange}
                      required
                      className="py-2"
                    >
                      <option value="">Select a subject</option>
                      <option value="academic">Academic Book Inquiry</option>
                      <option value="order">Order Status</option>
                      <option value="shipping">Shipping & Delivery</option>
                      <option value="returns">Returns & Refunds</option>
                      <option value="wholesale">Wholesale/Bulk Orders</option>
                      <option value="event">Event/Book Signing</option>
                      <option value="career">Career Opportunity</option>
                      <option value="general">General Inquiry</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold">
                      Your Message <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      placeholder="Please describe your inquiry in detail..."
                      required
                      className="py-2"
                    />
                    <Form.Text className="text-muted">
                      Please provide as much detail as possible including course codes if asking about textbooks.
                    </Form.Text>
                  </Form.Group>

                  <div className="d-grid">
                    <Button
                      variant="primary"
                      type="submit"
                      size="lg"
                      className="py-3 fw-semibold"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                          Sending...
                        </>
                      ) : (
                        <>
                          <FaPaperPlane className="me-2" />
                          Send Message to Gondar Bookstore
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="text-center mt-3">
                    <p className="text-muted small mb-0">
                      By submitting this form, you agree to our{' '}
                      <a href="/privacy" className="text-decoration-none">Privacy Policy</a>
                    </p>
                  </div>
                </Form>
              </Card.Body>
            </Card>

            {/* FAQ Section */}
            <Card className="border-0 shadow-sm mt-4 faq-card">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h4 className="fw-bold mb-2">
                    <FaQuestionCircle className="text-primary me-2" />
                    Frequently Asked Questions
                  </h4>
                  <p className="text-muted">Find quick answers to common questions about our bookstore</p>
                </div>
                
                <Accordion defaultActiveKey="0">
                  {faqItems.map((faq, index) => (
                    <Accordion.Item 
                      key={index} 
                      eventKey={index.toString()}
                      className="mb-2 border-0"
                    >
                      <Accordion.Header className="fw-semibold">
                        <div className="d-flex align-items-center">
                          <span className="me-3 text-primary">{faq.icon}</span>
                          {faq.question}
                        </div>
                      </Accordion.Header>
                      <Accordion.Body className="text-muted">
                        {faq.answer}
                      </Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
                
                <div className="text-center mt-4">
                  <p className="mb-0">
                    Still have questions?{' '}
                    <Button 
                      variant="link" 
                      className="p-0 text-decoration-none"
                      onClick={() => document.getElementById('contactForm').scrollIntoView({ behavior: 'smooth' })}
                    >
                      Contact us directly
                    </Button>
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Quick Contact */}
            <Card className="border-0 shadow-sm mt-4 quick-contact-card">
              <Card.Body className="p-4">
                <Row>
                  <Col md={6} className="text-center">
                    <div className="mb-3">
                      <FaPhone className="text-success fs-1 mb-3" />
                      <h5 className="fw-semibold">Call Us Now</h5>
                      <p className="text-muted mb-2">For immediate assistance</p>
                      <h4 className="fw-bold">+251 91 234 5678</h4>
                    </div>
                  </Col>
                  <Col md={6} className="text-center border-start">
                    <div className="mb-3">
                      <FaEnvelope className="text-warning fs-1 mb-3" />
                      <h5 className="fw-semibold">Email Support</h5>
                      <p className="text-muted mb-2">For non-urgent inquiries</p>
                      <h6 className="fw-bold">support@gondarbookstore.com</h6>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </main>
  );
};

export default ContactPage;