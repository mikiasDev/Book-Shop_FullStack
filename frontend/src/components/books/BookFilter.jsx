import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';

const BookFilter = ({ onSearch, categories = [] }) => {
  const [keyword, setKeyword] = useState('');
  const [author, setAuthor] = useState('');
  const [category, setCategory] = useState('');
  const [language, setLanguage] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const submitHandler = (e) => {
    e.preventDefault();
    const filters = {};
    if (keyword) filters.keyword = keyword;
    if (author) filters.author = author;
    if (category) filters.category = category;
    if (language) filters.language = language;
    if (minPrice) filters.minPrice = minPrice;
    if (maxPrice) filters.maxPrice = maxPrice;
    onSearch(filters);
  };

  const resetHandler = () => {
    setKeyword('');
    setAuthor('');
    setCategory('');
    setLanguage('');
    setMinPrice('');
    setMaxPrice('');
    onSearch({});
  };

  return (
    <Form onSubmit={submitHandler} className="admin-form-section mb-3 p-3 bg-light rounded-4 shadow-sm" role="form" aria-label="Book filter form">
      <Row className="g-2 align-items-end">
        <Col xs={12} md={3}>
          <Form.Group>
            <Form.Label>Keyword</Form.Label>
            <Form.Control
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Search books..."
              aria-label="Keyword"
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={2}>
          <Form.Group>
            <Form.Label>Author</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author name"
            />
          </Form.Group>
        </Col>
        <Col xs={12} md={2}>
          <Form.Group>
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="">All</option>
              {categories.map((cat) => (
                <option key={cat._id || cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col xs={12} md={2}>
          <Form.Group>
            <Form.Label>Language</Form.Label>
            <Form.Control
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              placeholder="Language"
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={1}>
          <Form.Group>
            <Form.Label>Min Price</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="Min"
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={1}>
          <Form.Group>
            <Form.Label>Max Price</Form.Label>
            <Form.Control
              type="number"
              min="0"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="Max"
            />
          </Form.Group>
        </Col>
        <Col xs={6} md={1} className="d-grid">
          <Button type="submit" variant="primary" className="fw-bold mb-2">
            Filter
          </Button>
        </Col>
        <Col xs={6} md={1} className="d-grid">
          <Button type="button" variant="outline-secondary" className="fw-bold mb-2" onClick={resetHandler}>
            Reset
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default BookFilter;