import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Anime, AnimeLog } from '../../types/anime';
import { AnimeCard } from '../AnimeCard';
import { CURATED_ANIME, GENRE_OPTIONS, FORMAT_OPTIONS, SORT_OPTIONS } from '../../data/curatedAnime';
import { fetchTopAnime, fetchSeasonalAnime, searchJikanAnime } from '../../services/jikanApi';
import { StarRating } from '../StarRating';
import {
  Plus,
  Clock,
  Heart,
  Sparkles,
  TrendingUp,
  Award,
  Film,
  Search,
  Loader2,
  Globe2,
  Flame,
  Tv
} from 'lucide-react';
import heroSky from '../../assets/images/hero_cinematic_anime_sky_1791173367541.jpg';

interface ExploreViewProps {
  onSelectAnime: (anime: Anime) => void;
  onQuickLog: (anime: Anime) => void;
  onToggleWatchlist: (anime: Anime) => void;
  onToggleLike: (anime: Anime) => void;
  watchlistIds: (string | number)[];
  likedIds: (string | number)[];
  userLogs: AnimeLog[];
  onNavigateToActivity?: () => void;
}

type CatalogSource = 'curated' | 'top_all' | 'seasonal' | 'search';

export const ExploreView: React.FC<ExploreViewProps> = ({
  onSelectAnime,
  onQuickLog,
  onToggleWatchlist,
  onToggleLike,
  watchlistIds,
  likedIds,
  userLogs,
  onNavigateToActivity
}) => {
  const [catalogSource, setCatalogSource] = useState<CatalogSource>('curated');
  const [selectedGenre, setSelectedGenre] = useState('All Genres');
  const [selectedFormat, setSelectedFormat] = useState<string>('All Formats');
  const [selectedSort, setSelectedSort] = useState('popular');
  const [searchQuery, setSearchQuery] = useState('');

  // Live anime items from Jikan API or curated
  const [liveAnimeList, setLiveAnimeList] = useState<Anime[]>(CURATED_ANIME);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);

  // Map user logs for quick rating lookup
  const userRatingsMap = useMemo(() => {
    const map = new Map<string, number>();
    userLogs.forEach(log => {
      map.set(String(log.animeId), log.rating);
    });
    return map;
  }, [userLogs]);

  // Featured Spotlight Hero
  const featuredAnime = CURATED_ANIME[7] || CURATED_ANIME[0]; // Frieren
  const isHeroInWatchlist = watchlistIds.some(id => String(id) === String(featuredAnime.id));
  const isHeroLiked = likedIds.some(id => String(id) === String(featuredAnime.id));

  // Fetch initial data based on catalogSource or searchQuery
  const loadData = useCallback(async (source: CatalogSource, query: string, page: number = 1, append: boolean = false) => {
    if (page === 1) setIsLoading(true);
    else setIsLoadingMore(true);

    try {
      if (query.trim()) {
        const res = await searchJikanAnime(query.trim(), page, selectedFormat !== 'All Formats' ? selectedFormat : undefined);
        setLiveAnimeList(prev => (append ? [...prev, ...res.data] : res.data));
        setHasNextPage(res.hasNextPage);
      } else if (source === 'top_all') {
        const res = await fetchTopAnime(page);
        setLiveAnimeList(prev => (append ? [...prev, ...res.data] : res.data));
        setHasNextPage(res.hasNextPage);
      } else if (source === 'seasonal') {
        const res = await fetchSeasonalAnime(page);
        setLiveAnimeList(prev => (append ? [...prev, ...res.data] : res.data));
        setHasNextPage(res.hasNextPage);
      } else {
        // Curated Library (offline instant speed)
        setLiveAnimeList(CURATED_ANIME);
        setHasNextPage(false);
      }
    } catch (err) {
      console.error('Error loading anime catalog', err);
      if (!append) setLiveAnimeList(CURATED_ANIME);
    } finally {
      setIsLoading(false);
      setIsLoadingMore(false);
    }
  }, [selectedFormat]);

  // Trigger load when catalogSource or search input changes
  useEffect(() => {
    setCurrentPage(1);

    if (searchQuery.trim()) {
      const timer = setTimeout(() => {
        loadData('search', searchQuery, 1, false);
      }, 350);
      return () => clearTimeout(timer);
    } else {
      loadData(catalogSource, '', 1, false);
    }
  }, [catalogSource, searchQuery, loadData]);

  // Handle Load More pagination
  const handleLoadMore = () => {
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadData(catalogSource, searchQuery, nextPage, true);
  };

  // Filter & sort the currently loaded list
  const filteredAnimeList = useMemo(() => {
    return liveAnimeList.filter(anime => {
      // Genre filter
      if (selectedGenre !== 'All Genres' && !anime.genres.some(g => g.toLowerCase() === selectedGenre.toLowerCase())) {
        return false;
      }
      // Format filter
      if (selectedFormat !== 'All Formats' && anime.format !== selectedFormat) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (selectedSort === 'popular') return b.ratingsCount - a.ratingsCount;
      if (selectedSort === 'rating') return b.averageRating - a.averageRating;
      if (selectedSort === 'newest') return b.year - a.year;
      if (selectedSort === 'oldest') return a.year - b.year;
      if (selectedSort === 'title') return a.title.localeCompare(b.title);
      return 0;
    });
  }, [liveAnimeList, selectedGenre, selectedFormat, selectedSort]);

  return (
    <div className="space-y-10 pb-16">
      
      {/* Cinematic Hero Spotlight */}
      <section className="relative rounded-2xl overflow-hidden border border-[#2c3440] bg-[#14181c] shadow-2xl">
        <div className="relative h-[320px] sm:h-[400px] w-full overflow-hidden">
          <img
            src={heroSky}
            alt="Hero backdrop"
            className="w-full h-full object-cover object-center filter brightness-60"
          />
          {/* Measured gradient scrim */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#14181c] via-[#14181c]/75 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#14181c] via-[#14181c]/60 to-transparent" />
        </div>

        {/* Hero Content Overlay */}
        <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end">
          <div className="max-w-2xl space-y-3">
            
            <div className="flex items-center gap-2 text-xs font-mono text-[#00e054]">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Otakuboxd Spotlight</span>
              <span aria-hidden="true" className="text-[#678]">·</span>
              <span className="text-[#89a]">#1 Highest Rated All-Time</span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-white font-display">
              {featuredAnime.title}
            </h1>

            <div className="flex flex-wrap items-center gap-2 text-xs text-[#89a] font-mono">
              <span className="text-white font-semibold">{featuredAnime.year}</span>
              <span aria-hidden="true">·</span>
              <span>{featuredAnime.format}</span>
              <span aria-hidden="true">·</span>
              <span>{featuredAnime.studio}</span>
              <span aria-hidden="true">·</span>
              <div className="flex items-center gap-1 text-[#00e054]">
                <StarRating rating={featuredAnime.averageRating} size="sm" />
                <span className="font-bold tabular-nums ml-1">{featuredAnime.averageRating.toFixed(2)}</span>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-[#c8d4e0] line-clamp-3 leading-relaxed max-w-xl">
              {featuredAnime.synopsis}
            </p>

            {/* Hero CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-3">
              <button
                type="button"
                onClick={() => onQuickLog(featuredAnime)}
                className="px-5 py-2.5 rounded-lg bg-[#00e054] hover:bg-[#00f25c] text-[#14181c] font-semibold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Log or Rate</span>
              </button>

              <button
                type="button"
                onClick={() => onSelectAnime(featuredAnime)}
                className="px-4 py-2.5 rounded-lg bg-[#1b2228] hover:bg-[#242c34] text-white border border-[#2c3440] font-medium text-xs flex items-center gap-2 transition-colors"
              >
                <Film className="w-4 h-4 text-[#89a]" />
                <span>View Details</span>
              </button>

              <button
                type="button"
                onClick={() => onToggleWatchlist(featuredAnime)}
                className={`p-2.5 rounded-lg border transition-colors ${
                  isHeroInWatchlist
                    ? 'bg-[#40bcf4]/20 border-[#40bcf4] text-[#40bcf4]'
                    : 'bg-[#1b2228] border-[#2c3440] text-[#89a] hover:text-white'
                }`}
                title={isHeroInWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
              >
                <Clock className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => onToggleLike(featuredAnime)}
                className={`p-2.5 rounded-lg border transition-colors ${
                  isHeroLiked
                    ? 'bg-[#ff4b60]/20 border-[#ff4b60] text-[#ff4b60]'
                    : 'bg-[#1b2228] border-[#2c3440] text-[#89a] hover:text-white'
                }`}
                title={isHeroLiked ? 'Unlike' : 'Like'}
              >
                <Heart className={`w-4 h-4 ${isHeroLiked ? 'fill-current' : ''}`} />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Main Catalog Navigation & Search Bar */}
      <section className="space-y-6">
        
        {/* Source Selector Bar: Curated / Top All-Time / Seasonal / Live Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-xl bg-[#1b2228] border border-[#2c3440]">
          
          {/* Source Tabs */}
          <div className="flex items-center gap-1 p-1 bg-[#14181c] rounded-lg border border-[#242c34] overflow-x-auto">
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCatalogSource('curated');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                catalogSource === 'curated' && !searchQuery
                  ? 'bg-[#00e054] text-[#14181c] shadow'
                  : 'text-[#89a] hover:text-white'
              }`}
            >
              <Award className="w-3.5 h-3.5" />
              <span>Iconic Classics ({CURATED_ANIME.length})</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCatalogSource('top_all');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                catalogSource === 'top_all' && !searchQuery
                  ? 'bg-[#00e054] text-[#14181c] shadow'
                  : 'text-[#89a] hover:text-white'
              }`}
            >
              <Globe2 className="w-3.5 h-3.5" />
              <span>All Anime (Top Global)</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setCatalogSource('seasonal');
              }}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                catalogSource === 'seasonal' && !searchQuery
                  ? 'bg-[#00e054] text-[#14181c] shadow'
                  : 'text-[#89a] hover:text-white'
              }`}
            >
              <Flame className="w-3.5 h-3.5" />
              <span>Trending Now</span>
            </button>
          </div>

          {/* Live Search Input for ANY anime in existence */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-[#678]" />
            <input
              type="text"
              placeholder="Search ANY anime (e.g. One Piece, Naruto, Dragon Ball, Gundam)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-1.5 bg-[#14181c] border border-[#2c3440] rounded-lg text-xs text-white placeholder-[#567] focus:outline-none focus:border-[#00e054]"
            />
            {isLoading && (
              <Loader2 className="absolute right-2.5 top-2.5 w-3.5 h-3.5 text-[#00e054] animate-spin" />
            )}
          </div>

        </div>

        {/* Filter Bar: Format, Genre, and Sort */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          
          {/* Format pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {FORMAT_OPTIONS.map((fmt) => (
              <button
                key={fmt}
                type="button"
                onClick={() => setSelectedFormat(fmt)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-medium transition-colors whitespace-nowrap ${
                  selectedFormat === fmt
                    ? 'bg-[#2c3440] text-white border border-[#00e054]'
                    : 'text-[#89a] hover:text-white bg-[#191d22] border border-[#242c34]'
                }`}
              >
                {fmt}
              </button>
            ))}
          </div>

          {/* Genre and Sort Dropdowns */}
          <div className="flex items-center gap-2">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-[#191d22] border border-[#2c3440] rounded-lg text-xs text-white px-2.5 py-1 focus:outline-none focus:border-[#00e054]"
            >
              {GENRE_OPTIONS.map(g => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="bg-[#191d22] border border-[#2c3440] rounded-lg text-xs text-white px-2.5 py-1 focus:outline-none focus:border-[#00e054]"
            >
              {SORT_OPTIONS.map(s => (
                <option key={s.id} value={s.id}>{s.label}</option>
              ))}
            </select>
          </div>

        </div>

        {/* Section Header with status info */}
        <div className="flex items-center justify-between border-b border-[#242c34] pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              {searchQuery.trim()
                ? `Results for "${searchQuery}"`
                : catalogSource === 'top_all'
                ? 'All-Time Global Rankings'
                : catalogSource === 'seasonal'
                ? 'Currently Airing Worldwide'
                : 'Otakuboxd Signature Catalog'}
            </h2>
            {isLoading && (
              <span className="text-xs text-[#00e054] font-mono flex items-center gap-1">
                <Loader2 className="w-3 h-3 animate-spin" /> Loading from MAL...
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-2 text-xs font-mono text-[#678]">
            <span className="tabular-nums text-[#00e054] font-semibold">{filteredAnimeList.length}</span>
            <span>titles displayed</span>
          </div>
        </div>

        {/* Anime Posters Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {filteredAnimeList.map((anime) => {
            const userRating = userRatingsMap.get(String(anime.id));
            const isInWatchlist = watchlistIds.some(id => String(id) === String(anime.id));
            const isLiked = likedIds.some(id => String(id) === String(anime.id));

            return (
              <AnimeCard
                key={anime.id}
                anime={anime}
                userRating={userRating}
                isInWatchlist={isInWatchlist}
                isLiked={isLiked}
                onSelect={onSelectAnime}
                onQuickLog={onQuickLog}
                onToggleWatchlist={onToggleWatchlist}
                onToggleLike={onToggleLike}
              />
            );
          })}
        </div>

        {/* Empty state */}
        {!isLoading && filteredAnimeList.length === 0 && (
          <div className="py-16 text-center text-[#89a] space-y-3 rounded-xl bg-[#191d22] border border-[#2c3440]">
            <Film className="w-8 h-8 text-[#678] mx-auto" />
            <p className="text-sm text-white">No anime found matching current criteria.</p>
            <p className="text-xs text-[#678]">
              Try searching a different title or resetting filters to explore the global library.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGenre('All Genres');
                setSelectedFormat('All Formats');
                setCatalogSource('top_all');
              }}
              className="px-4 py-1.5 rounded-lg bg-[#00e054] text-[#14181c] text-xs font-semibold"
            >
              Browse All Global Anime
            </button>
          </div>
        )}

        {/* Load More Button for Infinite Catalog Browsing */}
        {(catalogSource === 'top_all' || catalogSource === 'seasonal' || !!searchQuery.trim()) && hasNextPage && (
          <div className="text-center pt-4">
            <button
              type="button"
              onClick={handleLoadMore}
              disabled={isLoadingMore}
              className="px-6 py-2.5 rounded-lg bg-[#1b2228] hover:bg-[#242c34] text-white border border-[#2c3440] hover:border-[#00e054] text-xs font-semibold font-mono flex items-center gap-2 mx-auto transition-all shadow"
            >
              {isLoadingMore ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-[#00e054]" />
                  <span>Loading more anime from global database...</span>
                </>
              ) : (
                <>
                  <Globe2 className="w-4 h-4 text-[#00e054]" />
                  <span>Load More Anime (Page {currentPage + 1})</span>
                </>
              )}
            </button>
          </div>
        )}

      </section>

      {/* Community Activity Teaser */}
      {onNavigateToActivity && (
        <section
          onClick={onNavigateToActivity}
          className="p-5 rounded-xl bg-[#191d22] border border-[#2c3440] hover:border-[#00e054] transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-between gap-4 group"
        >
          <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-[#00e054] animate-pulse shrink-0" />
            <div>
              <p className="text-xs font-semibold text-white group-hover:text-[#00e054] transition-colors">
                Live Community Activity
              </p>
              <p className="text-[11px] text-[#89a] font-mono mt-0.5">
                Mariko reviewed Princess Mononoke ★★★★★ · Daisuke logged Cyberpunk: Edgerunners · Kenji rated Steins;Gate ★★★★½
              </p>
            </div>
          </div>

          <span className="text-xs font-semibold text-[#00e054] group-hover:underline whitespace-nowrap">
            View Activity Feed →
          </span>
        </section>
      )}

    </div>
  );
};
