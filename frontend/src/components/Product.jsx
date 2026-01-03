import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { addToCart } from '../redux/slices/cartSlice';
import Rating from './Rating';
import { FaCartPlus } from 'react-icons/fa';

const Product = ({ product }) => {
  const [hovered, setHovered] = useState(false);
  const [quickPreview, setQuickPreview] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!product._id) return;
    if (!userInfo) {
      navigate(`/login?redirect=/cart&addBook=${product._id}`);
      return;
    }
    // Dispatch addToCart with all required product data
    dispatch(addToCart({
      _id: product._id,
      name: product.name,
      title: product.title || product.name,
      price: product.price,
      image: product.image,
      qty: 1,
      countInStock: product.countInStock || 1,
      author: product.author || product.brand || '',
    }));
    // Only navigate after successful add-to-cart and authentication
    navigate('/cart');
  };
  const handleCardClick = () => {
    if (!product._id) return;
    setQuickPreview(true);
  };
  const closePreview = (e) => {
    e.stopPropagation();
    setQuickPreview(false);
  };
  const isTouch = typeof window !== 'undefined' && ('ontouchstart' in window || navigator.maxTouchPoints > 0);
  return (
    <Card
      className={`my-3 p-3 rounded h-100 border-0 shadow-sm product-card book-grid-item${!isTouch ? ' book-card-hoverable' : ''}`}
      tabIndex={0}
      style={{ background: 'var(--book-bg, #fff)', color: 'var(--book-secondary-color, #222)', cursor: 'pointer', outline: 'none', userSelect: 'none', position: 'relative', overflow: 'visible' }}
      role="button"
      aria-label={product._id ? `Quick preview ${product.name}` : `Book card: ${product.name}`}
      onClick={handleCardClick}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { handleCardClick(e); } }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      {/* Image Container with overlay for hover */}
      <div className="book-img-container" style={{ overflow: 'hidden', borderRadius: '10px', background: 'var(--book-img-bg, #f8f9fa)', position: 'relative' }}>
        <Card.Img 
          src={product.image} 
          variant="top" 
          loading="lazy"
          style={{ height: '250px', objectFit: 'cover', transition: 'transform 0.35s cubic-bezier(.4,0,.2,1)', transform: hovered ? 'scale(1.07)' : 'scale(1)' }} 
        />
        {/* Hover Overlay */}
        {!isTouch && (
          <div className={`book-hover-overlay${hovered ? ' show' : ''}`}>
            <button className="btn btn-accent add-to-cart-btn" onClick={handleAddToCart} tabIndex={0} aria-label="Add to Cart">
              <FaCartPlus style={{ marginRight: 6 }} /> Add to Cart
            </button>
            <button className="btn btn-outline-light quick-preview-btn" onClick={e => { e.stopPropagation(); setQuickPreview(true); }} tabIndex={0} aria-label="Quick Preview">
              Quick Preview
            </button>
          </div>
        )}
      </div>

      <Card.Body className="d-flex flex-column">
        <Card.Title as="div" className="product-title my-2" style={{ color: 'var(--book-secondary-color, #222)' }}>
          <strong>{product.name}</strong>
        </Card.Title>

        <Card.Text as="div" className="mb-3">
          <Rating 
            value={product.rating} 
            text={`${product.numReviews} reviews`} 
            colorVar="var(--book-rating-color, #ffd700)"
          />
        </Card.Text>

        {/* Price and Add Button at the bottom */}
        <div className="mt-auto d-flex justify-content-between align-items-center">
          <h3 className="card-price mb-0" style={{ color: 'var(--book-price, #0d6efd)' }}>${product.price}</h3>
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

      {/* Quick Preview Modal */}
      {quickPreview && (
        <div className="book-preview-modal" onClick={closePreview} tabIndex={-1}>
          <div className="book-preview-content" onClick={e => e.stopPropagation()}>
            <button className="close-preview-btn" onClick={closePreview} aria-label="Close Preview">&times;</button>
            <img src={product.image} alt={product.name} style={{ width: '120px', height: '180px', objectFit: 'cover', borderRadius: 8, marginBottom: 16 }} />
            <h4>{product.name}</h4>
            <p className="mb-2">by {product.author || 'Unknown Author'}</p>
            <p className="mb-2">{product.description?.slice(0, 120) || 'No description.'}...</p>
            <div className="mb-2"><Rating value={product.rating} text={`${product.numReviews} reviews`} colorVar="#ffd700" /></div>
            <h5 className="mb-3" style={{ color: '#0d6efd' }}>${product.price}</h5>
            <button className="btn btn-accent w-100" onClick={handleAddToCart} aria-label="Add to Cart">Add to Cart</button>
          </div>
        </div>
      )}

      <style>{`
        .book-img-container { position: relative; }
        .book-hover-overlay {
          position: absolute;
          top: 0; left: 0; width: 100%; height: 100%;
          background: linear-gradient(120deg, rgba(106,17,203,0.82) 0%, rgba(37,117,252,0.82) 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          opacity: 0;
          pointer-events: none;
          transition: opacity 0.28s cubic-bezier(.4,0,.2,1);
          z-index: 2;
        }
        .book-hover-overlay.show {
          opacity: 1;
          pointer-events: auto;
        }
        .add-to-cart-btn, .quick-preview-btn {
          margin: 6px 0;
          min-width: 120px;
          font-weight: 600;
          border-radius: 22px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.10);
        }
        .add-to-cart-btn {
          background: #ffb300;
          color: #222;
          border: none;
        }
        .add-to-cart-btn:hover, .add-to-cart-btn:focus {
          background: #ffd700;
          color: #181818;
        }
        .quick-preview-btn {
          background: transparent;
          color: #fff;
          border: 2px solid #fff;
        }
        .quick-preview-btn:hover, .quick-preview-btn:focus {
          background: #fff;
          color: #2575fc;
        }
        .book-preview-modal {
          position: fixed;
          top: 0; left: 0; width: 100vw; height: 100vh;
          background: rgba(0,0,0,0.45);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          animation: fadeInModal 0.25s cubic-bezier(.4,0,.2,1);
        }
        .book-preview-content {
          background: #fff;
          border-radius: 18px;
          padding: 32px 28px 24px 28px;
          box-shadow: 0 8px 32px rgba(76,0,224,0.12);
          min-width: 320px;
          max-width: 95vw;
          text-align: center;
          position: relative;
        }
        .close-preview-btn {
          position: absolute;
          top: 10px; right: 16px;
          background: none;
          border: none;
          font-size: 2rem;
          color: #888;
          cursor: pointer;
        }
        @keyframes fadeInModal {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </Card>
  );
};

export default Product;