import React, { useState, useMemo } from 'react';
import { Anime } from '../../types/anime';
import { AnimeCard } from '../AnimeCard';
import { CURATED_ANIME } from '../../data/curatedAnime';
import { getCachedAnime } from '../../services/jikanApi';
import { Clock, Plus, Trash2, ArrowUpDown } from 'lucide-react';

interface WatchlistViewProps {
  watchlistIds: (string | number)[];
  onSelectAnime: (anime: Anime) => void;
  onQuickLog: (anime: Anime) => void;
  onToggleWatchlist: (anime: Anime) => void;
  onToggleLike: (anime: Anime) => void;
  likedIds: (string | number)[];
}

export const WatchlistView: React.FC<WatchlistViewProps> = ({
  watchlistIds,
  onSelectAnime,
  onQuickLog,
  onToggleWatchlist,
  onToggleLike,
  likedIds
}) => {
  const [sortOption, setSortOption] = useState<'rating' | 'newest' | 'title'>('rating');

  const watchlistAnime = useMemo(() => {
    const list = watchlistIds.map(id => {
      return CURATED_ANIME.find(a => String(a.id) === String(id)) || getCachedAnime(id);
    }).filter(Boolean) as Anime[];

    return list.sort((a, b) => {
      if (sortOption === 'rating') return b.averageRating - a.averageRating;
      if (sortOption === 'newest') return b.year - a.year;
      if (sortOption === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [watchlistIds, sortOption]);

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242c34] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Watchlist
            </h1>
            <span className="text-xs font-mono text-[#00e054] bg-[#00e054]/10 px-2 py-0.5 rounded border border-[#00e054]/20 tabular-nums font-semibold">
              {watchlistAnime.length} titles
            </span>
          </div>
          <p className="text-xs text-[#89a] mt-1 font-mono">
            Anime films and series queued up for your next marathon session.
          </p>
        </div>

        {/* Sort controls */}
        {watchlistAnime.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-[#89a]">
            <ArrowUpDown className="w-3.5 h-3.5 text-[#678]" />
            <span>Sort by:</span>
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value as any)}
              className="bg-[#1b2228] border border-[#2c3440] rounded px-2.5 py-1 text-white text-xs focus:outline-none focus:border-[#00e054]"
            >
              <option value="rating">Highest Rated</option>
              <option value="newest">Release Year</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        )}
      </div>

      {/* Watchlist Grid */}
      {watchlistAnime.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {watchlistAnime.map((anime) => {
            const isLiked = likedIds.some(id => String(id) === String(anime.id));

            return (
              <AnimeCard
                key={anime.id}
                anime={anime}
                isInWatchlist={true}
                isLiked={isLiked}
                onSelect={onSelectAnime}
                onQuickLog={onQuickLog}
                onToggleWatchlist={onToggleWatchlist}
                onToggleLike={onToggleLike}
              />
            );
          })}
        </div>
      ) : (
        <div className="p-16 text-center rounded-xl bg-[#1b2228] border border-[#2c3440] space-y-3">
          <Clock className="w-10 h-10 text-[#678] mx-auto" />
          <h3 className="text-sm font-semibold text-white">Your watchlist is empty</h3>
          <p className="text-xs text-[#89a] max-w-sm mx-auto">
            Browse films and series and click the clock icon to queue titles you want to watch.
          </p>
        </div>
      )}

    </div>
  );
};
