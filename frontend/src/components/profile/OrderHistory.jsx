import React, { useEffect, useState } from 'react';
import { Table, Button, Badge } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { FaTimes, FaCheck } from 'react-icons/fa';
import Message from '../common/Message';
import Loader from '../common/Loader';
import BookDownloadButton from '../books/BookDownloadButton';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fixed: Access state.auth
  const { userInfo } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get('/api/orders/myorders', config);
        console.log('OrderHistory orders data:', data); // DEBUG LOG
        setOrders(data);
        setLoading(false);
      } catch (err) {
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        setLoading(false);
      }
    };

    if (userInfo) {
      fetchOrders();
    }
  }, [userInfo]);

  return (
    <>
      <h3 className="mb-4">Order History</h3>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error}</Message>
      ) : (
        <Table hover responsive className='align-middle' aria-label="Order history table">
          <thead className="bg-light">
            <tr>
              <th>ID</th>
              <th>DATE</th>
              <th>TOTAL</th>
              <th>PAID</th>
              <th>DELIVERED</th>
              <th>Downloads</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} aria-label={`Order ${order._id}`}> 
                <td><small className="text-muted">{order._id}</small></td>
                <td>{order.createdAt.substring(0, 10)}</td>
                <td aria-label={`Total: $${order.totalPrice}`}>${order.totalPrice}</td>
                <td>
                  {order.isPaid ? (
                    <Badge bg="success" aria-label={`Paid on ${order.paidAt.substring(0, 10)}`}>Paid {order.paidAt.substring(0, 10)}</Badge>
                  ) : (
                    <Badge bg="danger" aria-label="Not paid">Not Paid</Badge>
                  )}
                </td>
                <td>
                  {order.isDelivered ? (
                    <Badge bg="success" aria-label={`Delivered on ${order.deliveredAt.substring(0, 10)}`}>Delivered {order.deliveredAt.substring(0, 10)}</Badge>
                  ) : (
                    <Badge bg="warning" text="dark" aria-label="Pending delivery">Pending</Badge>
                  )}
                </td>
                <td>
                  {order.orderItems && order.orderItems.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      {order.orderItems.map((item) => (
                        <BookDownloadButton
                          key={item.product}
                          bookId={item.product}
                          fileUrl={item.fileUrl}
                          isPaid={order.isPaid && order.isDelivered}
                        />
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted">-</span>
                  )}
                </td>
                <td>
                  <LinkContainer to={`/order/${order._id}`}>
                    <Button variant='outline-primary' size='sm' className="rounded-pill" aria-label={`View details for order ${order._id}`}>Details</Button>
                  </LinkContainer>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </>
  );
};

export default OrderHistory;