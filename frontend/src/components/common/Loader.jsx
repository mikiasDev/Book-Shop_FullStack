import React from 'react';
import { Spinner } from 'react-bootstrap';

const Loader = () => {
  return (
    <div 
      className="d-flex justify-content-center align-items-center" 
      style={{ minHeight: '200px', width: '100%' }}
    >
      <Spinner
        animation="border"
        role="status"
        variant="primary"
        style={{
          width: '3rem',
          height: '3rem',
          borderWidth: '0.25em',
        }}
      >
        <span className="visually-hidden">Loading...</span>
      </Spinner>
    </div>
  );
};

export default Loader;