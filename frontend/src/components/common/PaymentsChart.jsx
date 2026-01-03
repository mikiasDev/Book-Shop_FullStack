import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend } from 'recharts';

export default function PaymentsChart({ data }) {
  // data: [{ date: '2025-12-01', total: 120 }, ...]
  return (
    <div style={{ width: '100%', height: 320 }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 16, right: 24, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" fontSize={13} />
          <YAxis fontSize={13} />
          <Tooltip />
          <Legend />
          <Bar dataKey="total" fill="#2a5298" name="Total Paid" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
