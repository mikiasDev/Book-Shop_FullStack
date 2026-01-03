import React, { useRef, useState } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const BookPreviewUpload = ({ onUpload }) => {
  const fileInput = useRef();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleUpload = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    const file = fileInput.current.files[0];
    if (!file) {
      setError('Please select a preview file');
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    setUploading(true);
    try {
      const { data } = await axios.post('/api/upload/file', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setSuccess('Preview uploaded!');
      if (onUpload) onUpload(data.fileUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form onSubmit={handleUpload} className="mb-3">
      <Form.Group controlId="previewFile">
        <Form.Label>Upload Preview File (PDF/Image)</Form.Label>
        <Form.Control type="file" ref={fileInput} accept=".pdf,.jpg,.jpeg,.png" />
      </Form.Group>
      <Button type="submit" variant="secondary" className="mt-2" disabled={uploading}>
        {uploading ? <Spinner size="sm" /> : 'Upload Preview'}
      </Button>
      {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
      {success && <Alert variant="success" className="mt-2">{success}</Alert>}
    </Form>
  );
};

export default BookPreviewUpload;
