import React, { useState, useMemo } from 'react';
import { Pagination, Card, Row, Col, Table, Button, Badge, Form, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FaSearch, FaEye } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useGetOrdersQuery, useDeliverOrderMutation, usePayOrderMutation } from '../redux/slices/ordersApiSlice';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';

const AdminOrders = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  // Filter states
    // Deliver order mutation
    const [deliverOrder, { isLoading: loadingDeliver }] = useDeliverOrderMutation();
    // Paid order mutation
    const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();

    // Handle mark as delivered/undelivered
  const [pendingOrderId, setPendingOrderId] = useState(null);
  const [pendingAction, setPendingAction] = useState(null);

  // Mark as delivered/undelivered
  const handleToggleDelivered = async (order) => {
    setPendingOrderId(order._id);
    setPendingAction('delivered');
    try {
      await deliverOrder(order._id).unwrap();
    } catch (err) {
      alert(err?.data?.message || err.error || 'Failed to update delivery status');
    }
    setPendingOrderId(null);
    setPendingAction(null);
  };

  // Mark as paid/unpaid
  const handleTogglePaid = async (order) => {
    setPendingOrderId(order._id);
    setPendingAction('paid');
    try {
      await payOrder({
        orderId: order._id,
        details: {
          id: 'admin-manual',
          status: order.isPaid ? 'unpaid' : 'COMPLETED',
          update_time: new Date().toISOString(),
          email_address: order.user?.email || '',
        },
      }).unwrap();
    } catch (err) {
      alert(err?.data?.message || err.error || 'Failed to update payment status');
    }
    setPendingOrderId(null);
    setPendingAction(null);
  };
  const [search, setSearch] = useState('');
  const [paid, setPaid] = useState('all');
  const [delivered, setDelivered] = useState('all');
  const [date, setDate] = useState('');


  // Pagination state
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 6;

  // Filtering logic
  const filteredOrders = useMemo(() => {
    if (!orders) return [];
    return orders.filter(order => {
      const userMatch = order.user && order.user.name.toLowerCase().includes(search.toLowerCase());
      const paidMatch = paid === 'all' ? true : paid === 'paid' ? order.isPaid : !order.isPaid;
      const deliveredMatch = delivered === 'all' ? true : delivered === 'delivered' ? order.isDelivered : !order.isDelivered;
      const dateMatch = date ? order.createdAt.substring(0, 10) === date : true;
      return userMatch && paidMatch && deliveredMatch && dateMatch;
    });
  }, [orders, search, paid, delivered, date]);

  // Paginated orders
  const pages = Math.ceil(filteredOrders.length / pageSize) || 1;
  const paginatedOrders = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    return filteredOrders.slice(start, start + pageSize);
  }, [filteredOrders, pageNumber, pageSize]);

  // Reset to page 1 when filters change
  React.useEffect(() => { setPageNumber(1); }, [search, paid, delivered, date]);

  return (
    <div className="admin-page-content">
      <div className="d-flex flex-column gap-3 mb-4">
        <h2 className="admin-page-title" style={{ marginBottom: 0 }}>Order Management</h2>
        <div className="order-control-bar d-flex flex-wrap align-items-center gap-2 p-3 mb-2 bg-white rounded shadow-sm border" style={{ minHeight: 64 }}>
          <InputGroup style={{ maxWidth: 260 }}>
            <Form.Control
              placeholder="Search user..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              aria-label="Search user"
              className="bg-light border-0"
              style={{ fontSize: '1rem' }}
            />
            <Button variant="outline-secondary" tabIndex={-1} style={{ border: 'none' }}>
              <FaSearch />
            </Button>
          </InputGroup>
          <Form.Select value={paid} onChange={e => setPaid(e.target.value)} style={{ maxWidth: 130, fontSize: '1rem', background: '#f8f9fa', border: 'none' }} aria-label="Filter by payment">
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="unpaid">Unpaid</option>
          </Form.Select>
          <Form.Select value={delivered} onChange={e => setDelivered(e.target.value)} style={{ maxWidth: 150, fontSize: '1rem', background: '#f8f9fa', border: 'none' }} aria-label="Filter by delivery">
            <option value="all">All Delivery</option>
            <option value="delivered">Delivered</option>
            <option value="undelivered">Undelivered</option>
          </Form.Select>
          <Form.Control
            type="date"
            value={date}
            onChange={e => setDate(e.target.value)}
            style={{ maxWidth: 160, fontSize: '1rem', background: '#f8f9fa', border: 'none' }}
            aria-label="Filter by date"
          />
          <div className="ms-auto text-muted small text-end" style={{ minWidth: 160 }}>
            <div className="fw-semibold">Page {pageNumber} of {pages}</div>
            <div>Total Orders: {filteredOrders.length}</div>
          </div>
        </div>
      </div>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant='danger'>{error?.data?.message || error.error}</Message>
      ) : (
        <Card className="shadow-sm border-0 admin-dashboard-table-wrapper" style={{ marginTop: '2rem' }}>
          <Card.Body className="p-0">
            <Table hover responsive className='admin-table align-middle mb-0'>
              <thead>
                <tr style={{ verticalAlign: 'middle', height: 56 }}>
                  <th>ID</th>
                  <th>USER</th>
                  <th>DATE</th>
                  <th style={{ textAlign: 'right' }}>TOTAL</th>
                  <th>STATUS</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => {
                  let status = '';
                  if (!order.isPaid && !order.isDelivered) status = 'Pending';
                  else if (order.isPaid && !order.isDelivered) status = 'Paid, Undelivered';
                  else if (!order.isPaid && order.isDelivered) status = 'Delivered, Unpaid';
                  else if (order.isPaid && order.isDelivered) status = 'Completed';
                  return (
                    <tr key={order._id}>
                      <td className="text-secondary">{order._id.substring(0, 10)}...</td>
                      <td className="fw-semibold">{order.user && order.user.name}</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td className="fw-semibold" style={{ textAlign: 'right' }}>${order.totalPrice}</td>
                      <td>
                        <span
                          className={`order-status-badge order-status-${status.replace(/[^a-z]/gi, '').toLowerCase()}`}
                          style={{
                            display: 'inline-block',
                            minWidth: 90,
                            padding: '0.45em 1.1em',
                            fontWeight: 500,
                            fontSize: '1em',
                            borderRadius: 16,
                            background:
                              status === 'Completed'
                                ? 'var(--bs-success-bg-subtle, #e6f4ea)'
                                : status === 'Pending'
                                ? 'var(--bs-warning-bg-subtle, #fff8e1)'
                                : status.includes('Unpaid')
                                ? 'var(--bs-danger-bg-subtle, #fbeaea)'
                                : 'var(--bs-info-bg-subtle, #e7f3fa)',
                            color:
                              status === 'Completed'
                                ? 'var(--bs-success-text, #217a3c)'
                                : status === 'Pending'
                                ? 'var(--bs-warning-text, #b8860b)'
                                : status.includes('Unpaid')
                                ? 'var(--bs-danger-text, #a94442)'
                                : 'var(--bs-info-text, #0c5460)',
                            border:
                              status === 'Completed'
                                ? '1px solid var(--bs-success-border-subtle, #b6e2c6)'
                                : status === 'Pending'
                                ? '1px solid var(--bs-warning-border-subtle, #ffe082)'
                                : status.includes('Unpaid')
                                ? '1px solid var(--bs-danger-border-subtle, #f5c6cb)'
                                : '1px solid var(--bs-info-border-subtle, #b8e2f2)',
                            boxShadow: 'none',
                            transition: 'background 0.2s, color 0.2s',
                          }}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="d-flex gap-2 flex-wrap">
                        <LinkContainer to={`/order/${order._id}`}>
                          <Button variant='primary' className='btn-sm px-3 fw-semibold admin-dashboard-btn'>
                            <FaEye className="me-1" /> Details
                          </Button>
                        </LinkContainer>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>{order.isPaid ? 'Mark Unpaid' : 'Mark Paid'}</Tooltip>}
                        >
                          <span>
                            <Button
                              variant={order.isPaid ? 'outline-secondary' : 'outline-success'}
                              className='btn-sm px-2 admin-dashboard-btn'
                              style={{ opacity: 0.7, fontWeight: 500, minWidth: 36 }}
                              disabled={loadingPay || (pendingOrderId === order._id && pendingAction)}
                              onClick={async () => {
                                if (order.isPaid) {
                                  if (window.confirm('Are you sure you want to mark this order as unpaid? This action cannot be undone.')) {
                                    await handleTogglePaid(order);
                                  }
                                } else {
                                  await handleTogglePaid(order);
                                }
                              }}
                            >
                              {order.isPaid ? <span style={{fontSize:'1.1em'}}>&#10006;</span> : <span style={{fontSize:'1.1em'}}>&#10003;</span>}
                            </Button>
                          </span>
                        </OverlayTrigger>
                        <OverlayTrigger
                          placement="top"
                          overlay={<Tooltip>{order.isDelivered ? 'Mark Undelivered' : 'Mark Delivered'}</Tooltip>}
                        >
                          <span>
                            <Button
                              variant={order.isDelivered ? 'outline-secondary' : 'outline-success'}
                              className='btn-sm px-2 admin-dashboard-btn'
                              style={{ opacity: 0.7, fontWeight: 500, minWidth: 36 }}
                              disabled={loadingDeliver || (pendingOrderId === order._id && pendingAction)}
                              onClick={async () => {
                                if (order.isDelivered) {
                                  if (window.confirm('Are you sure you want to mark this order as undelivered? This action cannot be undone.')) {
                                    await handleToggleDelivered(order);
                                  }
                                } else {
                                  await handleToggleDelivered(order);
                                }
                              }}
                            >
                              {order.isDelivered ? <span style={{fontSize:'1.1em'}}>&#8634;</span> : <span style={{fontSize:'1.1em'}}>&#8594;</span>}
                            </Button>
                          </span>
                        </OverlayTrigger>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </Table>
            {pages > 1 && (
              <div className="d-flex justify-content-center py-4">
                <Pagination>
                  <Pagination.Prev
                    onClick={() => setPageNumber(prev => Math.max(prev - 1, 1))}
                    disabled={pageNumber === 1}
                  />
                  {pageNumber > 1 && (
                    <Pagination.Item onClick={() => setPageNumber(pageNumber - 1)}>{pageNumber - 1}</Pagination.Item>
                  )}
                  <Pagination.Item active>{pageNumber}</Pagination.Item>
                  {pageNumber < pages && (
                    <Pagination.Item onClick={() => setPageNumber(pageNumber + 1)}>{pageNumber + 1}</Pagination.Item>
                  )}
                  <Pagination.Next
                    onClick={() => setPageNumber(prev => Math.min(prev + 1, pages))}
                    disabled={pageNumber === pages}
                  />
                </Pagination>
              </div>
            )}
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default AdminOrders;