import React, { useState, useEffect } from 'react';
import { Anime } from '../types/anime';
import { Search, X, Star, Film, Loader2 } from 'lucide-react';
import { CURATED_ANIME } from '../data/curatedAnime';
import { searchJikanAnime } from '../services/jikanApi';

interface QuickSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAnime: (anime: Anime) => void;
  onLogAnime: (anime: Anime) => void;
}

export const QuickSearchModal: React.FC<QuickSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectAnime,
  onLogAnime
}) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Anime[]>(CURATED_ANIME.slice(0, 8));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults(CURATED_ANIME.slice(0, 8));
      return;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults(CURATED_ANIME.slice(0, 8));
      setLoading(false);
      return;
    }

    setLoading(true);
    const handler = setTimeout(async () => {
      const res = await searchJikanAnime(query);
      setResults(res.data.slice(0, 15));
      setLoading(false);
    }, 250);

    return () => clearTimeout(handler);
  }, [query]);

  // Global keydown escape listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl bg-[#1f2328] rounded-xl border border-[#2c3440] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-[#2c3440] bg-[#191d22]">
          <Search className="w-5 h-5 text-[#678] mr-3 shrink-0" />
          <input
            type="text"
            placeholder="Search anime by English title, Romaji, or Japanese..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent text-sm sm:text-base text-white placeholder-[#567] focus:outline-none"
            autoFocus
          />
          {loading && <Loader2 className="w-4 h-4 text-[#00e054] animate-spin mr-2 shrink-0" />}
          <button
            onClick={onClose}
            className="p-1 rounded text-[#89a] hover:text-white hover:bg-[#2c3440] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto divide-y divide-[#242c34]">
          {results.length > 0 ? (
            results.map((anime) => (
              <div
                key={anime.id}
                className="group p-3 flex items-center justify-between hover:bg-[#242c34] transition-colors cursor-pointer"
                onClick={() => {
                  onSelectAnime(anime);
                  onClose();
                }}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="w-10 h-14 rounded bg-[#14181c] overflow-hidden shrink-0 border border-[#2c3440]">
                    {anime.posterUrl ? (
                      <img src={anime.posterUrl} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Film className="w-4 h-4 m-auto text-[#567]" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-medium text-white truncate group-hover:text-[#00e054] transition-colors">
                      {anime.title}
                    </h4>
                    <p className="text-[11px] text-[#678] font-mono mt-0.5">
                      {anime.year} · {anime.format} · {anime.studio}
                    </p>
                    <div className="flex items-center gap-1.5 text-[11px] text-[#00e054] font-mono mt-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span className="tabular-nums font-semibold">{anime.averageRating.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 pl-3 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onLogAnime(anime);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded bg-[#00e054]/15 hover:bg-[#00e054] text-[#00e054] hover:text-[#14181c] text-xs font-semibold font-mono transition-colors"
                  >
                    + Log
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-[#89a] text-xs">
              No anime found matching "{query}". Try a different spelling or keyword.
            </div>
          )}
        </div>

        {/* Quick Footer info */}
        <div className="px-4 py-2 bg-[#14181c] border-t border-[#2c3440] flex items-center justify-between text-[11px] text-[#678] font-mono">
          <span>Search curated database & live MyAnimeList index</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
