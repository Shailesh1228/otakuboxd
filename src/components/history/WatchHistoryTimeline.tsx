import React, { useState, useMemo } from 'react';
import { Anime, AnimeLog } from '../../types/anime';
import { StarRating } from '../StarRating';
import { CURATED_ANIME } from '../../data/curatedAnime';
import { getCachedAnime } from '../../services/jikanApi';
import {
  Calendar,
  Clock,
  Heart,
  Repeat,
  Sparkles,
  ArrowUpDown,
  Search,
  Filter,
  Film,
  Plus,
  Compass,
  CheckCircle2,
  ChevronDown,
  Award
} from 'lucide-react';

interface WatchHistoryTimelineProps {
  logs: AnimeLog[];
  onSelectAnime: (anime: Anime) => void;
  onOpenLogModal: (anime?: Anime, existingLog?: AnimeLog) => void;
}

export const WatchHistoryTimeline: React.FC<WatchHistoryTimelineProps> = ({
  logs,
  onSelectAnime,
  onOpenLogModal
}) => {
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc'); // desc = newest first, asc = journey from beginning
  const [selectedYear, setSelectedYear] = useState<string>('All');
  const [selectedRatingFilter, setSelectedRatingFilter] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedLogIds, setExpandedLogIds] = useState<{ [id: string]: boolean }>({});

  // Resolve anime object
  const resolveAnime = (log: AnimeLog): Anime => {
    const found = CURATED_ANIME.find(a => String(a.id) === String(log.animeId)) || getCachedAnime(log.animeId);
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
      averageRating: log.rating || 4.5,
      ratingsCount: 100,
      status: 'Finished Airing'
    };
  };

  // Available years in logs
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    logs.forEach(l => {
      if (l.watchedDate) {
        years.add(l.watchedDate.split('-')[0]);
      }
    });
    return Array.from(years).sort().reverse();
  }, [logs]);

  // Filter and sort logs
  const processedLogs = useMemo(() => {
    return logs.filter(log => {
      // Year filter
      if (selectedYear !== 'All' && !log.watchedDate.startsWith(selectedYear)) {
        return false;
      }
      // Rating filter
      if (selectedRatingFilter > 0 && log.rating < selectedRatingFilter) {
        return false;
      }
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = log.animeTitle.toLowerCase().includes(q);
        const matchesReview = log.reviewText?.toLowerCase().includes(q);
        const matchesTag = log.tags?.some(t => t.toLowerCase().includes(q));
        if (!matchesTitle && !matchesReview && !matchesTag) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortOrder === 'desc') {
        return b.watchedDate.localeCompare(a.watchedDate);
      } else {
        return a.watchedDate.localeCompare(b.watchedDate);
      }
    });
  }, [logs, selectedYear, selectedRatingFilter, searchQuery, sortOrder]);

  // Group logs into Year -> Month clusters for structured timeline
  const timelineGroups = useMemo(() => {
    const groups: {
      [monthKey: string]: {
        monthTitle: string;
        year: string;
        items: AnimeLog[];
        totalHours: number;
      };
    } = {};

    processedLogs.forEach(log => {
      const d = new Date(log.watchedDate);
      const year = !isNaN(d.getTime()) ? String(d.getFullYear()) : 'Recent';
      const monthTitle = !isNaN(d.getTime())
        ? d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
        : 'Undated';
      const key = `${year}-${monthTitle}`;

      if (!groups[key]) {
        groups[key] = {
          monthTitle,
          year,
          items: [],
          totalHours: 0
        };
      }
      groups[key].items.push(log);
      groups[key].totalHours += log.animeFormat === 'Movie' ? 2 : 4.8;
    });

    return Object.values(groups);
  }, [processedLogs]);

  const toggleExpand = (id: string) => {
    setExpandedLogIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-8">
      
      {/* Timeline Controls Header */}
      <div className="p-5 rounded-2xl bg-[#191d22] border border-[#2c3440] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242c34] pb-4">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-[#00e054]" />
              <h2 className="text-lg font-bold text-white tracking-tight font-display">
                Viewing Journey Timeline
              </h2>
            </div>
            <p className="text-xs text-[#89a] font-mono mt-0.5">
              Scroll through the milestones, dates, and emotional chapters of your anime watch history.
            </p>
          </div>

          {/* Quick Direction Toggle */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSortOrder(prev => (prev === 'desc' ? 'asc' : 'desc'))}
              className="px-3 py-1.5 rounded-lg bg-[#14181c] border border-[#2c3440] hover:border-[#00e054] text-xs font-mono text-white flex items-center gap-1.5 transition-colors"
            >
              <ArrowUpDown className="w-3.5 h-3.5 text-[#00e054]" />
              <span>{sortOrder === 'desc' ? 'Newest First' : 'Journey From Start'}</span>
            </button>

            <button
              type="button"
              onClick={() => onOpenLogModal()}
              className="px-3.5 py-1.5 rounded-lg bg-[#00e054] hover:bg-[#00f25c] text-[#14181c] text-xs font-semibold flex items-center gap-1.5 transition-colors shadow"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Log Entry</span>
            </button>
          </div>
        </div>

        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Year selector pills */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            <button
              type="button"
              onClick={() => setSelectedYear('All')}
              className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                selectedYear === 'All'
                  ? 'bg-[#00e054] text-[#14181c] font-semibold shadow'
                  : 'bg-[#14181c] text-[#89a] hover:text-white border border-[#242c34]'
              }`}
            >
              All Years ({logs.length})
            </button>
            {availableYears.map(yr => (
              <button
                key={yr}
                type="button"
                onClick={() => setSelectedYear(yr)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-colors ${
                  selectedYear === yr
                    ? 'bg-[#00e054] text-[#14181c] font-semibold shadow'
                    : 'bg-[#14181c] text-[#89a] hover:text-white border border-[#242c34]'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* Rating filter & search input */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="flex items-center gap-1.5 text-xs text-[#89a] font-mono">
              <Filter className="w-3.5 h-3.5 text-[#678]" />
              <select
                value={selectedRatingFilter}
                onChange={(e) => setSelectedRatingFilter(Number(e.target.value))}
                className="bg-[#14181c] border border-[#2c3440] rounded px-2.5 py-1 text-white text-xs focus:outline-none focus:border-[#00e054]"
              >
                <option value={0}>All Ratings</option>
                <option value={4.0}>4.0★ & Above</option>
                <option value={4.5}>4.5★ & Above</option>
                <option value={5.0}>5.0★ Masterpieces</option>
              </select>
            </div>

            <div className="relative flex-1 sm:w-44">
              <Search className="absolute left-2.5 top-2 w-3.5 h-3.5 text-[#678]" />
              <input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1 bg-[#14181c] border border-[#2c3440] rounded text-xs text-white placeholder-[#567] focus:outline-none focus:border-[#00e054]"
              />
            </div>
          </div>

        </div>
      </div>

      {/* Vertical Timeline Spine & Chronological Nodes */}
      {timelineGroups.length > 0 ? (
        <div className="relative pl-6 sm:pl-10 space-y-12 before:absolute before:left-3 sm:before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-gradient-to-b before:from-[#00e054] before:via-[#2c3440] before:to-transparent">
          
          {timelineGroups.map((group) => (
            <div key={group.monthTitle} className="space-y-6 relative">
              
              {/* Month Milestone Badge */}
              <div className="relative flex items-center gap-3 -ml-6 sm:-ml-10">
                <div className="w-6 h-6 sm:w-10 sm:h-10 rounded-full bg-[#14181c] border-2 border-[#00e054] flex items-center justify-center text-[#00e054] shadow-[0_0_12px_rgba(0,224,84,0.3)] z-10">
                  <Calendar className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-white font-display">
                    {group.monthTitle}
                  </h3>
                  <div className="flex items-center gap-2 text-[11px] text-[#89a] font-mono mt-0.5">
                    <span>{group.items.length} titles logged</span>
                    <span>·</span>
                    <span>~{group.totalHours.toFixed(0)} hrs spent</span>
                  </div>
                </div>
              </div>

              {/* Cluster Entries */}
              <div className="space-y-4">
                {group.items.map((log, index) => {
                  const anime = resolveAnime(log);
                  const isExpanded = !!expandedLogIds[log.id];
                  const dateObj = new Date(log.watchedDate);
                  const formattedDate = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })
                    : log.watchedDate;

                  const isMasterpiece = log.rating >= 4.5;

                  return (
                    <div
                      key={log.id}
                      className="group relative rounded-xl bg-[#191d22] border border-[#2c3440] hover:border-[#00e054] p-4 sm:p-5 transition-all shadow-md space-y-3"
                    >
                      {/* Timeline Node Dot attached to card */}
                      <div className="absolute -left-[30px] sm:-ml-0 sm:-left-[46px] top-6 w-3 h-3 rounded-full bg-[#14181c] border-2 border-[#00e054] group-hover:scale-125 transition-transform" />

                      {/* Header Row: Date, Milestone, and Star Rating */}
                      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#242c34] pb-2 text-xs">
                        <div className="flex items-center gap-2 font-mono">
                          <span className="text-white font-semibold">{formattedDate}</span>
                          {log.progress && (
                            <>
                              <span className="text-[#678]">·</span>
                              <span className="text-[#89a]">{log.progress}</span>
                            </>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
                          {isMasterpiece && (
                            <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-[#00e054]/10 text-[#00e054] border border-[#00e054]/20">
                              <Sparkles className="w-3 h-3" /> Masterpiece
                            </span>
                          )}
                          {log.isRewatch && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-mono text-[#00e054]" title="Rewatch">
                              <Repeat className="w-3 h-3" /> Rewatched
                            </span>
                          )}
                          {log.isLiked && (
                            <Heart className="w-3.5 h-3.5 text-[#ff4b60] fill-current" />
                          )}
                        </div>
                      </div>

                      {/* Entry Body: Poster + Title + Rating + Review */}
                      <div className="flex gap-4 items-start">
                        {/* Poster Thumbnail */}
                        <div
                          onClick={() => onSelectAnime(anime)}
                          className="w-16 sm:w-20 aspect-[2/3] rounded bg-[#14181c] border border-[#2c3440] overflow-hidden shrink-0 cursor-pointer hover:border-[#00e054] transition-colors shadow"
                        >
                          {log.animePoster ? (
                            <img
                              src={log.animePoster}
                              alt={log.animeTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          ) : (
                            <Film className="w-6 h-6 m-auto text-[#678]" />
                          )}
                        </div>

                        {/* Details */}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex flex-wrap items-baseline justify-between gap-2">
                            <div>
                              <h4
                                onClick={() => onSelectAnime(anime)}
                                className="text-base font-bold text-white hover:text-[#00e054] transition-colors cursor-pointer"
                              >
                                {log.animeTitle}
                              </h4>
                              <p className="text-xs text-[#89a] font-mono mt-0.5">
                                {log.animeYear} · {log.animeFormat} · {anime.studio}
                              </p>
                            </div>

                            {/* Stars */}
                            <div>
                              {log.rating > 0 ? (
                                <StarRating rating={log.rating} size="sm" showNumeric />
                              ) : (
                                <span className="text-xs text-[#678] font-mono italic">unrated</span>
                              )}
                            </div>
                          </div>

                          {/* Review Excerpt */}
                          {log.reviewText && (
                            <div className="pt-1">
                              <p className={`text-xs text-[#c8d4e0] leading-relaxed italic ${!isExpanded ? 'line-clamp-2' : ''}`}>
                                "{log.reviewText}"
                              </p>
                              {log.reviewText.length > 140 && (
                                <button
                                  type="button"
                                  onClick={() => toggleExpand(log.id)}
                                  className="text-[11px] text-[#00e054] hover:underline font-mono mt-1"
                                >
                                  {isExpanded ? 'Show less' : 'Read full thought →'}
                                </button>
                              )}
                            </div>
                          )}

                          {/* Tags */}
                          {log.tags && log.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {log.tags.map(t => (
                                <span key={t} className="text-[10px] font-mono text-[#89a]">
                                  #{t}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Card Bottom: Edit or View actions */}
                      <div className="flex items-center justify-between pt-2 border-t border-[#242c34] text-[11px] font-mono text-[#678]">
                        <span className="tabular-nums">Logged #{logs.length - index} in diary</span>
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => onSelectAnime(anime)}
                            className="text-[#89a] hover:text-white transition-colors"
                          >
                            Film Details
                          </button>
                          <span>·</span>
                          <button
                            type="button"
                            onClick={() => onOpenLogModal(anime, log)}
                            className="text-[#00e054] hover:underline"
                          >
                            Edit Log
                          </button>
                        </div>
                      </div>

                    </div>
                  );
                })}
              </div>

            </div>
          ))}

        </div>
      ) : (
        <div className="p-16 text-center rounded-2xl bg-[#191d22] border border-[#2c3440] space-y-3">
          <Calendar className="w-10 h-10 text-[#678] mx-auto" />
          <h3 className="text-sm font-semibold text-white">No timeline entries found</h3>
          <p className="text-xs text-[#89a] max-w-sm mx-auto">
            Try adjusting your year or rating filters, or log a new anime to start your timeline journey.
          </p>
          <button
            type="button"
            onClick={() => onOpenLogModal()}
            className="px-4 py-2 rounded-lg bg-[#00e054] text-[#14181c] font-semibold text-xs inline-flex items-center gap-1.5 mt-2"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>Log Your First Anime</span>
          </button>
        </div>
      )}

    </div>
  );
};
