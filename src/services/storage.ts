import { AnimeLog, AnimeList, UserProfile } from '../types/anime';
import defaultAvatar from '../assets/images/avatar_otaku_cinephile_1791173403875.jpg';

const STORAGE_KEYS = {
  LOGS: 'otakuboxd_logs_v1',
  WATCHLIST: 'otakuboxd_watchlist_v1',
  LIKED: 'otakuboxd_liked_v1',
  LISTS: 'otakuboxd_lists_v1',
  PROFILE: 'otakuboxd_profile_v1',
};

// Seed initial profile
const INITIAL_PROFILE: UserProfile = {
  username: 'cinephile_otaku',
  displayName: 'Ren Kurosawa',
  avatarUrl: defaultAvatar,
  bio: 'Chasing the ghost in the machine. 35mm cel animation purist, Makoto Shinkai tears survivor, and Satoshi Kon disciple.',
  favoriteFourIds: [2, 4, 1, 8], // Evangelion, Akira, Spirited Away, Frieren
  location: 'Tokyo / Kyoto',
  joinedDate: 'Joined April 2024',
};

// Seed initial diary entries
const INITIAL_LOGS: AnimeLog[] = [
  {
    id: 'log-1',
    animeId: 8,
    animeTitle: 'Frieren: Beyond Journey’s End',
    animePoster: 'https://cdn.myanimelist.net/images/anime/1015/138075.jpg',
    animeYear: 2023,
    animeFormat: 'TV',
    watchedDate: '2026-10-02',
    rating: 5.0,
    isLiked: true,
    isRewatch: false,
    reviewText: 'A quiet, contemplative meditation on the relentless passage of time and the weight of fleeting human connections. The pacing is absolute perfection—every sunset and quiet conversation feels earned. Keiichirou Saitou crafted a modern masterpiece.',
    containsSpoilers: false,
    tags: ['masterpiece', 'fantasy', 'cry-warning', 'madhouse-peak'],
    progress: '28/28 Episodes',
    createdAt: '2026-10-02T19:30:00Z'
  },
  {
    id: 'log-2',
    animeId: 2,
    animeTitle: 'Neon Genesis Evangelion',
    animePoster: '/src/assets/images/poster_fantasy_mecha_odyssey_1791173393165.jpg',
    animeYear: 1995,
    animeFormat: 'TV',
    watchedDate: '2026-09-28',
    rating: 5.0,
    isLiked: true,
    isRewatch: true,
    reviewText: 'Fourth time revisiting this series. Every time I watch episodes 25 & 26, the existential catharsis hits harder. The raw, desperate humanity poured onto the animation cells is something we may never witness in modern production again.',
    containsSpoilers: false,
    tags: ['existential', 'gainax', 'rewatch-ritual', 'anno'],
    progress: 'Rewatch #4',
    createdAt: '2026-09-28T22:15:00Z'
  },
  {
    id: 'log-3',
    animeId: 4,
    animeTitle: 'Akira',
    animePoster: '/src/assets/images/poster_cyberpunk_neo_tokyo_1791173380206.jpg',
    animeYear: 1988,
    animeFormat: 'Movie',
    watchedDate: '2026-09-14',
    rating: 4.5,
    isLiked: true,
    isRewatch: true,
    reviewText: 'Saw the 4K IMAX restoration. The sheer density of hand-drawn light streaks, glass shards, and exhaust smoke in the opening bike chase remains unmatched by any digital workflow in history.',
    containsSpoilers: false,
    tags: ['cyberpunk', 'imax', 'hand-drawn-sakuga'],
    progress: 'Film Completed',
    createdAt: '2026-09-14T20:00:00Z'
  },
  {
    id: 'log-4',
    animeId: 12,
    animeTitle: 'Perfect Blue',
    animePoster: 'https://cdn.myanimelist.net/images/anime/11/73507.jpg',
    animeYear: 1997,
    animeFormat: 'Movie',
    watchedDate: '2026-08-30',
    rating: 4.5,
    isLiked: true,
    isRewatch: false,
    reviewText: 'Satoshi Kon’s match cuts are a masterclass in psychological disassociation. The blurring of television rehearsals, traumatic illusions, and visceral stalker terror is as sharp today as in 1997.',
    containsSpoilers: false,
    tags: ['satoshi-kon', 'thriller', 'editing-genius'],
    progress: 'Film Completed',
    createdAt: '2026-08-30T21:40:00Z'
  },
  {
    id: 'log-5',
    animeId: 17,
    animeTitle: 'Bocchi the Rock!',
    animePoster: 'https://cdn.myanimelist.net/images/anime/1448/127956.jpg',
    animeYear: 2022,
    animeFormat: 'TV',
    watchedDate: '2026-08-11',
    rating: 4.5,
    isLiked: true,
    isRewatch: false,
    reviewText: 'The creative multimedia animation segments (claymation, low-poly Blender models, paper cutouts) to visualize social anxiety had me laughing and feeling profoundly attacked at the same time.',
    containsSpoilers: false,
    tags: ['comedy', 'music', 'relatable-pain'],
    progress: '12/12 Episodes',
    createdAt: '2026-08-11T18:00:00Z'
  },
  {
    id: 'log-6',
    animeId: 7,
    animeTitle: 'Your Name.',
    animePoster: '/src/assets/images/hero_cinematic_anime_sky_1791173367541.jpg',
    animeYear: 2016,
    animeFormat: 'Movie',
    watchedDate: '2026-07-20',
    rating: 5.0,
    isLiked: true,
    isRewatch: true,
    reviewText: 'That twilight rooftop scene on the crater edge with the Radwimps score hitting the crescendo will always choke me up. Peak commercial anime cinema.',
    containsSpoilers: false,
    tags: ['shinkai', 'radwimps', 'tears'],
    progress: 'Film Completed',
    createdAt: '2026-07-20T23:10:00Z'
  }
];

// Initial custom lists
const INITIAL_LISTS: AnimeList[] = [
  {
    id: 'list-1',
    title: 'Top Tier 90s Cel Animation Masterpieces',
    description: 'The golden zenith of analogue celluloid craft before digital ink and paint took over the industry.',
    authorName: 'Ren Kurosawa',
    createdAt: '2026-08-01',
    likesCount: 1420,
    items: [
      { animeId: 2, notes: 'The defining deconstruction of the super robot genre.' },
      { animeId: 4, notes: 'Otomo pushed Tokyo Movie Shinsha to the literal brink of human capability.' },
      { animeId: 3, notes: 'Yoko Kanno + Shinichiro Watanabe jazz neo-noir perfection.' },
      { animeId: 10, notes: 'Miyazaki’s darkest, most morally complicated ecological epic.' },
      { animeId: 12, notes: 'Editing wizardry that Hollywood still copies.' }
    ]
  },
  {
    id: 'list-2',
    title: 'Existential Crises & Heavy Catharsis',
    description: 'Films and series that will leave you staring at your ceiling at 3 AM.',
    authorName: 'Ren Kurosawa',
    createdAt: '2026-08-15',
    likesCount: 890,
    items: [
      { animeId: 2, notes: 'Congratulations.' },
      { animeId: 8, notes: 'The quiet ache of living longer than those you love.' },
      { animeId: 14, notes: 'Earned forgiveness and hearing the sound of someone else’s voice.' },
      { animeId: 18, notes: 'Can all human lives truly be weighed equally?' }
    ]
  }
];

const INITIAL_WATCHLIST: (string | number)[] = [5, 6, 9, 11, 13, 16];
const INITIAL_LIKED: (string | number)[] = [1, 2, 4, 7, 8, 12, 17];

export const StorageService = {
  getProfile(): UserProfile {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
      return data ? JSON.parse(data) : INITIAL_PROFILE;
    } catch {
      return INITIAL_PROFILE;
    }
  },

  saveProfile(profile: UserProfile): void {
    localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
  },

  getLogs(): AnimeLog[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LOGS);
      return data ? JSON.parse(data) : INITIAL_LOGS;
    } catch {
      return INITIAL_LOGS;
    }
  },

  saveLogs(logs: AnimeLog[]): void {
    localStorage.setItem(STORAGE_KEYS.LOGS, JSON.stringify(logs));
  },

  addLog(newLog: AnimeLog): AnimeLog[] {
    const logs = this.getLogs();
    const updated = [newLog, ...logs];
    this.saveLogs(updated);

    // If rated or liked, automatically sync with liked list if liked is checked
    if (newLog.isLiked) {
      this.toggleLiked(newLog.animeId, true);
    }
    // Remove from watchlist if logged as completed
    this.removeFromWatchlist(newLog.animeId);

    return updated;
  },

  updateLog(updatedLog: AnimeLog): AnimeLog[] {
    const logs = this.getLogs();
    const index = logs.findIndex(l => l.id === updatedLog.id);
    if (index !== -1) {
      logs[index] = updatedLog;
      this.saveLogs(logs);
    }
    return logs;
  },

  deleteLog(logId: string): AnimeLog[] {
    const logs = this.getLogs();
    const updated = logs.filter(l => l.id !== logId);
    this.saveLogs(updated);
    return updated;
  },

  getWatchlist(): (string | number)[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WATCHLIST);
      return data ? JSON.parse(data) : INITIAL_WATCHLIST;
    } catch {
      return INITIAL_WATCHLIST;
    }
  },

  toggleWatchlist(animeId: string | number): boolean {
    const list = this.getWatchlist();
    const idStr = String(animeId);
    const exists = list.some(id => String(id) === idStr);
    let updated: (string | number)[];
    if (exists) {
      updated = list.filter(id => String(id) !== idStr);
    } else {
      updated = [animeId, ...list];
    }
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(updated));
    return !exists;
  },

  removeFromWatchlist(animeId: string | number): void {
    const list = this.getWatchlist();
    const idStr = String(animeId);
    const updated = list.filter(id => String(id) !== idStr);
    localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(updated));
  },

  getLiked(): (string | number)[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LIKED);
      return data ? JSON.parse(data) : INITIAL_LIKED;
    } catch {
      return INITIAL_LIKED;
    }
  },

  toggleLiked(animeId: string | number, forceState?: boolean): boolean {
    const list = this.getLiked();
    const idStr = String(animeId);
    const exists = list.some(id => String(id) === idStr);
    const shouldAdd = forceState !== undefined ? forceState : !exists;

    let updated: (string | number)[];
    if (shouldAdd && !exists) {
      updated = [animeId, ...list];
    } else if (!shouldAdd && exists) {
      updated = list.filter(id => String(id) !== idStr);
    } else {
      updated = list;
    }
    localStorage.setItem(STORAGE_KEYS.LIKED, JSON.stringify(updated));
    return shouldAdd;
  },

  getLists(): AnimeList[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LISTS);
      return data ? JSON.parse(data) : INITIAL_LISTS;
    } catch {
      return INITIAL_LISTS;
    }
  },

  saveLists(lists: AnimeList[]): void {
    localStorage.setItem(STORAGE_KEYS.LISTS, JSON.stringify(lists));
  },

  createList(title: string, description: string, initialAnimeIds: (string | number)[]): AnimeList[] {
    const lists = this.getLists();
    const profile = this.getProfile();
    const newList: AnimeList = {
      id: `list-${Date.now()}`,
      title,
      description,
      authorName: profile.displayName,
      createdAt: new Date().toISOString().split('T')[0],
      likesCount: 1,
      items: initialAnimeIds.map(id => ({ animeId: id }))
    };
    const updated = [newList, ...lists];
    this.saveLists(updated);
    return updated;
  },

  addAnimeToList(listId: string, animeId: string | number, note?: string): void {
    const lists = this.getLists();
    const list = lists.find(l => l.id === listId);
    if (list) {
      const idStr = String(animeId);
      if (!list.items.some(item => String(item.animeId) === idStr)) {
        list.items.push({ animeId, notes: note });
        this.saveLists(lists);
      }
    }
  },

  removeAnimeFromList(listId: string, animeId: string | number): void {
    const lists = this.getLists();
    const list = lists.find(l => l.id === listId);
    if (list) {
      const idStr = String(animeId);
      list.items = list.items.filter(item => String(item.animeId) !== idStr);
      this.saveLists(lists);
    }
  },

  exportData(): string {
    const exportObj = {
      profile: this.getProfile(),
      logs: this.getLogs(),
      watchlist: this.getWatchlist(),
      liked: this.getLiked(),
      lists: this.getLists(),
      exportedAt: new Date().toISOString()
    };
    return JSON.stringify(exportObj, null, 2);
  },

  importData(jsonString: string): boolean {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.profile) this.saveProfile(parsed.profile);
      if (Array.isArray(parsed.logs)) this.saveLogs(parsed.logs);
      if (Array.isArray(parsed.watchlist)) localStorage.setItem(STORAGE_KEYS.WATCHLIST, JSON.stringify(parsed.watchlist));
      if (Array.isArray(parsed.liked)) localStorage.setItem(STORAGE_KEYS.LIKED, JSON.stringify(parsed.liked));
      if (Array.isArray(parsed.lists)) this.saveLists(parsed.lists);
      return true;
    } catch (e) {
      console.error('Import failed', e);
      return false;
    }
  }
};
