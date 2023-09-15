import React, { useState } from 'react';

const StarRating = ({ maxStars, initialRating, onRate }) => {
  const [rating, setRating] = useState(initialRating);

  const handleClick = (starValue) => {
    setRating(starValue);
    onRate(starValue);
  };

  return (
    <div>
      {[...Array(maxStars).keys()].map((starValue) => (
        <span
          key={starValue}
          onClick={() => handleClick(starValue + 1)}
          style={{ cursor: 'pointer', color: starValue < rating ? 'gold' : 'gray' }}
        >
          ★
        </span>
      ))}
    </div>
  );
};

export default StarRating;
