import React from 'react';
import PropTypes from 'prop-types';

const Rating = ({ value, text, colorVar = '#ffd700' }) => {
  // value: number (0-5), text: string, colorVar: CSS color
  const stars = [1, 2, 3, 4, 5];
  return (
    <div className="rating" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
      {stars.map((star) => (
        <span key={star} style={{ color: colorVar, fontSize: 18 }}>
          {value >= star ? '★' : value >= star - 0.5 ? '☆' : '☆'}
        </span>
      ))}
      {text && <span style={{ marginLeft: 6, color: '#888', fontSize: 14 }}>{text}</span>}
    </div>
  );
};

Rating.propTypes = {
  value: PropTypes.number.isRequired,
  text: PropTypes.string,
  colorVar: PropTypes.string,
};

export default Rating;
