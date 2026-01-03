import React from 'react';
import { Modal } from 'react-bootstrap';

const BookPreviewModal = ({ show, onHide, previewUrl }) => {
  if (!previewUrl) return null;
  const isPdf = previewUrl.toLowerCase().endsWith('.pdf');
  const isImage = /\.(jpg|jpeg|png)$/i.test(previewUrl);
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>Book Preview</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ minHeight: 400 }}>
        {isPdf ? (
          <iframe
            src={previewUrl}
            title="Book Preview"
            width="100%"
            height="500px"
            style={{ border: 'none' }}
          />
        ) : isImage ? (
          <img src={previewUrl} alt="Book Preview" style={{ maxWidth: '100%', maxHeight: 500, display: 'block', margin: '0 auto' }} />
        ) : (
          <div>Preview not available.</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default BookPreviewModal;
