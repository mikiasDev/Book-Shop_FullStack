import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { useRouteError, Link } from 'react-router-dom';
import { FaExclamationTriangle } from 'react-icons/fa';

const ErrorPage = () => {
  const error = useRouteError();
  console.error(error);

  return (
    <Container className="d-flex flex-column justify-content-center align-items-center vh-100 text-center">
      <FaExclamationTriangle className="text-warning mb-4" size={80} />
      <h1 className="mb-3">Oops! Something went wrong.</h1>
      <p className="lead mb-4">
        {error.statusText || error.message || "We couldn't find the page you were looking for."}
      </p>
      <div className="d-flex gap-3">
        <Link to="/">
          <Button variant="primary" size="lg">Go Home</Button>
        </Link>
        <Link to="/admin/dashboard">
          <Button variant="outline-secondary" size="lg">Admin Dashboard</Button>
        </Link>
      </div>
    </Container>
  );
};

export default ErrorPage;