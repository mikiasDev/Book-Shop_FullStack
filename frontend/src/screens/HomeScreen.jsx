import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Container } from 'react-bootstrap';
import Product from '../components/Product';
// import Loader from '../components/Loader'; // Uncomment if you have these
// import Message from '../components/Message'; // Uncomment if you have these
import { listProducts } from '../redux/actions/productActions'; // Adjust path based on your redux setup

const HomeScreen = () => {
  const dispatch = useDispatch();

  // Fetch product list from Redux state
  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  useEffect(() => {
    dispatch(listProducts());
  }, [dispatch]);

  return (
    <div className="homescreen-content">
      {/* Hero Section / Banner (Optional) */}
      <div className="text-center py-4 mb-4" style={{ background: '#fff', borderRadius: '15px', boxShadow: '0 5px 15px rgba(0,0,0,0.05)' }}>
        <h1 className="display-5 fw-bold" style={{ color: '#2a5298' }}>Welcome to MERN Bookstore</h1>
        <p className="text-muted">Discover your next favorite book today.</p>
      </div>

      <h3 className="mb-4 section-title">Latest Books</h3>
      
      {loading ? (
        <h2>Loading...</h2> // Replace with <Loader /> if you have it
      ) : error ? (
        <h3>{error}</h3> // Replace with <Message variant='danger'>{error}</Message>
      ) : (
        <Row>
          {products.map((product) => (
            <Col key={product._id} sm={12} md={6} lg={4} xl={3}>
              <Product product={product} />
            </Col>
          ))}
        </Row>
      )}
    </div>
  );
};

export default HomeScreen;