import React from 'react';
import { Button } from 'react-bootstrap';

const BookDownloadButton = ({ bookId, fileUrl, isPaid }) => {
  const handleDownload = async () => {
    try {
      const response = await fetch(`/api/download/book/${bookId}`, {
        method: 'GET',
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error('You must purchase this book to download');
      }
      // Get filename from Content-Disposition or fallback
      const disposition = response.headers.get('Content-Disposition');
      let filename = 'book.pdf';
      if (fileUrl && fileUrl.endsWith('.pdf')) {
        filename = fileUrl;
      }
      if (disposition && disposition.indexOf('filename=') !== -1) {
        filename = disposition.split('filename=')[1].replace(/['"]/g, '');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <Button 
      variant="success" 
      size="sm" 
      className="rounded-pill px-3 fw-bold"
      onClick={handleDownload}
      disabled={!isPaid}
      title={isPaid ? 'Download Book' : 'Complete payment to download'}
    >
      Download
    </Button>
  );
};

export default BookDownloadButton;
