import React from 'react';

const ExportCSV = ({ data, filename = 'export.csv', children }) => {
  const handleExport = () => {
    if (!data || !data.length) return;
    const keys = Object.keys(data[0]);
    const csvRows = [keys.join(',')];
    for (const row of data) {
      csvRows.push(keys.map(k => '"' + String(row[k]).replace(/"/g, '""') + '"').join(','));
    }
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };
  return (
    <span onClick={handleExport} style={{ cursor: 'pointer' }}>
      {children}
    </span>
  );
};

export default ExportCSV;
