import React, { useState, useMemo } from 'react';
import { Anime, AnimeLog } from '../../types/anime';
import { StarRating } from '../StarRating';
import { Heart, Repeat, MessageSquare, Edit3, Trash2, Calendar, Filter, Plus, Film, Compass, List } from 'lucide-react';
import { CURATED_ANIME } from '../../data/curatedAnime';
import { WatchHistoryTimeline } from '../history/WatchHistoryTimeline';

interface DiaryViewProps {
  logs: AnimeLog[];
  onOpenLogModal: (anime?: Anime, existingLog?: AnimeLog) => void;
  onDeleteLog: (logId: string) => void;
  onSelectAnime: (anime: Anime) => void;
}

export const DiaryView: React.FC<DiaryViewProps> = ({
  logs,
  onOpenLogModal,
  onDeleteLog,
  onSelectAnime
}) => {
  const [viewMode, setViewMode] = useState<'timeline' | 'table'>('timeline');
  const [yearFilter, setYearFilter] = useState<string>('All');
  const [onlyRewatches, setOnlyRewatches] = useState(false);
  const [onlyLiked, setOnlyLiked] = useState(false);
  const [expandedReviewId, setExpandedReviewId] = useState<string | null>(null);

  // Available years from logs
  const availableYears = useMemo(() => {
    const years = new Set<string>();
    logs.forEach(l => {
      if (l.watchedDate) {
        years.add(l.watchedDate.split('-')[0]);
      }
    });
    return Array.from(years).sort().reverse();
  }, [logs]);

  // Filter logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      if (yearFilter !== 'All' && !log.watchedDate.startsWith(yearFilter)) return false;
      if (onlyRewatches && !log.isRewatch) return false;
      if (onlyLiked && !log.isLiked) return false;
      return true;
    }).sort((a, b) => b.watchedDate.localeCompare(a.watchedDate));
  }, [logs, yearFilter, onlyRewatches, onlyLiked]);

  // Group by Month/Year for clean Letterboxd diary timeline display
  const groupedLogs = useMemo(() => {
    const groups: { [key: string]: AnimeLog[] } = {};
    filteredLogs.forEach(log => {
      const d = new Date(log.watchedDate);
      const key = isNaN(d.getTime())
        ? 'Recent'
        : d.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      if (!groups[key]) groups[key] = [];
      groups[key].push(log);
    });
    return groups;
  }, [filteredLogs]);

  // Helper to resolve anime object for modal
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
      
      {/* Header & Stats Strip */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242c34] pb-4">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight font-display">
            Anime Diary & Watch History
          </h1>
          <p className="text-xs text-[#89a] mt-1 font-mono">
            A chronological journey of every anime film and series you’ve experienced.
          </p>
        </div>

        {/* View Mode Switcher (Timeline vs Table) & Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1 p-0.5 bg-[#14181c] rounded-lg border border-[#2c3440]">
            <button
              type="button"
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'timeline'
                  ? 'bg-[#00e054] text-[#14181c] font-semibold shadow'
                  : 'text-[#89a] hover:text-white'
              }`}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>Watch History Timeline</span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-colors flex items-center gap-1.5 ${
                viewMode === 'table'
                  ? 'bg-[#00e054] text-[#14181c] font-semibold shadow'
                  : 'text-[#89a] hover:text-white'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Classic Table</span>
            </button>
          </div>

          {viewMode === 'table' && (
            <button
              type="button"
              onClick={() => onOpenLogModal()}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-[#00e054] text-[#14181c] hover:bg-[#00f25c] flex items-center gap-1 shadow transition-colors"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Log Entry</span>
            </button>
          )}
        </div>
      </div>

      {/* View Mode 1: Watch History Timeline Component */}
      {viewMode === 'timeline' ? (
        <WatchHistoryTimeline
          logs={logs}
          onSelectAnime={onSelectAnime}
          onOpenLogModal={onOpenLogModal}
        />
      ) : (
        /* View Mode 2: Classic Table View */
        <div className="space-y-6">
          {/* Table Filters Strip */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-[#191d22] border border-[#2c3440]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-[#89a]">
                <span>Year:</span>
                <select
                  value={yearFilter}
                  onChange={(e) => setYearFilter(e.target.value)}
                  className="bg-[#14181c] border border-[#2c3440] rounded px-2.5 py-1 text-white text-xs focus:outline-none focus:border-[#00e054]"
                >
                  <option value="All">All Time</option>
                  {availableYears.map(yr => (
                    <option key={yr} value={yr}>{yr}</option>
                  ))}
                </select>
              </div>

              <button
                type="button"
                onClick={() => setOnlyRewatches(!onlyRewatches)}
                className={`px-3 py-1 text-xs rounded-md border flex items-center gap-1 transition-colors ${
                  onlyRewatches
                    ? 'bg-[#00e054]/20 border-[#00e054] text-[#00e054]'
                    : 'bg-[#14181c] border-[#2c3440] text-[#89a] hover:text-white'
                }`}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Rewatches</span>
              </button>

              <button
                type="button"
                onClick={() => setOnlyLiked(!onlyLiked)}
                className={`px-3 py-1 text-xs rounded-md border flex items-center gap-1 transition-colors ${
                  onlyLiked
                    ? 'bg-[#ff4b60]/20 border-[#ff4b60] text-[#ff4b60]'
                    : 'bg-[#14181c] border-[#2c3440] text-[#89a] hover:text-white'
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Liked</span>
              </button>
            </div>

            <span className="text-xs font-mono text-[#678] tabular-nums">
              {filteredLogs.length} entries recorded
            </span>
          </div>

          {/* Diary Timeline Table */}
      {filteredLogs.length > 0 ? (
        <div className="space-y-8">
          {Object.entries(groupedLogs).map(([monthGroup, groupEntries]) => (
            <div key={monthGroup} className="space-y-3">
              {/* Month Group Header */}
              <h3 className="text-xs font-semibold uppercase tracking-wider text-[#678] font-mono border-b border-[#242c34] pb-1">
                {monthGroup}
              </h3>

              <div className="divide-y divide-[#242c34] rounded-lg border border-[#242c34] bg-[#191d22] overflow-hidden">
                {groupEntries.map((log) => {
                  const dateObj = new Date(log.watchedDate);
                  const dayNum = !isNaN(dateObj.getTime())
                    ? String(dateObj.getDate()).padStart(2, '0')
                    : '—';
                  const weekday = !isNaN(dateObj.getTime())
                    ? dateObj.toLocaleDateString('en-US', { weekday: 'short' })
                    : '';

                  const isExpanded = expandedReviewId === log.id;

                  return (
                    <div key={log.id} className="p-3 sm:p-4 hover:bg-[#1f242a] transition-colors">
                      <div className="flex items-center justify-between gap-4">
                        
                        {/* Date column (Letterboxd style Day + Weekday) */}
                        <div className="w-12 shrink-0 text-center font-mono">
                          <span className="block text-base font-bold text-white tabular-nums">
                            {dayNum}
                          </span>
                          <span className="block text-[10px] text-[#678] uppercase">
                            {weekday}
                          </span>
                        </div>

                        {/* Poster Thumbnail */}
                        <div
                          onClick={() => onSelectAnime(resolveAnime(log))}
                          className="w-10 h-14 sm:w-12 sm:h-16 rounded bg-[#14181c] border border-[#2c3440] overflow-hidden shrink-0 cursor-pointer hover:border-[#00e054] transition-colors"
                        >
                          {log.animePoster ? (
                            <img
                              src={log.animePoster}
                              alt={log.animeTitle}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Film className="w-4 h-4 m-auto text-[#678]" />
                          )}
                        </div>

                        {/* Title, Year, Format & Progress */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-baseline gap-2">
                            <h4
                              onClick={() => onSelectAnime(resolveAnime(log))}
                              className="text-sm font-semibold text-white truncate cursor-pointer hover:text-[#00e054] transition-colors"
                            >
                              {log.animeTitle}
                            </h4>
                            <span className="text-xs text-[#678] font-mono shrink-0">
                              {log.animeYear}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-[#89a] font-mono mt-0.5">
                            <span>{log.animeFormat}</span>
                            {log.progress && (
                              <>
                                <span>·</span>
                                <span className="text-[#678]">{log.progress}</span>
                              </>
                            )}
                          </div>
                        </div>

                        {/* Rating in Green Stars */}
                        <div className="shrink-0 flex items-center gap-1.5">
                          {log.rating > 0 ? (
                            <StarRating rating={log.rating} size="sm" showNumeric />
                          ) : (
                            <span className="text-xs text-[#678] font-mono italic">unrated</span>
                          )}
                        </div>

                        {/* Rewatch icon */}
                        <div className="w-6 shrink-0 text-center">
                          {log.isRewatch ? (
                            <span title="Rewatch">
                              <Repeat className="w-4 h-4 text-[#00e054] inline-block" />
                            </span>
                          ) : (
                            <span className="text-[#343e4a] text-xs font-mono">—</span>
                          )}
                        </div>

                        {/* Liked heart */}
                        <div className="w-6 shrink-0 text-center">
                          {log.isLiked ? (
                            <span title="Liked">
                              <Heart className="w-4 h-4 text-[#ff4b60] fill-current inline-block" />
                            </span>
                          ) : (
                            <span className="text-[#343e4a] text-xs font-mono">—</span>
                          )}
                        </div>

                        {/* Review toggle button */}
                        <div className="w-6 shrink-0 text-center">
                          {log.reviewText ? (
                            <button
                              type="button"
                              onClick={() => setExpandedReviewId(isExpanded ? null : log.id)}
                              className={`p-1 rounded transition-colors ${
                                isExpanded ? 'text-[#00e054]' : 'text-[#89a] hover:text-white'
                              }`}
                              title="Toggle review notes"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          ) : (
                            <span className="text-[#343e4a] text-xs font-mono">—</span>
                          )}
                        </div>

                        {/* Edit & Delete actions */}
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => onOpenLogModal(resolveAnime(log), log)}
                            className="p-1.5 rounded text-[#89a] hover:text-white hover:bg-[#242c34] transition-colors"
                            title="Edit entry"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Remove log for "${log.animeTitle}"?`)) {
                                onDeleteLog(log.id);
                              }
                            }}
                            className="p-1.5 rounded text-[#89a] hover:text-[#ff4b60] hover:bg-[#242c34] transition-colors"
                            title="Delete entry"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                      </div>

                      {/* Expanded Review drawer */}
                      {isExpanded && log.reviewText && (
                        <div className="mt-3 ml-16 p-3 rounded-lg bg-[#14181c] border border-[#2c3440] text-xs text-[#c8d4e0] space-y-2 animate-in fade-in duration-150">
                          {log.containsSpoilers && (
                            <span className="text-[10px] uppercase font-mono tracking-wider text-[#ff8000] font-semibold block">
                              ⚠️ Spoiler Warning
                            </span>
                          )}
                          <p className="leading-relaxed whitespace-pre-wrap">{log.reviewText}</p>
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
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center rounded-xl bg-[#1b2228] border border-[#2c3440] space-y-3">
          <Calendar className="w-8 h-8 text-[#678] mx-auto" />
          <h3 className="text-sm font-semibold text-white">No diary entries recorded</h3>
          <p className="text-xs text-[#89a] max-w-sm mx-auto">
            Log anime you’ve watched along with your star ratings, dates, and review notes to populate your timeline.
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
  )}

</div>
);
};
