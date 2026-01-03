import React from 'react';
import { Alert } from 'react-bootstrap';
import { 
  FaInfoCircle, 
  FaCheckCircle, 
  FaExclamationTriangle, 
  FaExclamationCircle 
} from 'react-icons/fa';

const Message = ({ variant = 'info', children }) => {
  // Helper to get the right icon based on the variant color
  const getIcon = () => {
    switch (variant) {
      case 'success':
        return <FaCheckCircle size={20} className="me-2" />;
      case 'danger':
        return <FaExclamationCircle size={20} className="me-2" />;
      case 'warning':
        return <FaExclamationTriangle size={20} className="me-2" />;
      default:
        return <FaInfoCircle size={20} className="me-2" />;
    }
  };

  return (
    <Alert 
      variant={variant} 
      className="d-flex align-items-center shadow-sm border-0 rounded-3 my-3"
    >
      <div className="d-flex align-items-center">
        {getIcon()}
      </div>
      <div className="fw-medium">
        {children}
      </div>
    </Alert>
  );
};

export default Message;