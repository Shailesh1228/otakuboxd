import React, { useState, useMemo } from 'react';
import { Anime, AnimeLog, AnimeList, UserProfile } from '../../types/anime';
import { StarRating } from '../StarRating';
import { AnimeCard } from '../AnimeCard';
import { ProfileStatsCharts } from '../profile/ProfileStatsCharts';
import { WatchHistoryTimeline } from '../history/WatchHistoryTimeline';
import { CURATED_ANIME } from '../../data/curatedAnime';
import { getCachedAnime } from '../../services/jikanApi';
import { Edit2, Download, Upload, Heart, Repeat, Sparkles, Film, Clock, Check, X } from 'lucide-react';

interface ProfileViewProps {
  profile: UserProfile;
  logs: AnimeLog[];
  lists: AnimeList[];
  watchlistIds: (string | number)[];
  likedIds: (string | number)[];
  onUpdateProfile: (updated: UserProfile) => void;
  onSelectAnime: (anime: Anime) => void;
  onQuickLog: (anime: Anime) => void;
  onExportData: () => void;
  onImportData: (json: string) => boolean;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  profile,
  logs,
  lists,
  watchlistIds,
  likedIds,
  onUpdateProfile,
  onSelectAnime,
  onQuickLog,
  onExportData,
  onImportData
}) => {
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [isEditingFavorites, setIsEditingFavorites] = useState(false);
  const [editDisplayName, setEditDisplayName] = useState(profile.displayName);
  const [editBio, setEditBio] = useState(profile.bio);
  const [editLocation, setEditLocation] = useState(profile.location);

  // Selected 4 favorites
  const [tempFavorites, setTempFavorites] = useState<(string | number)[]>(profile.favoriteFourIds);

  // Resolve Favorite Four anime objects
  const favoriteFourAnime = useMemo(() => {
    return profile.favoriteFourIds.map(id => {
      return CURATED_ANIME.find(a => String(a.id) === String(id)) || getCachedAnime(id);
    }).filter(Boolean) as Anime[];
  }, [profile.favoriteFourIds]);

  // Compute Letterboxd Rating Distribution (0.5 to 5.0)
  const ratingHistogram = useMemo(() => {
    const buckets: { [key: string]: number } = {
      '0.5': 0, '1.0': 0, '1.5': 0, '2.0': 0, '2.5': 0,
      '3.0': 0, '3.5': 0, '4.0': 0, '4.5': 0, '5.0': 0,
    };
    logs.forEach(l => {
      if (l.rating > 0) {
        const key = l.rating.toFixed(1);
        if (buckets[key] !== undefined) {
          buckets[key] += 1;
        }
      }
    });
    return Object.entries(buckets).map(([star, count]) => ({ star, count }));
  }, [logs]);

  const maxHistogramCount = Math.max(1, ...ratingHistogram.map(h => h.count));

  // Compute calculated anime hours (approx 24 min per ep, 100 min per movie)
  const totalStats = useMemo(() => {
    const animeWatched = new Set(logs.map(l => String(l.animeId))).size;
    let approxMinutes = 0;
    logs.forEach(log => {
      const found = CURATED_ANIME.find(a => String(a.id) === String(log.animeId));
      if (found) {
        if (found.format === 'Movie') approxMinutes += 115;
        else approxMinutes += (found.episodes || 12) * 24;
      } else {
        approxMinutes += 120;
      }
    });
    const hours = Math.round(approxMinutes / 60);

    return {
      animeWatched,
      totalEntries: logs.length,
      hours,
      listsCount: lists.length,
      watchlistCount: watchlistIds.length
    };
  }, [logs, lists, watchlistIds]);

  // Save profile changes
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      ...profile,
      displayName: editDisplayName.trim() || profile.displayName,
      bio: editBio.trim(),
      location: editLocation.trim()
    });
    setIsEditingProfile(false);
  };

  // Toggle favorite anime selection
  const toggleFavoriteChoice = (id: string | number) => {
    if (tempFavorites.includes(id)) {
      setTempFavorites(tempFavorites.filter(f => f !== id));
    } else {
      if (tempFavorites.length >= 4) {
        // Replace oldest or cap at 4
        setTempFavorites([...tempFavorites.slice(1), id]);
      } else {
        setTempFavorites([...tempFavorites, id]);
      }
    }
  };

  const handleSaveFavorites = () => {
    onUpdateProfile({
      ...profile,
      favoriteFourIds: tempFavorites
    });
    setIsEditingFavorites(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        const ok = onImportData(text);
        if (ok) {
          alert('Diary and profile data imported successfully!');
        } else {
          alert('Failed to parse backup JSON.');
        }
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-12 pb-16">
      
      {/* Profile Header & Bio */}
      <section className="p-6 sm:p-8 rounded-2xl bg-[#191d22] border border-[#2c3440] shadow-xl">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          
          {/* Avatar */}
          <div className="relative group">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-2 border-[#00e054] shadow-lg">
              <img
                src={profile.avatarUrl}
                alt={profile.displayName}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold text-white tracking-tight font-display">
                  {profile.displayName}
                </h1>
                <p className="text-xs text-[#00e054] font-mono">
                  @{profile.username}
                </p>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="px-3 py-1.5 rounded-lg border border-[#2c3440] hover:border-[#00e054] bg-[#14181c] text-xs text-[#89a] hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>Edit Profile</span>
                </button>
              </div>
            </div>

            {/* Bio */}
            <p className="text-sm text-[#c8d4e0] max-w-2xl leading-relaxed">
              {profile.bio}
            </p>

            {/* Unboxed location & joined date with typographic separators */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs text-[#678] font-mono pt-1">
              <span>{profile.location}</span>
              <span aria-hidden="true">·</span>
              <span>{profile.joinedDate}</span>
              <span aria-hidden="true">·</span>
              <span className="text-[#00e054]">Otakuboxd Patron</span>
            </div>
          </div>

        </div>

        {/* Edit Profile Form Drawer */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="mt-6 pt-6 border-t border-[#2c3440] space-y-4 animate-in fade-in duration-150">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#89a] mb-1">Display Name</label>
                <input
                  type="text"
                  value={editDisplayName}
                  onChange={(e) => setEditDisplayName(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#14181c] border border-[#2c3440] rounded-lg text-xs text-white focus:outline-none focus:border-[#00e054]"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#89a] mb-1">Location</label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[#14181c] border border-[#2c3440] rounded-lg text-xs text-white focus:outline-none focus:border-[#00e054]"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#89a] mb-1">Bio</label>
              <textarea
                rows={2}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-3 py-1.5 bg-[#14181c] border border-[#2c3440] rounded-lg text-xs text-white focus:outline-none focus:border-[#00e054]"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3 py-1.5 text-xs text-[#89a] hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#00e054] text-[#14181c] font-semibold text-xs rounded-lg hover:bg-[#00f25c] transition-colors"
              >
                Save Profile
              </button>
            </div>
          </form>
        )}

        {/* Profile Statistics Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 pt-6 mt-6 border-t border-[#242c34] text-center font-mono">
          <div>
            <span className="block text-xl font-bold text-white tabular-nums">
              {totalStats.animeWatched}
            </span>
            <span className="text-[11px] text-[#678] uppercase tracking-wider">
              Anime Logged
            </span>
          </div>

          <div>
            <span className="block text-xl font-bold text-white tabular-nums">
              {totalStats.totalEntries}
            </span>
            <span className="text-[11px] text-[#678] uppercase tracking-wider">
              Diary Entries
            </span>
          </div>

          <div>
            <span className="block text-xl font-bold text-white tabular-nums">
              {totalStats.hours}h
            </span>
            <span className="text-[11px] text-[#678] uppercase tracking-wider">
              Hours Watched
            </span>
          </div>

          <div>
            <span className="block text-xl font-bold text-white tabular-nums">
              {totalStats.listsCount}
            </span>
            <span className="text-[11px] text-[#678] uppercase tracking-wider">
              Lists
            </span>
          </div>

          <div>
            <span className="block text-xl font-bold text-[#40bcf4] tabular-nums">
              {totalStats.watchlistCount}
            </span>
            <span className="text-[11px] text-[#678] uppercase tracking-wider">
              Watchlist
            </span>
          </div>
        </div>

      </section>

      {/* ICONIC LETTERBOXD "FAVORITE FOUR" (TOP 4 ANIME) */}
      <section className="space-y-4">
        <div className="flex items-center justify-between border-b border-[#242c34] pb-2">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
              Favorite Four Anime
            </h2>
            <span className="text-xs text-[#678] font-mono">· Your signature taste</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setTempFavorites(profile.favoriteFourIds);
              setIsEditingFavorites(!isEditingFavorites);
            }}
            className="text-xs text-[#00e054] hover:underline"
          >
            {isEditingFavorites ? 'Close Picker' : 'Change Favorites'}
          </button>
        </div>

        {/* 4 Poster Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {favoriteFourAnime.map((anime) => (
            <div key={anime.id} className="space-y-2">
              <AnimeCard
                anime={anime}
                onSelect={onSelectAnime}
                onQuickLog={onQuickLog}
                showTitle={true}
              />
            </div>
          ))}
        </div>

        {/* Favorite Four Picker Modal/Drawer */}
        {isEditingFavorites && (
          <div className="p-4 rounded-xl bg-[#1b2228] border border-[#00e054]/40 space-y-4 animate-in fade-in duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-xs font-semibold text-white">Choose Your 4 Signature Anime</h4>
                <p className="text-[11px] text-[#89a]">Selected ({tempFavorites.length}/4 titles)</p>
              </div>
              <button
                type="button"
                onClick={handleSaveFavorites}
                className="px-4 py-1.5 bg-[#00e054] text-[#14181c] font-semibold text-xs rounded-lg hover:bg-[#00f25c] transition-colors"
              >
                Apply Favorites
              </button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 max-h-64 overflow-y-auto pr-1">
              {CURATED_ANIME.map((anime) => {
                const isSelected = tempFavorites.includes(anime.id);
                return (
                  <div
                    key={anime.id}
                    onClick={() => toggleFavoriteChoice(anime.id)}
                    className={`relative aspect-[2/3] rounded overflow-hidden border-2 cursor-pointer transition-all ${
                      isSelected ? 'border-[#00e054] scale-95 shadow-[0_0_12px_rgba(0,224,84,0.3)]' : 'border-[#2c3440] opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={anime.posterUrl} alt="" className="w-full h-full object-cover" />
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-[#00e054] text-[#14181c] flex items-center justify-center shadow">
                        <Check className="w-3.5 h-3.5 stroke-[3]" />
                      </div>
                    )}
                    <div className="absolute inset-x-0 bottom-0 p-1 bg-black/80 text-[10px] text-white truncate font-mono">
                      {anime.title}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </section>

      {/* RECHARTS STATS SECTION: FAVORITE GENRES & TOTAL WATCH TIME */}
      <ProfileStatsCharts logs={logs} />

      {/* RATINGS DISTRIBUTION HISTOGRAM */}
      <section className="space-y-4">
        <div className="border-b border-[#242c34] pb-2">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-white">
            Ratings Distribution
          </h2>
          <p className="text-xs text-[#89a] font-mono mt-0.5">
            How you score films and series on the 0.5 – 5.0 star scale.
          </p>
        </div>

        <div className="p-6 rounded-xl bg-[#191d22] border border-[#2c3440]">
          <div className="flex items-end justify-between gap-2 h-36 pt-4">
            {ratingHistogram.map((item) => {
              const heightPercent = Math.max(6, Math.round((item.count / maxHistogramCount) * 100));

              return (
                <div
                  key={item.star}
                  className="flex-1 flex flex-col items-center justify-end h-full group"
                  title={`${item.star} Stars: ${item.count} anime logged`}
                >
                  <span className="text-[10px] font-mono text-[#00e054] mb-1 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                    {item.count}
                  </span>
                  <div
                    className="w-full max-w-[28px] rounded-t-sm bg-[#2c3440] group-hover:bg-[#00e054] transition-all duration-200"
                    style={{ height: `${heightPercent}%` }}
                  />
                  <span className="text-[11px] font-mono text-[#89a] mt-2 tabular-nums">
                    {item.star}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* WATCH HISTORY TIMELINE JOURNEY */}
      <section className="space-y-4">
        <WatchHistoryTimeline
          logs={logs}
          onSelectAnime={onSelectAnime}
          onOpenLogModal={(anime, log) => onQuickLog(anime || CURATED_ANIME[0])}
        />
      </section>

      {/* DATA BACKUP & EXPORT (LETTERBOXD DIARY EXPORT) */}
      <section className="p-6 rounded-xl bg-[#191d22] border border-[#2c3440] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-sm font-semibold text-white">Otakuboxd Data & Diary Backup</h3>
          <p className="text-xs text-[#89a] mt-0.5">
            Export your complete diary logs, watchlist, reviews, and custom lists to JSON.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExportData}
            className="px-3.5 py-2 rounded-lg bg-[#242c34] hover:bg-[#2c3440] text-white text-xs font-medium flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export JSON</span>
          </button>

          <label className="px-3.5 py-2 rounded-lg bg-[#242c34] hover:bg-[#2c3440] text-white text-xs font-medium flex items-center gap-1.5 cursor-pointer transition-colors">
            <Upload className="w-3.5 h-3.5" />
            <span>Import JSON</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </section>

    </div>
  );
};
