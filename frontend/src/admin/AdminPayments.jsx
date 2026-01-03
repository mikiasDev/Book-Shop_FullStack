
import React, { useState, useMemo } from 'react';
import { Table, Badge, Card, Button, Pagination } from 'react-bootstrap';
import { useGetOrdersQuery } from '../redux/slices/ordersApiSlice';
import Loader from '../components/common/Loader';
import Message from '../components/common/Message';
import { FaMoneyBillWave, FaDownload } from 'react-icons/fa';
import ExportCSV from '../components/common/ExportCSV';



const AdminPayments = () => {
  const { data: orders, isLoading, error } = useGetOrdersQuery();

  // Filter only paid orders for the payments view
  const paidOrders = useMemo(() => orders ? orders.filter(order => order.isPaid) : [], [orders]);

  // Filtering states
  const [pageNumber, setPageNumber] = useState(1);
  const pageSize = 8;

  // Pagination logic
  const paginatedPayments = useMemo(() => {
    const start = (pageNumber - 1) * pageSize;
    return paidOrders.slice(start, start + pageSize);
  }, [paidOrders, pageNumber, pageSize]);

  const pages = Math.ceil(paidOrders.length / pageSize);



  // Pagination logic



  // Reset to page 1 when paidOrders changes
  React.useEffect(() => { setPageNumber(1); }, [paidOrders]);

  // Get unique payment methods for filter dropdown


  // Chart data: group filteredPayments by date


  let content;
  if (isLoading) content = <Loader />;
  else if (error) content = <Message variant='danger'>{error?.data?.message || error.error}</Message>;

  else {
    content = (
      <>
        {/* Main content start */}
        <div className="admin-page-content">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-4">
            <h2 className="admin-page-title mb-0"><FaMoneyBillWave className="me-2" /> Payment History</h2>
            <ExportCSV
              data={paidOrders.map(order => ({
                PaymentID: order.paymentResult?.id || order._id,
                User: order.user?.name || '',
                Date: order.paidAt ? new Date(order.paidAt).toISOString().substring(0, 10) : '',
                Amount: order.totalPrice,
                Method: order.paymentMethod,
                Status: 'Paid',
              }))}
              filename="payments.csv"
            >
              <Button variant="outline-primary" className="d-flex align-items-center gap-2"><FaDownload /> Export CSV</Button>
            </ExportCSV>
          </div>



          <Card className="border-0 shadow-sm admin-dashboard-table-wrapper">
            <Card.Body className="p-0">
              <Table hover responsive className="table-sm align-middle admin-table">
                <thead className="bg-light">
                  <tr>
                    <th className="border-0">Payment ID</th>
                    <th className="border-0">User</th>
                    <th className="border-0">Date</th>
                    <th className="border-0">Amount</th>
                    <th className="border-0">Method</th>
                    <th className="border-0">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedPayments.map((order) => (
                    <tr key={order._id}>
                      <td>{order.paymentResult?.id || order._id}</td>
                      <td>{order.user && order.user.name}</td>
                      <td>{order.paidAt ? new Date(order.paidAt).toISOString().substring(0, 10) : 'N/A'}</td>
                      <td>${order.totalPrice}</td>
                      <td>
                        <Badge bg="info" className="text-dark">{order.paymentMethod}</Badge>
                      </td>
                      <td>
                        <Badge bg="success">Paid</Badge>
                      </td>
                    </tr>
                  ))}
                  {paginatedPayments.length === 0 && (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        No payments found
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Pagination */}
          {pages > 1 && (
            <div className="d-flex justify-content-center mt-4">
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
        </div>
        {/* Main content end */}
      </>
    );
  }

  return content;
}

export default AdminPayments;