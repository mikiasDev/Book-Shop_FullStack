import React, { useRef, useState } from 'react';
import { Button, Form, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const BookFileUpload = ({ onUpload }) => {
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
      setError('Please select a file');
      return;
    }
    const formData = new FormData();
    formData.append('bookFile', file);
    setUploading(true);
    try {
      const { data } = await axios.post('/api/upload/book', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      });
      setSuccess('File uploaded!');
      if (onUpload) onUpload(data.fileUrl);
    } catch (err) {
      setError(err.response?.data?.message || 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Form onSubmit={handleUpload} className="mb-3">
      <Form.Group controlId="bookFile">
        <Form.Label>Upload Book File (PDF/DOC)</Form.Label>
        <Form.Control type="file" ref={fileInput} accept=".pdf,.doc,.docx" />
      </Form.Group>
      <Button type="submit" variant="primary" className="mt-2" disabled={uploading}>
        {uploading ? <Spinner size="sm" /> : 'Upload'}
      </Button>
      {error && <Alert variant="danger" className="mt-2">{error}</Alert>}
      {success && <Alert variant="success" className="mt-2">{success}</Alert>}
    </Form>
  );
};

export default BookFileUpload;
