import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from '../common/Header';
import Footer from '../common/Footer';

const PublicLayout = () => {
  const location = useLocation();
  // List of routes where Header should be hidden
  const hideHeaderRoutes = [
    '/profile', '/shipping', '/payment', '/placeorder', '/order',
    '/policies/privacy', '/policies/terms', '/policies/cookie', '/policies/security'
  ];
  const shouldHideHeader = hideHeaderRoutes.some(route => location.pathname.startsWith(route));
  return (
    <>
      {!shouldHideHeader && <Header />}
      <main className="py-3">
        <Container>
          <Outlet />
        </Container>
      </main>
    </>
  );
};

export default PublicLayout;
