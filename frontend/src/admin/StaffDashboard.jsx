
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import StaffSidebar from './StaffSidebar';

import styles from './StaffKanban.module.css';

// Placeholder for future: import hooks for staff-specific data if available

const StaffDashboard = () => {


  // Kanban board state
  const initialOrders = [
    { id: 'o1', customer: 'Alice', total: 29.99, status: 'Pending', date: '2025-12-30' },
    { id: 'o2', customer: 'Bob', total: 15.49, status: 'Processing', date: '2025-12-29' },
    { id: 'o3', customer: 'Charlie', total: 42.00, status: 'Shipped', date: '2025-12-28' },
    { id: 'o4', customer: 'Diana', total: 8.99, status: 'Delivered', date: '2025-12-27' },
    { id: 'o5', customer: 'Eve', total: 19.99, status: 'Pending', date: '2025-12-26' },
    { id: 'o6', customer: 'Frank', total: 12.50, status: 'Processing', date: '2025-12-25' },
  ];
  const [orders, setOrders] = useState(initialOrders);
  const [draggedOrder, setDraggedOrder] = useState(null);
  const statuses = ['Pending', 'Processing', 'Shipped', 'Delivered'];
  const onDragStart = (order) => setDraggedOrder(order);
  const onDragEnd = () => setDraggedOrder(null);
  const onDrop = (status) => {
    if (draggedOrder) {
      setOrders((prev) => prev.map(o => o.id === draggedOrder.id ? { ...o, status } : o));
      setDraggedOrder(null);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', marginTop: 64 }}>
      <StaffSidebar />
      <main style={{ flex: 1, padding: '2.5rem 2rem 2rem 2rem', background: 'var(--book-bg, #f8f9fa)' }}>
        <h2 className="mb-4 fw-bold" style={{ color: '#1976d2' }}>Staff Dashboard</h2>
        {/* Kanban Board for Orders */}
        <div className={styles['kanban-board']}>
          {statuses.map((status) => (
            <div
              key={status}
              className={styles['kanban-column']}
              onDragOver={e => e.preventDefault()}
              onDrop={() => onDrop(status)}
            >
              <div className={styles['kanban-column-header']}>{status}</div>
              {orders.filter(o => o.status === status).map(order => (
                <div
                  key={order.id}
                  className={styles['kanban-card'] + (draggedOrder && draggedOrder.id === order.id ? ' ' + styles['dragging'] : '')}
                  draggable
                  onDragStart={() => onDragStart(order)}
                  onDragEnd={onDragEnd}
                >
                  <div className="order-id">Order #{order.id}</div>
                  <div className="order-customer">{order.customer}</div>
                  <div className="order-total">${order.total.toFixed(2)}</div>
                  <div className="order-date">{order.date}</div>
                  <div className="order-actions">
                    {status !== 'Delivered' && (
                      <Button size="sm" variant="outline-primary" onClick={() => setOrders(prev => prev.map(o => o.id === order.id ? { ...o, status: statuses[statuses.indexOf(status) + 1] } : o))}>Next</Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default StaffDashboard;
