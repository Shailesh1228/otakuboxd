import React, { useState, useEffect } from 'react';
import { Anime, AnimeLog } from '../types/anime';
import { StarRating } from './StarRating';
import { X, Heart, Repeat, Search, Film, Calendar, Tag, AlertCircle } from 'lucide-react';
import { CURATED_ANIME } from '../data/curatedAnime';
import { searchJikanAnime } from '../services/jikanApi';

interface LogModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialAnime?: Anime | null;
  existingLog?: AnimeLog | null;
  onSaveLog: (log: AnimeLog) => void;
  onDeleteLog?: (logId: string) => void;
}

export const LogModal: React.FC<LogModalProps> = ({
  isOpen,
  onClose,
  initialAnime,
  existingLog,
  onSaveLog,
  onDeleteLog
}) => {
  const [selectedAnime, setSelectedAnime] = useState<Anime | null>(initialAnime || null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Anime[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Form states
  const [watchedDate, setWatchedDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [rating, setRating] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isRewatch, setIsRewatch] = useState<boolean>(false);
  const [reviewText, setReviewText] = useState<string>('');
  const [containsSpoilers, setContainsSpoilers] = useState<boolean>(false);
  const [tagInput, setTagInput] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [progress, setProgress] = useState<string>('Completed');

  // Populate state on open or edit
  useEffect(() => {
    if (existingLog) {
      // Find full anime if available or synthesize
      const matched = CURATED_ANIME.find(a => String(a.id) === String(existingLog.animeId));
      setSelectedAnime(matched || {
        id: existingLog.animeId,
        title: existingLog.animeTitle,
        format: existingLog.animeFormat,
        year: existingLog.animeYear,
        episodes: 1,
        studio: 'Studio',
        genres: [],
        synopsis: '',
        posterUrl: existingLog.animePoster,
        averageRating: existingLog.rating || 4.5,
        ratingsCount: 100,
        status: 'Finished Airing'
      });
      setWatchedDate(existingLog.watchedDate);
      setRating(existingLog.rating);
      setIsLiked(existingLog.isLiked);
      setIsRewatch(existingLog.isRewatch);
      setReviewText(existingLog.reviewText);
      setContainsSpoilers(existingLog.containsSpoilers);
      setTags(existingLog.tags || []);
      setProgress(existingLog.progress || 'Completed');
    } else if (initialAnime) {
      setSelectedAnime(initialAnime);
      setWatchedDate(new Date().toISOString().split('T')[0]);
      setRating(0);
      setIsLiked(false);
      setIsRewatch(false);
      setReviewText('');
      setContainsSpoilers(false);
      setTags([]);
      setProgress(initialAnime.format === 'Movie' ? 'Film Completed' : `${initialAnime.episodes || 12}/${initialAnime.episodes || 12} Episodes`);
    } else {
      setSelectedAnime(null);
      setWatchedDate(new Date().toISOString().split('T')[0]);
      setRating(0);
      setIsLiked(false);
      setIsRewatch(false);
      setReviewText('');
      setContainsSpoilers(false);
      setTags([]);
      setProgress('Completed');
    }
  }, [isOpen, initialAnime, existingLog]);

  // Live search handler
  useEffect(() => {
    if (!searchQuery.trim() || selectedAnime) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      const results = await searchJikanAnime(searchQuery);
      setSearchResults(results.data.slice(0, 8));
      setIsSearching(false);
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedAnime]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim().toLowerCase().replace(/[^a-z0-9-_]/g, '');
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter(t => t !== tagToRemove));
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedAnime) return;

    const logToSave: AnimeLog = {
      id: existingLog ? existingLog.id : `log-${Date.now()}`,
      animeId: selectedAnime.id,
      animeTitle: selectedAnime.title,
      animePoster: selectedAnime.posterUrl,
      animeYear: selectedAnime.year,
      animeFormat: selectedAnime.format,
      watchedDate,
      rating,
      isLiked,
      isRewatch,
      reviewText: reviewText.trim(),
      containsSpoilers,
      tags,
      progress,
      createdAt: existingLog ? existingLog.createdAt : new Date().toISOString()
    };

    onSaveLog(logToSave);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-xl bg-[#1f2328] rounded-xl border border-[#2c3440] shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2c3440] bg-[#191d22]">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00e054] inline-block"></span>
            <h3 className="text-base font-semibold text-white tracking-wide">
              {existingLog ? 'Edit Diary Entry' : 'Log & Rate Anime'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded text-[#89a] hover:text-white hover:bg-[#2c3440] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSave} className="p-6 space-y-5">
          {/* Anime Selection / Display */}
          {!selectedAnime ? (
            <div className="space-y-2">
              <label className="block text-xs font-semibold text-[#89a] uppercase tracking-wider">
                Select Anime
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#678]" />
                <input
                  type="text"
                  placeholder="Search anime title (e.g. Spirited Away, Frieren, Akira)..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-[#14181c] border border-[#2c3440] rounded-lg text-sm text-white placeholder-[#567] focus:outline-none focus:border-[#00e054]"
                  autoFocus
                />
              </div>

              {/* Autocomplete dropdown */}
              {isSearching && (
                <div className="p-3 text-xs text-[#89a] font-mono text-center">Searching library & MAL...</div>
              )}

              {searchResults.length > 0 && (
                <div className="mt-2 max-h-56 overflow-y-auto rounded-lg border border-[#2c3440] bg-[#14181c] divide-y divide-[#242c34]">
                  {searchResults.map((anime) => (
                    <div
                      key={anime.id}
                      onClick={() => {
                        setSelectedAnime(anime);
                        setProgress(anime.format === 'Movie' ? 'Film Completed' : `${anime.episodes || 12}/${anime.episodes || 12} Episodes`);
                        setSearchQuery('');
                      }}
                      className="p-2.5 flex items-center gap-3 cursor-pointer hover:bg-[#242c34] transition-colors"
                    >
                      <div className="w-9 h-12 rounded bg-[#242c34] overflow-hidden shrink-0">
                        {anime.posterUrl ? (
                          <img src={anime.posterUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Film className="w-4 h-4 m-auto text-[#567]" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-semibold text-white truncate">{anime.title}</p>
                        <p className="text-[11px] text-[#678] font-mono">{anime.year} · {anime.format} · {anime.studio}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-4 p-3 rounded-lg bg-[#14181c] border border-[#2c3440]">
              <div className="w-14 h-20 rounded bg-[#242c34] overflow-hidden shrink-0 border border-[#2c3440]">
                {selectedAnime.posterUrl ? (
                  <img src={selectedAnime.posterUrl} alt="" className="w-full h-full object-cover" />
                ) : (
                  <Film className="w-6 h-6 m-auto text-[#567]" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="text-sm font-semibold text-white truncate">{selectedAnime.title}</h4>
                    <p className="text-xs text-[#89a] font-mono mt-0.5">
                      {selectedAnime.year} · {selectedAnime.format} · {selectedAnime.studio}
                    </p>
                  </div>
                  {!existingLog && (
                    <button
                      type="button"
                      onClick={() => setSelectedAnime(null)}
                      className="text-[11px] text-[#40bcf4] hover:underline shrink-0 ml-2"
                    >
                      Change
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-[#678]">Avg Rating:</span>
                  <span className="text-[11px] font-mono text-[#00e054] font-semibold">{selectedAnime.averageRating.toFixed(2)} ★</span>
                </div>
              </div>
            </div>
          )}

          {/* Date & Progress Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#89a] mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#678]" />
                Watched Date
              </label>
              <input
                type="date"
                value={watchedDate}
                onChange={(e) => setWatchedDate(e.target.value)}
                className="w-full px-3 py-2 bg-[#14181c] border border-[#2c3440] rounded-lg text-xs text-white focus:outline-none focus:border-[#00e054]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#89a] mb-1.5">
                Viewing Status / Episodes
              </label>
              <input
                type="text"
                placeholder="e.g. Completed, 12/12, Ep 1-4"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                className="w-full px-3 py-2 bg-[#14181c] border border-[#2c3440] rounded-lg text-xs text-white placeholder-[#567] focus:outline-none focus:border-[#00e054]"
              />
            </div>
          </div>

          {/* Rating, Like & Rewatch Letterboxd Bar */}
          <div className="p-4 rounded-lg bg-[#14181c] border border-[#2c3440] flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="text-xs font-semibold text-[#89a] mb-1.5">
                Rating
              </div>
              <StarRating
                rating={rating}
                onChange={(val) => setRating(val)}
                interactive
                size="lg"
                showNumeric
              />
            </div>

            <div className="flex items-center gap-3">
              {/* Like Toggle */}
              <button
                type="button"
                onClick={() => setIsLiked(!isLiked)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  isLiked
                    ? 'bg-[#ff4b60]/15 border-[#ff4b60] text-[#ff4b60]'
                    : 'bg-[#191d22] border-[#2c3440] text-[#89a] hover:text-white'
                }`}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                <span>Like</span>
              </button>

              {/* Rewatch Toggle */}
              <button
                type="button"
                onClick={() => setIsRewatch(!isRewatch)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium border transition-colors ${
                  isRewatch
                    ? 'bg-[#00e054]/15 border-[#00e054] text-[#00e054]'
                    : 'bg-[#191d22] border-[#2c3440] text-[#89a] hover:text-white'
                }`}
              >
                <Repeat className="w-4 h-4" />
                <span>Rewatch</span>
              </button>
            </div>
          </div>

          {/* Review Text Area */}
          <div>
            <label className="block text-xs font-semibold text-[#89a] mb-1.5">
              Review or Thoughts
            </label>
            <textarea
              rows={4}
              placeholder="Write your review or journal thoughts on this anime..."
              value={reviewText}
              onChange={(e) => setReviewText(e.target.value)}
              className="w-full px-3 py-2 bg-[#14181c] border border-[#2c3440] rounded-lg text-sm text-white placeholder-[#567] focus:outline-none focus:border-[#00e054] resize-y"
            />
          </div>

          {/* Spoilers Toggle */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="spoilerCheck"
              checked={containsSpoilers}
              onChange={(e) => setContainsSpoilers(e.target.checked)}
              className="w-4 h-4 rounded border-[#2c3440] bg-[#14181c] text-[#00e054] focus:ring-0 focus:ring-offset-0 cursor-pointer"
            />
            <label htmlFor="spoilerCheck" className="text-xs text-[#89a] cursor-pointer flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-[#ff8000]" />
              This review contains spoilers
            </label>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-[#89a] mb-1.5 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-[#678]" />
              Tags
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Add tag (e.g. masterpiece, tears, cinema)..."
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 bg-[#14181c] border border-[#2c3440] rounded-lg text-xs text-white placeholder-[#567] focus:outline-none focus:border-[#00e054]"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 text-xs font-medium bg-[#242c34] hover:bg-[#2c3440] text-white rounded-lg transition-colors"
              >
                Add
              </button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-mono bg-[#242c34] text-[#9ab] border border-[#343e4a]"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-white"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-[#2c3440]">
            {existingLog && onDeleteLog ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm('Delete this diary log?')) {
                    onDeleteLog(existingLog.id);
                    onClose();
                  }
                }}
                className="px-3 py-2 text-xs font-medium text-[#ff4b60] hover:bg-[#ff4b60]/10 rounded-lg transition-colors"
              >
                Delete Log
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-[#89a] hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!selectedAnime}
                className="px-5 py-2 text-xs font-semibold text-[#14181c] bg-[#00e054] hover:bg-[#00f25c] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg shadow-lg transition-all"
              >
                {existingLog ? 'Save Changes' : 'Log Anime'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
