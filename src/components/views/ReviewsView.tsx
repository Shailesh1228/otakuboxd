import React, { useState } from 'react';
import { Anime, AnimeLog, UserProfile } from '../../types/anime';
import { StarRating } from '../StarRating';
import { Heart, MessageSquare, AlertCircle, Plus, Film } from 'lucide-react';
import { CURATED_ANIME } from '../../data/curatedAnime';

interface ReviewsViewProps {
  logs: AnimeLog[];
  profile: UserProfile;
  onOpenLogModal: (anime?: Anime, existingLog?: AnimeLog) => void;
  onSelectAnime: (anime: Anime) => void;
}

export const ReviewsView: React.FC<ReviewsViewProps> = ({
  logs,
  profile,
  onOpenLogModal,
  onSelectAnime
}) => {
  const [revealedSpoilers, setRevealedSpoilers] = useState<{ [id: string]: boolean }>({});
  const [filterMode, setFilterMode] = useState<'all' | 'spoilers_free'>('all');

  // Logs with text reviews
  const reviewLogs = logs.filter(l => l.reviewText && l.reviewText.trim().length > 0);

  const toggleSpoiler = (id: string) => {
    setRevealedSpoilers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const resolveAnime = (log: AnimeLog): Anime => {
    const found = CURATED_ANIME.find(a => String(a.id) === String(log.animeId));
    if (found) return found;
    return {
      id: log.animeId,
      title: log.animeTitle,
      format: log.animeFormat,
      year: log.animeYear,
      episodes: 1,
      studio: 'Studio',
      genres: [],
      synopsis: '',
      posterUrl: log.animePoster,
      averageRating: log.rating,
      ratingsCount: 1,
      status: 'Finished Airing'
    };
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242c34] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-display">
            Recent Reviews
          </h1>
          <p className="text-xs text-[#89a] mt-1 font-mono">
            Thoughts, critical dissections, and emotional reactions from otaku cinephiles.
          </p>
        </div>

        <button
          type="button"
          onClick={() => onOpenLogModal()}
          className="px-3.5 py-1.5 rounded-lg bg-[#00e054] text-[#14181c] font-semibold text-xs flex items-center gap-1.5 shadow self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 stroke-[3]" />
          <span>Write a Review</span>
        </button>
      </div>

      {/* Reviews Stream */}
      {reviewLogs.length > 0 ? (
        <div className="space-y-6">
          {reviewLogs.map((log) => {
            const anime = resolveAnime(log);
            const isSpoilerRevealed = revealedSpoilers[log.id];

            return (
              <article
                key={log.id}
                className="p-5 sm:p-6 rounded-xl bg-[#191d22] border border-[#2c3440] hover:border-[#384452] transition-colors"
              >
                <div className="flex flex-col sm:flex-row gap-5 items-start">
                  
                  {/* Poster Thumbnail */}
                  <div
                    onClick={() => onSelectAnime(anime)}
                    className="w-20 sm:w-24 aspect-[2/3] rounded bg-[#14181c] border border-[#2c3440] overflow-hidden shrink-0 cursor-pointer hover:border-[#00e054] transition-colors shadow"
                  >
                    {log.animePoster ? (
                      <img
                        src={log.animePoster}
                        alt={log.animeTitle}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Film className="w-6 h-6 m-auto text-[#678]" />
                    )}
                  </div>

                  {/* Review Content */}
                  <div className="flex-1 min-w-0 space-y-3">
                    
                    {/* Header: Title, Author, Date & Star Rating */}
                    <div>
                      <div className="flex flex-wrap items-baseline gap-2">
                        <h3
                          onClick={() => onSelectAnime(anime)}
                          className="text-base sm:text-lg font-bold text-white hover:text-[#00e054] transition-colors cursor-pointer"
                        >
                          {log.animeTitle}
                        </h3>
                        <span className="text-xs text-[#678] font-mono">
                          ({log.animeYear})
                        </span>
                      </div>

                      {/* Author row & rating */}
                      <div className="flex flex-wrap items-center gap-3 text-xs text-[#89a] mt-1.5">
                        <div className="flex items-center gap-2">
                          <img
                            src={profile.avatarUrl}
                            alt=""
                            className="w-5 h-5 rounded-full object-cover border border-[#2c3440]"
                          />
                          <span className="font-semibold text-white">{profile.displayName}</span>
                        </div>

                        <span aria-hidden="true" className="text-[#445566]">·</span>

                        <div className="flex items-center gap-1.5">
                          {log.rating > 0 && <StarRating rating={log.rating} size="sm" showNumeric />}
                          {log.isLiked && <Heart className="w-3.5 h-3.5 text-[#ff4b60] fill-current" />}
                        </div>

                        <span aria-hidden="true" className="text-[#445566]">·</span>

                        <span className="font-mono text-[#678]">
                          {new Date(log.watchedDate).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </span>
                      </div>
                    </div>

                    {/* Review Body */}
                    {log.containsSpoilers && !isSpoilerRevealed ? (
                      <div
                        onClick={() => toggleSpoiler(log.id)}
                        className="p-4 rounded-lg bg-[#14181c] border border-amber-900/30 text-xs text-[#ff8000] cursor-pointer hover:bg-[#1b2228] transition-colors flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <AlertCircle className="w-4 h-4" />
                          <span>This review contains spoilers for {log.animeTitle}. Click to reveal.</span>
                        </div>
                        <span className="text-[11px] underline">Show review</span>
                      </div>
                    ) : (
                      <div className="text-sm text-[#c8d4e0] leading-relaxed whitespace-pre-wrap font-sans">
                        {log.reviewText}
                      </div>
                    )}

                    {/* Tags */}
                    {log.tags && log.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {log.tags.map(t => (
                          <span
                            key={t}
                            className="text-[11px] font-mono text-[#89a] hover:text-white transition-colors"
                          >
                            #{t}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer interactions */}
                    <div className="flex items-center gap-4 text-xs text-[#678] font-mono pt-2 border-t border-[#242c34]">
                      <button
                        type="button"
                        onClick={() => onOpenLogModal(anime, log)}
                        className="text-[#89a] hover:text-[#00e054] transition-colors text-xs"
                      >
                        Edit review
                      </button>
                    </div>

                  </div>

                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl bg-[#1b2228] border border-[#2c3440] space-y-3">
          <MessageSquare className="w-8 h-8 text-[#678] mx-auto" />
          <h3 className="text-sm font-semibold text-white">No reviews published yet</h3>
          <p className="text-xs text-[#89a] max-w-sm mx-auto">
            Share your deep dives, hot takes, or brief impressions when you log an anime.
          </p>
        </div>
      )}

    </div>
  );
};
