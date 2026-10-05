import React, { useState } from 'react';
import { Anime, AnimeLog } from '../types/anime';
import { StarRating } from './StarRating';
import { X, Eye, Heart, Clock, Plus, Bookmark, Film, Calendar, Building2, User, Share2, Check } from 'lucide-react';

interface AnimeDetailModalProps {
  anime: Anime | null;
  onClose: () => void;
  userLog?: AnimeLog | null;
  isInWatchlist: boolean;
  isLiked: boolean;
  onToggleWatchlist: (anime: Anime) => void;
  onToggleLike: (anime: Anime) => void;
  onOpenLogModal: (anime: Anime) => void;
  onOpenAddToListModal: (anime: Anime) => void;
}

export const AnimeDetailModal: React.FC<AnimeDetailModalProps> = ({
  anime,
  onClose,
  userLog,
  isInWatchlist,
  isLiked,
  onToggleWatchlist,
  onToggleLike,
  onOpenLogModal,
  onOpenAddToListModal
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  if (!anime) return null;

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Generate realistic Letterboxd-like rating distribution curve
  const ratingDistribution = [
    { star: '0.5', count: 12 },
    { star: '1.0', count: 28 },
    { star: '1.5', count: 45 },
    { star: '2.0', count: 95 },
    { star: '2.5', count: 180 },
    { star: '3.0', count: 420 },
    { star: '3.5', count: 890 },
    { star: '4.0', count: 1940 },
    { star: '4.5', count: 3200 },
    { star: '5.0', count: 4800 },
  ];
  const maxCount = Math.max(...ratingDistribution.map(d => d.count));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-[#14181c] rounded-xl border border-[#2c3440] shadow-2xl overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Backdrop Banner with Scrim Overlay */}
        <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-[#1b2228]">
          {anime.backdropUrl ? (
            <img
              src={anime.backdropUrl}
              alt=""
              className="w-full h-full object-cover object-center filter brightness-50"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-[#192026] via-[#242c34] to-[#14181c]" />
          )}

          {/* Measured gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] via-[#14181c]/70 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black text-[#9ab] hover:text-white transition-colors border border-white/10"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Quick share button */}
          <button
            onClick={handleShare}
            className="absolute top-4 right-16 p-2 rounded-full bg-black/60 hover:bg-black text-[#9ab] hover:text-white transition-colors border border-white/10"
            title="Copy share link"
          >
            {copied ? <Check className="w-5 h-5 text-[#00e054]" /> : <Share2 className="w-5 h-5" />}
          </button>
        </div>

        {/* Content Body */}
        <div className="relative px-6 pb-8 pt-0 -mt-24 sm:-mt-32">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Poster & Quick Action Card */}
            <div className="md:col-span-4 flex flex-col items-center sm:items-start space-y-4">
              <div className="w-48 sm:w-full aspect-[2/3] rounded-lg overflow-hidden bg-[#1f2328] border-2 border-[#2c3440] shadow-2xl">
                {anime.posterUrl ? (
                  <img
                    src={anime.posterUrl}
                    alt={anime.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                    <Film className="w-8 h-8 text-[#567] mb-2" />
                    <span className="text-xs text-[#89a]">{anime.title}</span>
                  </div>
                )}
              </div>

              {/* Letterboxd Action Card */}
              <div className="w-full rounded-lg bg-[#1b2228] border border-[#2c3440] p-3 space-y-3">
                <div className="grid grid-cols-3 divide-x divide-[#2c3440] text-center py-1">
                  {/* Watched Status */}
                  <div
                    onClick={() => onOpenLogModal(anime)}
                    className="flex flex-col items-center justify-center cursor-pointer group py-1"
                    title={userLog ? 'Logged in Diary' : 'Log as Watched'}
                  >
                    <Eye className={`w-5 h-5 transition-colors ${userLog ? 'text-[#00e054]' : 'text-[#678] group-hover:text-white'}`} />
                    <span className="text-[10px] font-mono mt-1 text-[#89a]">
                      {userLog ? 'Watched' : 'Log'}
                    </span>
                  </div>

                  {/* Liked Status */}
                  <div
                    onClick={() => onToggleLike(anime)}
                    className="flex flex-col items-center justify-center cursor-pointer group py-1"
                    title={isLiked ? 'Liked' : 'Like'}
                  >
                    <Heart className={`w-5 h-5 transition-colors ${isLiked ? 'text-[#ff4b60] fill-current' : 'text-[#678] group-hover:text-white'}`} />
                    <span className="text-[10px] font-mono mt-1 text-[#89a]">
                      {isLiked ? 'Liked' : 'Like'}
                    </span>
                  </div>

                  {/* Watchlist Status */}
                  <div
                    onClick={() => onToggleWatchlist(anime)}
                    className="flex flex-col items-center justify-center cursor-pointer group py-1"
                    title={isInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
                  >
                    <Clock className={`w-5 h-5 transition-colors ${isInWatchlist ? 'text-[#40bcf4]' : 'text-[#678] group-hover:text-white'}`} />
                    <span className="text-[10px] font-mono mt-1 text-[#89a]">
                      {isInWatchlist ? 'Watchlist' : 'Add'}
                    </span>
                  </div>
                </div>

                {/* Rating Bar */}
                <div className="pt-2 border-t border-[#2c3440] flex flex-col items-center justify-center">
                  <span className="text-[11px] font-mono text-[#89a] mb-1">
                    {userLog && userLog.rating > 0 ? `Your Rating: ${userLog.rating} ★` : 'Rate this anime'}
                  </span>
                  <StarRating
                    rating={userLog ? userLog.rating : 0}
                    onChange={(r) => {
                      // Trigger log modal with this rating
                      onOpenLogModal(anime);
                    }}
                    interactive
                    size="md"
                  />
                </div>

                {/* Primary Action Button */}
                <button
                  type="button"
                  onClick={() => onOpenLogModal(anime)}
                  className="w-full py-2 px-3 text-xs font-semibold rounded bg-[#00e054] text-[#14181c] hover:bg-[#00f25c] transition-colors flex items-center justify-center gap-1.5 shadow"
                >
                  <Plus className="w-4 h-4 stroke-[3]" />
                  <span>{userLog ? 'Edit Diary Entry' : 'Log or Review'}</span>
                </button>

                {/* Add to List */}
                <button
                  type="button"
                  onClick={() => onOpenAddToListModal(anime)}
                  className="w-full py-1.5 px-3 text-xs font-medium rounded bg-[#242c34] text-[#9ab] hover:text-white hover:bg-[#2c3440] transition-colors flex items-center justify-center gap-1.5"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Add to List...</span>
                </button>
              </div>

              {/* Quick Specs */}
              <div className="w-full text-xs space-y-1.5 text-[#89a] font-mono pt-2">
                <div className="flex justify-between border-b border-[#242c34] pb-1">
                  <span className="text-[#678]">Format</span>
                  <span className="text-white">{anime.format}</span>
                </div>
                <div className="flex justify-between border-b border-[#242c34] pb-1">
                  <span className="text-[#678]">Episodes</span>
                  <span className="text-white">{anime.episodes || '—'}</span>
                </div>
                <div className="flex justify-between border-b border-[#242c34] pb-1">
                  <span className="text-[#678]">Runtime</span>
                  <span className="text-white">{anime.duration || '24 min'}</span>
                </div>
                <div className="flex justify-between border-b border-[#242c34] pb-1">
                  <span className="text-[#678]">Status</span>
                  <span className="text-white">{anime.status}</span>
                </div>
              </div>
            </div>

            {/* Right Column: Title, Metadata, Synopsis, Rating histogram, Reviews */}
            <div className="md:col-span-8 space-y-6">
              
              {/* Title & Romaji */}
              <div>
                <div className="flex flex-wrap items-baseline gap-3">
                  <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    {anime.title}
                  </h1>
                  <span className="text-base text-[#678] font-mono">
                    ({anime.year})
                  </span>
                </div>

                {anime.romajiTitle && (
                  <p className="text-xs text-[#89a] mt-1 font-mono italic">
                    {anime.romajiTitle} {anime.japaneseTitle && `· ${anime.japaneseTitle}`}
                  </p>
                )}

                {/* Director / Studio line */}
                <div className="flex items-center gap-3 text-xs text-[#89a] mt-2">
                  {anime.director && (
                    <span className="flex items-center gap-1">
                      <User className="w-3.5 h-3.5 text-[#678]" />
                      <span>Directed by <strong className="text-[#c8d4e0] font-normal">{anime.director}</strong></span>
                    </span>
                  )}
                  {anime.director && <span>·</span>}
                  <span className="flex items-center gap-1">
                    <Building2 className="w-3.5 h-3.5 text-[#678]" />
                    <span>Studio <strong className="text-[#c8d4e0] font-normal">{anime.studio}</strong></span>
                  </span>
                </div>

                {/* Unboxed Genres list with typographic separators */}
                <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#678] mt-3">
                  {anime.genres.map((genre, idx) => (
                    <React.Fragment key={genre}>
                      <span className="text-[#9ab] hover:text-[#00e054] cursor-pointer transition-colors">
                        {genre}
                      </span>
                      {idx < anime.genres.length - 1 && <span aria-hidden="true">·</span>}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Rating Section: Average Score + Histogram */}
              <div className="p-4 rounded-lg bg-[#191d22] border border-[#2c3440] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="text-3xl font-bold text-white font-mono tabular-nums">
                    {anime.averageRating.toFixed(2)}
                  </div>
                  <div>
                    <div className="flex items-center gap-1 text-[#00e054]">
                      <StarRating rating={anime.averageRating} size="sm" />
                    </div>
                    <p className="text-[11px] text-[#678] font-mono mt-0.5">
                      {anime.ratingsCount.toLocaleString()} ratings on Otakuboxd
                    </p>
                  </div>
                </div>

                {/* Letterboxd-style Rating Histogram */}
                <div className="flex items-end gap-1 h-12 pt-2">
                  {ratingDistribution.map((d) => {
                    const heightPercent = Math.max(8, Math.round((d.count / maxCount) * 100));
                    return (
                      <div
                        key={d.star}
                        className="group relative flex flex-col items-center justify-end h-full"
                        title={`${d.star} Stars: ${d.count} ratings`}
                      >
                        <div
                          className="w-2.5 rounded-t-xs bg-[#445566] group-hover:bg-[#00e054] transition-colors"
                          style={{ height: `${heightPercent}%` }}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Synopsis */}
              <div>
                <h3 className="text-xs font-semibold text-[#89a] uppercase tracking-wider mb-2">
                  Synopsis
                </h3>
                <p className="text-sm text-[#c8d4e0] leading-relaxed">
                  {anime.synopsis}
                </p>
              </div>

              {/* User's Own Log Entry if available */}
              {userLog && (
                <div className="p-4 rounded-lg bg-[#191d22] border border-[#00e054]/30 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">Your Diary Entry</span>
                      <span className="text-[11px] text-[#678] font-mono">Watched {userLog.watchedDate}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <StarRating rating={userLog.rating} size="sm" showNumeric />
                      {userLog.isLiked && <Heart className="w-3.5 h-3.5 text-[#ff4b60] fill-current" />}
                    </div>
                  </div>

                  {userLog.reviewText && (
                    <p className="text-xs text-[#9ab] italic bg-[#14181c] p-3 rounded border border-[#2c3440] leading-relaxed">
                      "{userLog.reviewText}"
                    </p>
                  )}

                  {userLog.tags && userLog.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {userLog.tags.map(t => (
                        <span key={t} className="text-[10px] font-mono text-[#89a]">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Community Reviews Teaser */}
              <div className="pt-4 border-t border-[#242c34] space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-[#89a] uppercase tracking-wider">
                    Community Reviews
                  </h3>
                  <button
                    onClick={() => onOpenLogModal(anime)}
                    className="text-xs text-[#00e054] hover:underline"
                  >
                    + Write a review
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="p-3.5 rounded-lg bg-[#191d22] border border-[#2c3440]">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">sakuga_enthusiast</span>
                        <span className="text-[#678] font-mono">· 2 weeks ago</span>
                      </div>
                      <StarRating rating={4.5} size="sm" />
                    </div>
                    <p className="text-xs text-[#9ab] mt-2 leading-relaxed">
                      The emotional choreography in the climax is something that stays lodged in your chest. Essential viewing for anyone who loves the medium.
                    </p>
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
