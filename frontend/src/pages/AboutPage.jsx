import React from 'react';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { FaRocket, FaLeaf, FaGlobe, FaCode, FaDatabase, FaLaptopCode, FaGithub, FaLinkedin } from 'react-icons/fa';
import styles from './AboutPage.module.css';

const AboutPage = () => {
  // Developer Data
  const teamMembers = [
    { name: "Mikias Mulu", role: "Full Stack Developer", color: "primary", photo: "/images/mikiasmulu.png" },
    { name: "Samuel Terefe", role: "UI/UX & Frontend", color: "success", photo: "/images/gatsby.jpg" },
    { name: "Adane Worku", role: "Backend Specialist", color: "info", photo: "/images/pride.png" },
    { name: "Bezawit Degu", role: "Database Engineer", color: "warning", photo: "/images/1984.png" },
    { name: "Getaneh", role: "DevOps Engineer", color: "danger", photo: "/images/getaneh.png" },
    { name: "Eyobed", role: "QA & Testing Lead", color: "dark", photo: "/images/eyobed.png" },
        { name: "Bethelhem", role: "UI/UX Designer", color: "dark", photo: "/images/hobbit.jpg" },
  ];

  // Inline CSS for animations and custom styles to avoid creating external files
  const styles = {
    heroSection: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      color: 'white',
      padding: '80px 0',
      marginBottom: '50px',
      borderRadius: '0 0 50px 50px',
    },
    cardHover: {
      transition: 'all 0.3s ease-in-out',
      cursor: 'pointer',
    },
    avatar: {
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      backgroundColor: '#f8f9fa',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '2rem',
      fontWeight: 'bold',
      margin: '0 auto 15px auto',
      border: '3px solid #dee2e6'
    }
  };

  return (
    <main className={styles['about-main-bg']} style={{ paddingTop: '80px', minHeight: '100vh' }}>
      {/* 1. ANIMATION STYLES INJECTED DIRECTLY */}
      <style type="text/css">
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translate3d(0, 40px, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }

          .team-card {
            animation-duration: 0.8s;
            animation-fill-mode: both;
            animation-name: fadeInUp;
          }

          .team-card:hover {
            transform: translateY(-10px);
            box-shadow: 0 1rem 3rem rgba(0,0,0,.175)!important;
          }

          /* Stagger animations for each child */
          ${teamMembers.map((_, i) => `
            .team-card:nth-child(${i + 1}) {
              animation-delay: ${i * 0.15}s;
            }
          `).join('')}
        `}
      </style>

      <div className="about-page">
        
        {/* 2. ADVANCED HERO SECTION */}
        <div className={styles['about-hero'] + " text-center shadow-lg"} style={{ padding: '80px 0', marginBottom: '50px' }}>
          <Container>
            <h1 className="display-4 fw-bold mb-3">Innovation Meets Literature</h1>
            <p className="lead mb-4" style={{ opacity: 0.9 }}>
              A next-generation digital bookstore powered by the MERN Stack. 
              Fast, secure, and built for the modern reader.
            </p>
            <Badge bg="light" text="dark" className="p-2 m-1">React.js</Badge>
            <Badge bg="light" text="dark" className="p-2 m-1">Node.js</Badge>
            <Badge bg="light" text="dark" className="p-2 m-1">MongoDB</Badge>
            <Badge bg="light" text="dark" className="p-2 m-1">Express</Badge>
          </Container>
        </div>

        <Container>
          {/* 3. FEATURES GRID */}
          <Row className="mb-5 text-center g-4">
            <Col md={4}>
              <div className={"p-4 h-100 rounded shadow-sm border-0 " + styles['about-card-feature']}>
                <FaRocket className="text-primary mb-3" size={40} />
                <h4>Lightning Fast</h4>
                <p className={styles['about-text-muted']}>Optimized performance using Redux state management for seamless navigation.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className={"p-4 h-100 rounded shadow-sm border-0 " + styles['about-card-feature']}>
                <FaGlobe className="text-success mb-3" size={40} />
                <h4>Global Access</h4>
                <p className={styles['about-text-muted']}>Connecting readers worldwide with secure authentication and diverse catalogs.</p>
              </div>
            </Col>
            <Col md={4}>
              <div className={"p-4 h-100 rounded shadow-sm border-0 " + styles['about-card-feature']}>
                <FaLeaf className="text-info mb-3" size={40} />
                <h4>Eco-Friendly</h4>
                <p className={styles['about-text-muted']}>Promoting digital literacy and sustainable reading habits for a better future.</p>
              </div>
            </Col>
          </Row>

          <hr className="my-5" />

          {/* 4. ANIMATED DEVELOPER TEAM SECTION */}
          <Row className="justify-content-center text-center mb-5">
            <Col md={8}>
              <h2 className="fw-bold mb-2">Meet The Minds</h2>
              <p className="text-muted">
                The talented developers behind this platform.
              </p>
            </Col>
          </Row>

          <Row className="g-4 mb-5 justify-content-center">
            {teamMembers.map((member, idx) => (
              <Col lg={4} md={6} sm={12} key={idx} className="team-card">
                <Card className={"h-100 border-0 shadow-sm text-center py-4 " + styles['about-card-team']}>
                  <Card.Body>
                    <div style={{...styles.avatar, color: `var(--bs-${member.color})`, borderColor: `var(--bs-${member.color})`, overflow: 'hidden', background: 'var(--card-bg, #fff)'}}>
                      <img
                        src={member.photo}
                        alt={member.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                        onError={e => { e.target.onerror = null; e.target.style.display = 'none'; }}
                      />
                    </div>
                    <Card.Title className="fw-bold" style={{ color: 'var(--color-text, #212529)' }}>{member.name}</Card.Title>
                    <Card.Subtitle className={"mb-3 " + styles['about-text-muted']}>{member.role}</Card.Subtitle>
                    <Card.Text className={"small " + styles['about-text-muted']}>
                      Passionate about building scalable web applications and solving complex problems with code.
                    </Card.Text>
                    
                    <div className="d-flex justify-content-center gap-3 mt-4">
                      <Button variant="outline-dark" size="sm" className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: 35, height: 35}}>
                        <FaGithub />
                      </Button>
                      <Button variant="outline-primary" size="sm" className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: 35, height: 35}}>
                        <FaLinkedin />
                      </Button>
                      <Button variant="outline-secondary" size="sm" className="rounded-circle p-2 d-flex align-items-center justify-content-center" style={{width: 35, height: 35}}>
                        <FaCode />
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>

          {/* 6. WHAT OUR READERS SAY (Animated Testimonials) */}
          <div className={styles['about-card-highlight'] + " p-5 rounded-3 mb-5 animated-testimonials"}>
            <h2 className="fw-bold text-center mb-5 animated-fade-in">What Our Readers Say</h2>
            <Row className="g-4 justify-content-center">
              <Col md={4} className="animated-fade-in-up">
                <Card className="border-0 shadow-sm text-center p-4">
                  <Card.Body>
                    <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Reader" className="rounded-circle mb-3" style={{ width: 60, height: 60 }} />
                    <Card.Text className="mb-2">“This bookstore changed the way I read. Fast, easy, and a huge selection!”</Card.Text>
                    <div className="fw-bold">John D.</div>
                    <div className="text-muted small">Verified Buyer</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="animated-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <Card className="border-0 shadow-sm text-center p-4">
                  <Card.Body>
                    <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Reader" className="rounded-circle mb-3" style={{ width: 60, height: 60 }} />
                    <Card.Text className="mb-2">“I love the eco-friendly approach and the global reach. Highly recommended!”</Card.Text>
                    <div className="fw-bold">Sarah K.</div>
                    <div className="text-muted small">Book Enthusiast</div>
                  </Card.Body>
                </Card>
              </Col>
              <Col md={4} className="animated-fade-in-up" style={{ animationDelay: '0.4s' }}>
                <Card className="border-0 shadow-sm text-center p-4">
                  <Card.Body>
                    <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Reader" className="rounded-circle mb-3" style={{ width: 60, height: 60 }} />
                    <Card.Text className="mb-2">“The team behind this site really cares about readers. Great support!”</Card.Text>
                    <div className="fw-bold">Alex P.</div>
                    <div className="text-muted small">Frequent Shopper</div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </div>

          {/* 5. TECHNICAL HIGHLIGHTS (Advanced Feel) */}
          <div className={styles['about-card-highlight'] + " p-5 rounded-3 mb-5"}>
            <Row className="align-items-center">
              <Col md={6}>
                <h3>Under the Hood</h3>
                <p className={"lead " + styles['about-text-muted']}>This platform is built with industry-standard practices.</p>
                <ul className="list-unstyled">
                  <li className="mb-2"><FaCheckCircle className="text-success me-2" /> RESTful API Architecture</li>
                  <li className="mb-2"><FaCheckCircle className="text-success me-2" /> JWT Authentication & Security</li>
                  <li className="mb-2"><FaCheckCircle className="text-success me-2" /> Responsive Bootstrap 5 Design</li>
                  <li className="mb-2"><FaCheckCircle className="text-success me-2" /> Redux Toolkit for State Management</li>
                </ul>
              </Col>
              <Col md={6} className="text-center">
                <FaLaptopCode size={120} className="text-secondary opacity-50" />
              </Col>
            </Row>
          </div>

        </Container>
      </div>
    </main>
  );
};

// Helper component for the list above
const FaCheckCircle = ({ className }) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" className={className} height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
    <path d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628 0z"></path>
  </svg>
);

export default AboutPage;