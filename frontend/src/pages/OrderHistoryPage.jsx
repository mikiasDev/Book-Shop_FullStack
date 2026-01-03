// frontend/src/pages/OrderHistoryPage.jsx
import React, { useEffect } from 'react';
import { Container, Table, Button, Alert } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { FaTimes, FaCheck, FaEye } from 'react-icons/fa';
import { getUserOrders } from '../redux/slices/orderSlice';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const OrderHistoryPage = () => {
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const { orders, loading, error } = useSelector((state) => state.order);

  useEffect(() => {
    if (userInfo) {
      dispatch(getUserOrders());
    }
  }, [dispatch, userInfo]);

  return (
    <Container className="py-4">
      <h2 className="mb-4">Order History</h2>
      
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : orders && orders.length === 0 ? (
        <Message>
          You haven't placed any orders yet.{' '}
          <LinkContainer to="/">
            <Button variant="link" className="p-0">Start Shopping</Button>
          </LinkContainer>
        </Message>
      ) : (
        <Table striped bordered hover responsive className="table-sm">
          <thead>
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders && orders.map((order) => (
              <tr key={order._id}>
                <td>{order._id}</td>
                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                <td>${order.totalPrice.toFixed(2)}</td>
                <td>
                  {order.isPaid ? (
                    <>
                      <FaCheck className="text-success" />{' '}
                      {new Date(order.paidAt).toLocaleDateString()}
                    </>
                  ) : (
                    <FaTimes className="text-danger" />
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <>
                      <FaCheck className="text-success" />{' '}
                      {new Date(order.deliveredAt).toLocaleDateString()}
                    </>
                  ) : (
                    <FaTimes className="text-danger" />
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant="light" className="btn-sm">
                      <FaEye />
                    </Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default OrderHistoryPage;