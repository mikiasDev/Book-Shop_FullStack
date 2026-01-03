import { FaCog, FaStore } from 'react-icons/fa';
import React, { useState } from 'react';
import { Card, Button, Row, Col, Modal, Form } from 'react-bootstrap';
import { FaDownload, FaUpload } from 'react-icons/fa';

const AdminSystem = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [showBackup, setShowBackup] = useState(false);
  const [showRestore, setShowRestore] = useState(false);
  const [settings, setSettings] = useState({ siteName: '', storeStatus: 'open' });
  const [backupStatus, setBackupStatus] = useState('');
  const [restoreStatus, setRestoreStatus] = useState('');

  // Simulate system settings save
  const handleSaveSettings = (e) => {
    e.preventDefault();
    setShowSettings(false);
    alert('Settings saved!');
  };

  // Simulate backup
  const handleBackup = () => {
    setBackupStatus('Backup completed successfully!');
    setShowBackup(false);
  };

  // Simulate restore
  const handleRestore = () => {
    setRestoreStatus('Restore completed successfully!');
    setShowRestore(false);
  };

  return (
    <Card className="border-0 shadow-sm rounded-3 p-4">
      <h4 className="mb-4">System Management</h4>
      <Row className="mb-4">
        <Col md={4} className="mb-3">
          <Button variant="primary" className="w-100" onClick={() => setShowSettings(true)}>
            <FaCog className="me-2" /> System Settings
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button variant="info" className="w-100" onClick={() => setShowBackup(true)}>
            <FaDownload className="me-2" /> Backup Data
          </Button>
        </Col>
        <Col md={4} className="mb-3">
          <Button variant="warning" className="w-100" onClick={() => setShowRestore(true)}>
            <FaUpload className="me-2" /> Restore Data
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={12} className="mb-3">
          <Button variant="success" className="w-100" href="/" target="_blank">
            <FaStore className="me-2" /> Visit Store
          </Button>
        </Col>
      </Row>

      {/* System Settings Modal */}
      <Modal show={showSettings} onHide={() => setShowSettings(false)}>
        <Modal.Header closeButton>
          <Modal.Title>System Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSaveSettings}>
            <Form.Group className='mb-3' controlId='siteName'>
              <Form.Label>Site Name</Form.Label>
              <Form.Control
                type='text'
                value={settings.siteName}
                onChange={e => setSettings({ ...settings, siteName: e.target.value })}
                placeholder='Enter site name'
              />
            </Form.Group>
            <Form.Group className='mb-3' controlId='storeStatus'>
              <Form.Label>Store Status</Form.Label>
              <Form.Select
                value={settings.storeStatus}
                onChange={e => setSettings({ ...settings, storeStatus: e.target.value })}
              >
                <option value='open'>Open</option>
                <option value='closed'>Closed</option>
              </Form.Select>
            </Form.Group>
            <Button type='submit' variant='primary'>Save Settings</Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Backup Modal */}
      <Modal show={showBackup} onHide={() => setShowBackup(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Backup Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Click below to backup all system data.</p>
          <Button variant='info' onClick={handleBackup}>Backup Now</Button>
          {backupStatus && <div className='mt-3 text-success'>{backupStatus}</div>}
        </Modal.Body>
      </Modal>

      {/* Restore Modal */}
      <Modal show={showRestore} onHide={() => setShowRestore(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Restore Data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Click below to restore system data from backup.</p>
          <Button variant='warning' onClick={handleRestore}>Restore Now</Button>
          {restoreStatus && <div className='mt-3 text-success'>{restoreStatus}</div>}
        </Modal.Body>
      </Modal>
    </Card>
  );
};

export default AdminSystem;
