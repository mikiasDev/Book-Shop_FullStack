import React from 'react';

function convertToCSV(arr) {
  const array = [Object.keys(arr[0])].concat(arr);
  return array.map(row => Object.values(row).map(String).map(v => '"' + v.replace(/"/g, '""') + '"').join(',')).join('\n');
}

export default function ExportCSV({ data, filename = 'export.csv', headers = null, children }) {
  const handleExport = () => {
    if (!data || !data.length) return;
    let exportData = data;
    if (headers) {
      exportData = data.map(row => {
        const filtered = {};
        headers.forEach(h => { filtered[h] = row[h]; });
        return filtered;
      });
    }
    const csv = convertToCSV(exportData);
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };
  return (
    <span onClick={handleExport} style={{ cursor: 'pointer' }}>
      {children || 'Export CSV'}
    </span>
  );
}
