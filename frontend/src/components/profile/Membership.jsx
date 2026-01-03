import React from 'react';
import { Card, ProgressBar, Row, Col, Badge, Button } from 'react-bootstrap';
import { FaCrown, FaStar, FaGift } from 'react-icons/fa';

const Membership = () => {
  return (
    <div>
      <h3 className="mb-4">Membership & Rewards</h3>
      
      {/* Current Tier Card */}
      <Card className="bg-dark text-white mb-4 border-0 shadow overflow-hidden">
        <div className="position-absolute top-0 end-0 p-3 opacity-25">
          <FaCrown size={120} />
        </div>
        <Card.Body className="p-4 position-relative">
          <div className="d-flex justify-content-between align-items-start mb-4">
            <div>
              <h6 className="text-uppercase letter-spacing-2 mb-1">Current Tier</h6>
              <h2 className="display-5 fw-bold text-warning">Gold Member</h2>
            </div>
            <div className="text-end">
              <h6 className="text-uppercase letter-spacing-2 mb-1">Points Balance</h6>
              <h2 className="fw-bold">2,450</h2>
            </div>
          </div>
          
          <div className="mb-2">
            <div className="d-flex justify-content-between small mb-1">
              <span>Progress to Platinum</span>
              <span>550 points needed</span>
            </div>
            <ProgressBar variant="warning" now={80} style={{ height: '8px' }} />
          </div>
        </Card.Body>
      </Card>

      <Row className="g-4 mb-4">
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm text-center p-3">
            <Card.Body>
              <FaStar size={32} className="text-warning mb-3" />
              <h5>Earn Points</h5>
              <p className="text-muted small">Get 10 points for every $1 spent on books.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm text-center p-3">
            <Card.Body>
              <FaGift size={32} className="text-primary mb-3" />
              <h5>Redeem Rewards</h5>
              <p className="text-muted small">Use points for discounts on future purchases.</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 border-0 shadow-sm text-center p-3">
            <Card.Body>
              <FaCrown size={32} className="text-danger mb-3" />
              <h5>VIP Benefits</h5>
              <p className="text-muted small">Free shipping and early access to sales.</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <h5 className="mb-3">Available Coupons</h5>
      <Row>
        <Col md={6}>
          <Card className="border-dashed border-2 border-primary bg-light mb-3">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">10% OFF</h5>
                <p className="mb-0 small text-muted">Valid on Fiction books</p>
              </div>
              <Button variant="primary" size="sm">Apply</Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="border-dashed border-2 border-success bg-light mb-3">
            <Card.Body className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-1">$5.00 Voucher</h5>
                <p className="mb-0 small text-muted">Loyalty Reward</p>
              </div>
              <Button variant="success" size="sm">Redeem</Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Membership;
