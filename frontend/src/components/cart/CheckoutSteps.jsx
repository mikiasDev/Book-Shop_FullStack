import React from 'react';
import { Nav } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { FaSignInAlt, FaShippingFast, FaCreditCard, FaCheckCircle } from 'react-icons/fa';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  const steps = [
    { label: 'Sign In', icon: <FaSignInAlt />, link: '/login', active: step1, completed: step1 && step2 },
    { label: 'Shipping', icon: <FaShippingFast />, link: '/shipping', active: step2, completed: step2 && step3 },
    { label: 'Payment', icon: <FaCreditCard />, link: '/payment', active: step3, completed: step3 && step4 },
    { label: 'Place Order', icon: <FaCheckCircle />, link: '/placeorder', active: step4, completed: step4 },
  ];

  return (
    <div className="checkout-steps mb-5 px-4" aria-label="Checkout steps">
      <div className="d-flex justify-content-between position-relative align-items-center">
        {/* Progress Bar Background */}
        <div className="position-absolute w-100 bg-light" style={{ height: '4px', top: '20px', zIndex: 0 }}></div>
        
        {/* Active Progress Bar */}
        <div 
          className="position-absolute bg-primary transition-width" 
          style={{ 
            height: '4px', 
            top: '20px', 
            zIndex: 0,
            width: `${((steps.filter(s => s.active).length - 1) / (steps.length - 1)) * 100}%`,
            transition: 'width 0.5s ease'
          }}
        ></div>

        {steps.map((step, index) => (
          <div key={index} className="text-center position-relative" style={{ zIndex: 1 }} aria-label={`Step ${index + 1}: ${step.label}`}> 
            {step.active ? (
              <LinkContainer to={step.link}>
                <Nav.Link className="p-0 text-decoration-none" aria-label={step.label}>
                  <div 
                    className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 transition-all ${
                      step.active ? 'bg-primary text-white shadow-lg' : 'bg-light text-muted'
                    }`}
                    style={{ 
                      width: '40px', 
                      height: '40px', 
                      border: step.active ? 'none' : '2px solid #e9ecef',
                      transform: step.active ? 'scale(1.1)' : 'scale(1)',
                      transition: 'all 0.3s ease'
                    }}
                    aria-label={step.completed ? `${step.label} completed` : step.label}
                  >
                    {step.completed ? <FaCheckCircle aria-label="Completed" /> : React.cloneElement(step.icon, { 'aria-label': step.label })}
                  </div>
                  <span 
                    className={`small fw-bold ${step.active ? 'text-primary' : 'text-muted'}`}
                    style={{ transition: 'color 0.3s ease' }}
                    aria-label={step.label}
                  >
                    {step.label}
                  </span>
                </Nav.Link>
              </LinkContainer>
            ) : (
              <span className="p-0 text-decoration-none" aria-label={step.label}>
                <div 
                  className={`rounded-circle d-flex align-items-center justify-content-center mx-auto mb-2 transition-all bg-light text-muted`}
                  style={{ 
                    width: '40px', 
                    height: '40px', 
                    border: '2px solid #e9ecef',
                    transform: 'scale(1)',
                    transition: 'all 0.3s ease'
                  }}
                  aria-label={step.label}
                >
                  {React.cloneElement(step.icon, { 'aria-label': step.label })}
                </div>
                <span 
                  className="small fw-bold text-muted"
                  style={{ transition: 'color 0.3s ease' }}
                  aria-label={step.label}
                >
                  {step.label}
                </span>
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CheckoutSteps;