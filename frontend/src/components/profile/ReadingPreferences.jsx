import React from 'react';
import { Form, Button, Badge } from 'react-bootstrap';

const ReadingPreferences = () => {
  const genres = ['Fiction', 'Sci-Fi', 'Romance', 'Mystery', 'Biography', 'History', 'Self-Help', 'Business'];
  
  return (
    <div>
      <h3 className="mb-4">Reading Preferences</h3>
      
      <div className="mb-4">
        <h5 className="mb-3">Favorite Genres</h5>
        <p className="text-muted small">Select the genres you love to get personalized recommendations.</p>
        <div className="d-flex flex-wrap gap-2">
          {genres.map((genre) => (
            <Button key={genre} variant="outline-primary" size="sm" className="rounded-pill">
              {genre}
            </Button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h5 className="mb-3">Reading Goals</h5>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Yearly Book Goal</Form.Label>
            <Form.Control type="number" placeholder="e.g. 20" style={{ maxWidth: '150px' }} />
          </Form.Group>
          <Form.Check 
            type="checkbox"
            label="Track my reading time"
            className="mb-2"
          />
          <Form.Check 
            type="checkbox"
            label="Share my progress with friends"
          />
        </Form>
      </div>

      <Button variant="primary">Save Preferences</Button>
    </div>
  );
};

export default ReadingPreferences;
