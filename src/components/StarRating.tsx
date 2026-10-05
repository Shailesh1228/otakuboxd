import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface StarRatingProps {
  rating: number; // 0 to 5 (steps of 0.5)
  onChange?: (newRating: number) => void;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  showNumeric?: boolean;
}

export const StarRating: React.FC<StarRatingProps> = ({
  rating,
  onChange,
  size = 'md',
  interactive = false,
  showNumeric = false
}) => {
  const [hoverRating, setHoverRating] = useState<number | null>(null);

  const displayRating = hoverRating !== null ? hoverRating : rating;

  const starSizes = {
    sm: 'w-3.5 h-3.5',
    md: 'w-4 h-4',
    lg: 'w-6 h-6'
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (!interactive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const isLeftHalf = mouseX < rect.width / 2;
    const val = starIndex - (isLeftHalf ? 0.5 : 0);
    setHoverRating(val);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>, starIndex: number) => {
    if (!interactive || !onChange) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const isLeftHalf = mouseX < rect.width / 2;
    const val = starIndex - (isLeftHalf ? 0.5 : 0);
    // If clicking exact same rating, allow clearing to 0
    if (rating === val) {
      onChange(0);
    } else {
      onChange(val);
    }
  };

  return (
    <div
      className="inline-flex items-center gap-1.5"
      onMouseLeave={() => interactive && setHoverRating(null)}
    >
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((starIndex) => {
          const filled = displayRating >= starIndex;
          const halfFilled = !filled && displayRating >= starIndex - 0.5;

          return (
            <div
              key={starIndex}
              className={`relative cursor-pointer transition-transform ${
                interactive ? 'hover:scale-110' : 'cursor-default'
              }`}
              onMouseMove={(e) => handleMouseMove(e, starIndex)}
              onClick={(e) => handleClick(e, starIndex)}
              title={interactive ? `${starIndex - 0.5} or ${starIndex} stars` : `${rating} stars`}
            >
              {/* Background empty star */}
              <Star
                className={`${starSizes[size]} text-[#2c3440] transition-colors`}
                fill="#2c3440"
              />

              {/* Full or Half fill overlay */}
              {(filled || halfFilled) && (
                <div
                  className="absolute inset-0 overflow-hidden text-[#00e054] pointer-events-none"
                  style={{ width: filled ? '100%' : '50%' }}
                >
                  <Star
                    className={`${starSizes[size]} text-[#00e054]`}
                    fill="#00e054"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {showNumeric && (
        <span className="font-mono text-xs text-[#00e054] tabular-nums font-semibold ml-1">
          {displayRating > 0 ? displayRating.toFixed(1) : '—'}
        </span>
      )}
    </div>
  );
};
