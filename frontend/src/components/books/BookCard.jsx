import React from 'react';
import { Card, Badge } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../../redux/slices/cartSlice';
import Rating from './Rating';
import { FaCartPlus } from 'react-icons/fa';

const BookCard = ({ book }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);

  // Add to Cart handler
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!book._id) return;
    if (!userInfo) {
      navigate(`/login?redirect=/cart&addBook=${book._id}`);
      return;
    }
    // Dispatch addToCart with all required book data
    dispatch(addToCart({
      _id: book._id,
      name: book.name,
      title: book.title || book.name,
      price: book.price,
      image: book.image,
      qty: 1,
      countInStock: book.countInStock || 1,
      author: book.author || book.brand || '',
    }));
    // Only navigate after successful add-to-cart and authentication
    navigate('/cart');
  };

  // Card click for preview/navigation
  const handleCardClick = (e) => {
    if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON') return;

  };
  // Detect touch device for hover disabling
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  return (
    <Card
      className={`my-3 p-3 rounded h-100 shadow-sm book-card border-0 book-grid-item${!isTouch ? ' book-card-hoverable' : ''}`}
      tabIndex={0}
      role="button"
      aria-label={book._id ? `Add ${book.name} to cart` : `Book card: ${book.name}`}
      onClick={handleCardClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { handleCardClick(e); } }}
      style={{ cursor: 'pointer', outline: 'none', userSelect: 'none' }}
    >
      <div className="image-container" style={{ height: '280px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: 'var(--book-img-bg, #f8f9fa)', borderRadius: '8px' }}>
        <Card.Img 
          src={book.image} 
          alt={book.name ? `Cover of ${book.name}` : 'Book cover'}
          variant='top' 
          loading="lazy"
          style={{ maxHeight: '90%', maxWidth: '90%', width: 'auto', objectFit: 'contain' }} 
        />
      </div>
      <Card.Body className="d-flex flex-column px-0 pb-0">
        <div className="d-flex justify-content-between align-items-start mb-2">
          <Badge bg="light" text="dark" className="border text-uppercase" style={{ fontSize: '0.7rem' }} aria-label={`Category: ${book.category}`}> 
            {book.category}
          </Badge>
          {book.countInStock === 0 ? (
            <Badge bg="danger" aria-label="Sold Out">Sold Out</Badge>
          ) : (
             <Badge bg="success" className="opacity-75" aria-label="In Stock">In Stock</Badge>
          )}
        </div>
        <Card.Title as='h5' className="mb-1 text-truncate" title={book.name}>
          <strong>{book.name}</strong>
        </Card.Title>
        <Card.Text as='div' className="text-muted mb-2 small" aria-label={`Author: ${book.brand}`}> 
          by {book.brand}
        </Card.Text>
        <Card.Text as='div' className="mb-3" aria-label={`Rating: ${book.rating} out of 5, ${book.numReviews} reviews`}>
          <Rating value={book.rating} text={` (${book.numReviews})`} />
        </Card.Text>
        <div className="mt-auto d-flex align-items-center justify-content-between border-top pt-3">
          <Card.Text as='h4' className="mb-0 text-primary fw-bold" aria-label={`Price: $${book.price}`}> 
            ${book.price}
          </Card.Text>
          <span
            title="Add to Cart"
            aria-label="Add to Cart"
            style={{ color: 'var(--accent-color, #4a00e0)', fontSize: 22, marginLeft: 8, opacity: 0.85, cursor: 'pointer' }}
            onClick={handleAddToCart}
          >
            <FaCartPlus />
          </span>
        </div>
      </Card.Body>
      <style>{`
        .book-grid-item {
          transition: box-shadow 0.25s cubic-bezier(.4,0,.2,1), transform 0.25s cubic-bezier(.4,0,.2,1);
        }
        .book-card-hoverable:hover,
        .book-card-hoverable:focus {
          box-shadow: 0 10px 32px 0 rgba(40,40,80,0.18), 0 2px 8px 0 rgba(40,40,80,0.10);
          transform: scale(1.03);
        }
        @media (prefers-color-scheme: dark) {
          .book-card-hoverable:hover,
          .book-card-hoverable:focus {
            box-shadow: 0 10px 32px 0 rgba(80,80,120,0.22), 0 2px 8px 0 rgba(80,80,120,0.13);
          }
        }
        .book-grid-item:active {
          transform: scale(0.98);
        }
      `}</style>
    </Card>
  );
};

export default BookCard;