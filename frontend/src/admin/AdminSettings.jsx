import React, { useState } from 'react';
import { Card, Form, Button, Row, Col, Alert } from 'react-bootstrap';
import { useSelector } from 'react-redux';
// You can wire these up to your API as needed
// import { useProfileMutation } from '../redux/slices/usersApiSlice';

const AdminSettings = () => {
	const { userInfo } = useSelector((state) => state.auth);
	const [name, setName] = useState(userInfo?.name || '');
	const [email, setEmail] = useState(userInfo?.email || '');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [message, setMessage] = useState(null);

	// Placeholder for update handler
	const handleUpdate = (e) => {
		e.preventDefault();
		if (password && password !== confirmPassword) {
			setMessage('Passwords do not match');
			return;
		}
		setMessage('Profile updated (demo only)');
		// Call API here
	};

	return (
		<Row className="justify-content-center mt-4">
			<Col md={7} lg={6}>
				<Card className="shadow-sm p-4">
					<Card.Title className="mb-3">Account Settings</Card.Title>
					{message && <Alert variant={message.includes('not match') ? 'danger' : 'success'}>{message}</Alert>}
					<Form onSubmit={handleUpdate}>
						<Form.Group className="mb-3" controlId="name">
							<Form.Label>Name</Form.Label>
							<Form.Control type="text" value={name} onChange={e => setName(e.target.value)} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="email">
							<Form.Label>Email</Form.Label>
							<Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} />
						</Form.Group>
						<Form.Group className="mb-3" controlId="password">
							<Form.Label>New Password</Form.Label>
							<Form.Control type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Leave blank to keep current" />
						</Form.Group>
						<Form.Group className="mb-3" controlId="confirmPassword">
							<Form.Label>Confirm New Password</Form.Label>
							<Form.Control type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="Leave blank to keep current" />
						</Form.Group>
						<Button type="submit" variant="primary" className="w-100">Update Settings</Button>
					</Form>
				</Card>
			</Col>
		</Row>
	);
};

export default AdminSettings;