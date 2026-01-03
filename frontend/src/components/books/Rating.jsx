import React, { useState } from 'react';
import styles from './Rating.module.css';

const Rating = ({ value, text, colorVar = 'var(--book-rating-color, #ffd700)', interactive = false, onRate }) => {
  const [hovered, setHovered] = useState(null);
  const [selected, setSelected] = useState(null);

  // Use selected if set, otherwise value from props
  const displayValue = selected !== null ? selected : value;

  const handleMouseEnter = (idx) => {
    if (interactive) setHovered(idx);
  };
  const handleMouseLeave = () => {
    if (interactive) setHovered(null);
  };
  const handleClick = (idx) => {
    if (interactive) {
      setSelected(idx);
      if (onRate) onRate(idx);
    }
  };

  return (
    <div className={styles.rating} aria-label={`Rating: ${displayValue} out of 5${text ? ', ' + text : ''}`}> 
      {[1, 2, 3, 4, 5].map((index) => {
        let starType = 'empty';
        let fill = false;
        let isHalf = false;
        const current = hovered !== null ? hovered : displayValue;
        if (current >= index) {
          starType = 'filled';
          fill = true;
        } else if (current >= index - 0.5) {
          starType = 'half';
          isHalf = true;
        }
        return (
          <span
            key={index}
            className={
              styles.star +
              (interactive ? ' ' + styles.interactive : '') +
              (selected === index ? ' ' + styles.selected : '') +
              (fill ? ' ' + styles.filled : '') +
              (isHalf ? ' ' + styles.half : '') +
              (!fill && !isHalf ? ' ' + styles.empty : '')
            }
            style={{ color: colorVar }}
            tabIndex={interactive ? 0 : -1}
            role={interactive ? 'button' : undefined}
            aria-label={
              fill ? 'Full star' : isHalf ? 'Half star' : 'Empty star'
            }
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
            onKeyDown={e => {
              if (interactive && (e.key === 'Enter' || e.key === ' ')) handleClick(index);
            }}
          >
            <i
              className={
                fill
                  ? 'fas fa-star'
                  : isHalf
                  ? 'fas fa-star-half-alt'
                  : 'far fa-star'
              }
            ></i>
          </span>
        );
      })}
      <span className="ms-2">{text && text}</span>
    </div>
  );
};

export default Rating;