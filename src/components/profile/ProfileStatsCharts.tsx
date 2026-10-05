import React, { useState, useMemo } from 'react';
import { AnimeLog } from '../../types/anime';
import { CURATED_ANIME } from '../../data/curatedAnime';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  CartesianGrid
} from 'recharts';
import { Clock, PieChart as PieIcon, BarChart3, TrendingUp, Calendar, Film } from 'lucide-react';

interface ProfileStatsChartsProps {
  logs: AnimeLog[];
}

const GENRE_COLORS = [
  '#00e054', // Letterboxd green
  '#40bcf4', // Sky blue
  '#ff4500', // Vermilion
  '#ffb800', // Gold/amber
  '#a855f7', // Purple
  '#ec4899', // Pink
  '#14b8a6', // Teal
  '#6366f1'  // Indigo
];

export const ProfileStatsCharts: React.FC<ProfileStatsChartsProps> = ({ logs }) => {
  const [genreMetric, setGenreMetric] = useState<'count' | 'hours'>('count');
  const [timeViewMode, setTimeViewMode] = useState<'monthly' | 'cumulative'>('monthly');

  // Calculate genre statistics
  const genreData = useMemo(() => {
    const genreMap: { [genre: string]: { count: number; hours: number } } = {};

    logs.forEach(log => {
      const anime = CURATED_ANIME.find(a => String(a.id) === String(log.animeId));
      const genres = anime?.genres || ['Animation'];
      
      // Calculate approx hours for this entry
      let entryHours = 2.0;
      if (anime) {
        if (anime.format === 'Movie') entryHours = 2.0;
        else entryHours = ((anime.episodes || 12) * 24) / 60;
      }

      genres.forEach(g => {
        if (!genreMap[g]) genreMap[g] = { count: 0, hours: 0 };
        genreMap[g].count += 1;
        genreMap[g].hours += entryHours;
      });
    });

    const entries = Object.entries(genreMap).map(([genre, stats]) => ({
      genre,
      count: stats.count,
      hours: Number(stats.hours.toFixed(1))
    }));

    // Sort by selected metric descending
    entries.sort((a, b) => (genreMetric === 'count' ? b.count - a.count : b.hours - a.hours));
    return entries.slice(0, 7); // top 7 genres
  }, [logs, genreMetric]);

  // Calculate watch time progression
  const watchTimeData = useMemo(() => {
    // Sort logs chronologically
    const sortedLogs = [...logs].sort((a, b) => a.watchedDate.localeCompare(b.watchedDate));

    // Group hours by Month (YYYY-MM)
    const monthMap: { [month: string]: { monthLabel: string; hours: number; count: number } } = {};

    sortedLogs.forEach(log => {
      const ym = log.watchedDate.slice(0, 7); // '2026-08'
      const dateObj = new Date(log.watchedDate);
      const label = !isNaN(dateObj.getTime())
        ? dateObj.toLocaleDateString('en-US', { month: 'short', year: '2-digit' })
        : ym;

      const anime = CURATED_ANIME.find(a => String(a.id) === String(log.animeId));
      let entryHours = 2.0;
      if (anime) {
        if (anime.format === 'Movie') entryHours = 2.0;
        else entryHours = ((anime.episodes || 12) * 24) / 60;
      }

      if (!monthMap[ym]) {
        monthMap[ym] = { monthLabel: label, hours: 0, count: 0 };
      }
      monthMap[ym].hours += entryHours;
      monthMap[ym].count += 1;
    });

    let cumulative = 0;
    return Object.entries(monthMap).map(([key, item]) => {
      const monthHours = Number(item.hours.toFixed(1));
      cumulative = Number((cumulative + monthHours).toFixed(1));

      return {
        month: item.monthLabel,
        hours: monthHours,
        cumulativeHours: cumulative,
        animeCount: item.count
      };
    });
  }, [logs]);

  // Compute key highlights
  const totalWatchHours = useMemo(() => {
    let total = 0;
    logs.forEach(log => {
      const anime = CURATED_ANIME.find(a => String(a.id) === String(log.animeId));
      if (anime) {
        if (anime.format === 'Movie') total += 2.0;
        else total += ((anime.episodes || 12) * 24) / 60;
      } else {
        total += 2.0;
      }
    });
    return Number(total.toFixed(1));
  }, [logs]);

  const daysEquivalent = (totalWatchHours / 24).toFixed(1);
  const topGenre = genreData[0]?.genre || 'Sci-Fi';

  // Custom sleek tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-2.5 rounded-lg bg-[#14181c] border border-[#2c3440] shadow-xl text-xs space-y-1">
          <p className="font-semibold text-white">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={`item-${index}`} className="text-[#00e054] font-mono tabular-nums">
              {entry.name}: <strong className="text-white">{entry.value}</strong>
              {entry.dataKey.includes('hours') || entry.dataKey.includes('Hours') ? ' hrs' : ' anime'}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  return (
    <section className="space-y-6">
      
      {/* Section Title & Subtitle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#242c34] pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Cinephile Analytics & Watch Time
            </h2>
            <span className="text-xs font-mono text-[#00e054] bg-[#00e054]/10 px-2 py-0.5 rounded border border-[#00e054]/20">
              Recharts Analytics
            </span>
          </div>
          <p className="text-xs text-[#89a] font-mono mt-0.5">
            Deep breakdown of your genres, watch velocity, and cumulative hours on Otakuboxd.
          </p>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        
        <div className="p-4 rounded-xl bg-[#191d22] border border-[#2c3440] flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#00e054]/10 text-[#00e054] border border-[#00e054]/20 shrink-0">
            <Clock className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xl font-bold text-white font-mono tabular-nums">
              {totalWatchHours}h
            </span>
            <span className="text-[11px] text-[#678] font-mono uppercase">
              Total Watch Time
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#191d22] border border-[#2c3440] flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#40bcf4]/10 text-[#40bcf4] border border-[#40bcf4]/20 shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xl font-bold text-white font-mono tabular-nums">
              {daysEquivalent}d
            </span>
            <span className="text-[11px] text-[#678] font-mono uppercase">
              Continuous Days
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#191d22] border border-[#2c3440] flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#ff4500]/10 text-[#ff4500] border border-[#ff4500]/20 shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xl font-bold text-white font-mono truncate">
              {topGenre}
            </span>
            <span className="text-[11px] text-[#678] font-mono uppercase">
              Top Genre
            </span>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[#191d22] border border-[#2c3440] flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-[#a855f7]/10 text-[#a855f7] border border-[#a855f7]/20 shrink-0">
            <Film className="w-5 h-5" />
          </div>
          <div>
            <span className="block text-xl font-bold text-white font-mono tabular-nums">
              {logs.length}
            </span>
            <span className="text-[11px] text-[#678] font-mono uppercase">
              Films & Shows
            </span>
          </div>
        </div>

      </div>

      {/* Two-Column Grid: Left: Favorite Genres Bar Chart, Right: Total Watch Time Area Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* CHART 1: Favorite Genres Breakdown */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#191d22] border border-[#2c3440] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#242c34] pb-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-[#00e054]" />
                <span>Favorite Genres</span>
              </h3>
              <p className="text-[11px] text-[#89a] font-mono mt-0.5">
                Distribution across your logged catalog
              </p>
            </div>

            {/* Toggle metric */}
            <div className="flex items-center gap-1 p-0.5 bg-[#14181c] rounded-md border border-[#242c34] text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setGenreMetric('count')}
                className={`px-2 py-1 rounded transition-colors ${
                  genreMetric === 'count'
                    ? 'bg-[#00e054] text-[#14181c] font-semibold'
                    : 'text-[#89a] hover:text-white'
                }`}
              >
                By Titles
              </button>
              <button
                type="button"
                onClick={() => setGenreMetric('hours')}
                className={`px-2 py-1 rounded transition-colors ${
                  genreMetric === 'hours'
                    ? 'bg-[#00e054] text-[#14181c] font-semibold'
                    : 'text-[#89a] hover:text-white'
                }`}
              >
                By Hours
              </button>
            </div>
          </div>

          {/* Recharts Horizontal Bar Chart */}
          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={genreData}
                layout="vertical"
                margin={{ top: 5, right: 25, left: 10, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#242c34" />
                <XAxis
                  type="number"
                  tick={{ fill: '#89a', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#2c3440' }}
                  tickLine={{ stroke: '#2c3440' }}
                />
                <YAxis
                  dataKey="genre"
                  type="category"
                  tick={{ fill: '#c8d4e0', fontSize: 11 }}
                  axisLine={{ stroke: '#2c3440' }}
                  tickLine={false}
                  width={90}
                />
                <Tooltip content={<CustomTooltip />} />
                <Bar
                  dataKey={genreMetric === 'count' ? 'count' : 'hours'}
                  name={genreMetric === 'count' ? 'Anime Count' : 'Watch Hours'}
                  radius={[0, 4, 4, 0]}
                  barSize={14}
                >
                  {genreData.map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={GENRE_COLORS[index % GENRE_COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Genre Legends */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-[#242c34] text-[11px] font-mono text-[#89a]">
            {genreData.map((g, i) => (
              <span key={g.genre} className="flex items-center gap-1">
                <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{ backgroundColor: GENRE_COLORS[i % GENRE_COLORS.length] }}
                />
                <span>{g.genre}</span>
                <span className="text-[#678] tabular-nums">
                  ({genreMetric === 'count' ? g.count : `${g.hours}h`})
                </span>
                {i < genreData.length - 1 && <span className="text-[#343e4a]">·</span>}
              </span>
            ))}
          </div>
        </div>

        {/* CHART 2: Total Watch Time Progression */}
        <div className="p-5 sm:p-6 rounded-2xl bg-[#191d22] border border-[#2c3440] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#242c34] pb-3">
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#40bcf4]" />
                <span>Watch Time Progression</span>
              </h3>
              <p className="text-[11px] text-[#89a] font-mono mt-0.5">
                Monthly viewing time in hours
              </p>
            </div>

            {/* Toggle Monthly vs Cumulative */}
            <div className="flex items-center gap-1 p-0.5 bg-[#14181c] rounded-md border border-[#242c34] text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setTimeViewMode('monthly')}
                className={`px-2 py-1 rounded transition-colors ${
                  timeViewMode === 'monthly'
                    ? 'bg-[#40bcf4] text-[#14181c] font-semibold'
                    : 'text-[#89a] hover:text-white'
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setTimeViewMode('cumulative')}
                className={`px-2 py-1 rounded transition-colors ${
                  timeViewMode === 'cumulative'
                    ? 'bg-[#40bcf4] text-[#14181c] font-semibold'
                    : 'text-[#89a] hover:text-white'
                }`}
              >
                Cumulative
              </button>
            </div>
          </div>

          {/* Recharts Area Chart */}
          <div className="w-full h-64 pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={watchTimeData}
                margin={{ top: 10, right: 10, left: -15, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="watchTimeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#00e054" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#00e054" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="cumulativeGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#40bcf4" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#40bcf4" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#242c34" />
                <XAxis
                  dataKey="month"
                  tick={{ fill: '#89a', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#2c3440' }}
                  tickLine={{ stroke: '#2c3440' }}
                />
                <YAxis
                  tick={{ fill: '#89a', fontSize: 11, fontFamily: 'monospace' }}
                  axisLine={{ stroke: '#2c3440' }}
                  tickLine={{ stroke: '#2c3440' }}
                  unit="h"
                />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey={timeViewMode === 'monthly' ? 'hours' : 'cumulativeHours'}
                  name={timeViewMode === 'monthly' ? 'Monthly Hours' : 'Cumulative Hours'}
                  stroke={timeViewMode === 'monthly' ? '#00e054' : '#40bcf4'}
                  strokeWidth={2.5}
                  fillOpacity={1}
                  fill={`url(#${timeViewMode === 'monthly' ? 'watchTimeGradient' : 'cumulativeGradient'})`}
                  dot={{ r: 3, fill: timeViewMode === 'monthly' ? '#00e054' : '#40bcf4', strokeWidth: 1 }}
                  activeDot={{ r: 5, fill: '#ffffff', stroke: '#00e054', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom velocity metrics */}
          <div className="flex items-center justify-between pt-2 border-t border-[#242c34] text-[11px] font-mono text-[#89a]">
            <span>Average: {(totalWatchHours / Math.max(1, watchTimeData.length)).toFixed(1)} hrs/month</span>
            <span className="text-[#00e054] font-semibold">Total logged: {totalWatchHours} hours</span>
          </div>
        </div>

      </div>

    </section>
  );
};
