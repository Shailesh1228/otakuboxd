import React, { useState } from 'react';
import { Anime } from '../types/anime';
import { Star, Heart, Clock, Plus, Film } from 'lucide-react';

interface AnimeCardProps {
  anime: Anime;
  userRating?: number;
  isLiked?: boolean;
  isInWatchlist?: boolean;
  onSelect: (anime: Anime) => void;
  onQuickLog?: (anime: Anime) => void;
  onToggleWatchlist?: (anime: Anime) => void;
  onToggleLike?: (anime: Anime) => void;
  size?: 'compact' | 'standard' | 'large';
  showTitle?: boolean;
}

export const AnimeCard: React.FC<AnimeCardProps> = ({
  anime,
  userRating,
  isLiked = false,
  isInWatchlist = false,
  onSelect,
  onQuickLog,
  onToggleWatchlist,
  onToggleLike,
  size = 'standard',
  showTitle = true,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    compact: 'w-[100px] h-[145px]',
    standard: 'w-full aspect-[2/3]',
    large: 'w-full aspect-[2/3]'
  };

  return (
    <div className="group relative flex flex-col cursor-pointer select-none">
      {/* Poster Container */}
      <div
        className={`relative ${sizeClasses[size]} rounded-md overflow-hidden bg-[#1b2228] border border-[#2c3440] transition-all duration-200 group-hover:border-[#00e054] group-hover:shadow-[0_0_15px_rgba(0,224,84,0.2)]`}
        onClick={() => onSelect(anime)}
      >
        {!imgError && anime.posterUrl ? (
          <img
            src={anime.posterUrl}
            alt={anime.title}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* Zero-Broken-Image Fallback Container */
          <div className="w-full h-full p-3 flex flex-col justify-between items-center text-center bg-gradient-to-b from-[#242c34] to-[#14181c]">
            <Film className="w-8 h-8 text-[#445566] mt-4" />
            <div>
              <p className="text-xs font-semibold text-[#c8d4e0] line-clamp-3">
                {anime.title}
              </p>
              <p className="text-[10px] text-[#678] mt-1 font-mono">
                {anime.year} · {anime.format}
              </p>
            </div>
            <div className="w-full h-1" />
          </div>
        )}

        {/* Hover Quick Action Overlay */}
        <div className="absolute inset-0 bg-[#14181c]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-2.5 backdrop-blur-[2px]">
          {/* Top badges */}
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-mono font-medium text-[#c8d4e0] bg-[#14181c]/90 px-1.5 py-0.5 rounded border border-[#2c3440]">
              {anime.year}
            </span>
            {isLiked && (
              <span className="text-[#ff4b60]">
                <Heart className="w-4 h-4 fill-current" />
              </span>
            )}
          </div>

          {/* Quick interactive buttons */}
          <div className="flex items-center justify-center gap-2">
            {onToggleWatchlist && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleWatchlist(anime);
                }}
                className={`p-2 rounded-full transition-colors ${
                  isInWatchlist
                    ? 'bg-[#00e054] text-[#14181c]'
                    : 'bg-[#242c34] text-[#9ab] hover:text-white hover:bg-[#343e4a]'
                }`}
                title={isInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <Clock className="w-4 h-4" />
              </button>
            )}

            {onQuickLog && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickLog(anime);
                }}
                className="p-2 rounded-full bg-[#00e054] text-[#14181c] hover:bg-[#00f25c] transition-transform hover:scale-110 shadow-lg"
                title="Log / Rate Anime"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
              </button>
            )}

            {onToggleLike && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleLike(anime);
                }}
                className={`p-2 rounded-full transition-colors ${
                  isLiked
                    ? 'bg-[#ff4b60] text-white'
                    : 'bg-[#242c34] text-[#9ab] hover:text-white hover:bg-[#343e4a]'
                }`}
                title={isLiked ? 'Unlike' : 'Like'}
              >
                <Heart className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Bottom rating indicator in hover */}
          <div className="flex items-center justify-between text-[11px] font-mono">
            <span className="text-[#89a]">{anime.format}</span>
            <div className="flex items-center gap-1 text-[#00e054]">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="tabular-nums font-semibold">
                {userRating !== undefined && userRating > 0
                  ? userRating.toFixed(1)
                  : anime.averageRating.toFixed(1)}
              </span>
            </div>
          </div>
        </div>

        {/* Persistent bottom user badge if already rated */}
        {userRating !== undefined && userRating > 0 && (
          <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-[#14181c]/90 border border-[#00e054]/40 flex items-center gap-0.5 text-[10px] text-[#00e054] font-mono group-hover:opacity-0 transition-opacity">
            <Star className="w-3 h-3 fill-current" />
            <span className="tabular-nums font-bold">{userRating.toFixed(1)}</span>
          </div>
        )}
      </div>

      {/* Anime Title & Metadata (Below poster) */}
      {showTitle && (
        <div className="mt-2" onClick={() => onSelect(anime)}>
          <h4 className="text-xs font-medium text-[#c8d4e0] group-hover:text-white transition-colors truncate">
            {anime.title}
          </h4>
          <div className="flex items-center gap-1.5 text-[11px] text-[#678] mt-0.5 font-mono">
            <span>{anime.year}</span>
            <span>·</span>
            <span>{anime.format}</span>
            <span>·</span>
            <span className="flex items-center gap-0.5 text-[#89a]">
              <Star className="w-3 h-3 text-[#00e054] fill-current" />
              <span className="tabular-nums text-[#00e054]">{anime.averageRating.toFixed(1)}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
