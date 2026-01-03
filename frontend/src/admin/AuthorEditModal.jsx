import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const AuthorEditModal = ({ show, onHide, author, onSave }) => {
	const [name, setName] = useState(author ? author.name : '');

	useEffect(() => {
		setName(author ? author.name : '');
	}, [author]);

	const handleSave = () => {
		if (name.trim() && author) {
			onSave({ ...author, name: name.trim() });
		}
	};

	return (
		<Modal show={show} onHide={onHide} centered>
			<Modal.Header closeButton>
				<Modal.Title>Edit Author</Modal.Title>
			</Modal.Header>
			<Modal.Body>
				<Form>
					<Form.Group controlId="authorName">
						<Form.Label>Author Name</Form.Label>
						<Form.Control
							type="text"
							value={name}
							onChange={e => setName(e.target.value)}
							autoFocus
						/>
					</Form.Group>
				</Form>
			</Modal.Body>
			<Modal.Footer>
				<Button variant="secondary" onClick={onHide}>
					Cancel
				</Button>
				<Button variant="primary" onClick={handleSave} disabled={!name.trim()}>
					Save
				</Button>
			</Modal.Footer>
		</Modal>
	);
};

export default AuthorEditModal;
