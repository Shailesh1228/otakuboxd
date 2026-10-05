import { Anime, AnimeFormat } from '../types/anime';
import { CURATED_ANIME } from '../data/curatedAnime';

// In-memory cache for all anime encountered during this session
export const ANIME_CACHE = new Map<string, Anime>();

// Seed cache with curated anime
CURATED_ANIME.forEach(a => ANIME_CACHE.set(String(a.id), a));

export function getCachedAnime(id: string | number): Anime | undefined {
  return ANIME_CACHE.get(String(id));
}

export function cacheAnime(anime: Anime): void {
  ANIME_CACHE.set(String(anime.id), anime);
}

// Map Jikan object to Anime interface
function mapJikanToAnime(item: any): Anime {
  let format: AnimeFormat = 'TV';
  if (item.type === 'Movie') format = 'Movie';
  else if (item.type === 'OVA') format = 'OVA';
  else if (item.type === 'ONA') format = 'ONA';
  else if (item.type === 'Special') format = 'Special';

  const genres: string[] = [];
  if (item.genres && Array.isArray(item.genres)) {
    genres.push(...item.genres.map((g: any) => g.name));
  }
  if (item.themes && Array.isArray(item.themes)) {
    genres.push(...item.themes.map((t: any) => t.name));
  }
  if (item.demographics && Array.isArray(item.demographics)) {
    genres.push(...item.demographics.map((d: any) => d.name));
  }

  const studio = item.studios?.[0]?.name || 'Unknown Studio';
  // convert MAL 10-scale to 5-scale
  const score = item.score ? Number((item.score / 2).toFixed(2)) : 4.0;

  const anime: Anime = {
    id: `mal-${item.mal_id}`,
    title: item.title_english || item.title,
    romajiTitle: item.title,
    japaneseTitle: item.title_japanese || '',
    format,
    episodes: item.episodes || 1,
    duration: item.duration || (format === 'Movie' ? '110 min' : '24 min'),
    year: item.year || (item.aired?.from ? new Date(item.aired.from).getFullYear() : 2022),
    season: item.season ? `${item.season.charAt(0).toUpperCase() + item.season.slice(1)} ${item.year || ''}`.trim() : undefined,
    studio,
    director: undefined,
    genres: genres.length > 0 ? genres : ['Animation'],
    synopsis: item.synopsis || 'No English synopsis available for this title.',
    posterUrl: item.images?.jpg?.large_image_url || item.images?.jpg?.image_url || '',
    backdropUrl: item.images?.jpg?.large_image_url || '',
    averageRating: score,
    ratingsCount: item.members || item.scored_by || 2400,
    status: item.airing ? 'Currently Airing' : 'Finished Airing'
  };

  cacheAnime(anime);
  return anime;
}

// Fetch Top Anime from Jikan
export async function fetchTopAnime(page: number = 1, filter?: string): Promise<{ data: Anime[]; hasNextPage: boolean }> {
  try {
    const filterParam = filter ? `&filter=${filter}` : '';
    const res = await fetch(`https://api.jikan.moe/v4/top/anime?page=${page}&limit=24&sfw=true${filterParam}`);
    
    if (!res.ok) {
      throw new Error(`Jikan top error: ${res.status}`);
    }

    const json = await res.json();
    if (!json.data || !Array.isArray(json.data)) {
      return { data: CURATED_ANIME.slice((page - 1) * 24, page * 24), hasNextPage: false };
    }

    const animeList = json.data.map(mapJikanToAnime);
    const hasNext = json.pagination?.has_next_page ?? false;
    return { data: animeList, hasNextPage: hasNext };
  } catch (err) {
    console.warn('Jikan fetchTopAnime fallback to curated library', err);
    const start = (page - 1) * 12;
    const sliced = CURATED_ANIME.slice(start, start + 12);
    return { data: sliced, hasNextPage: start + 12 < CURATED_ANIME.length };
  }
}

// Fetch Seasonal Airing Anime from Jikan
export async function fetchSeasonalAnime(page: number = 1): Promise<{ data: Anime[]; hasNextPage: boolean }> {
  try {
    const res = await fetch(`https://api.jikan.moe/v4/seasons/now?page=${page}&limit=24&sfw=true`);
    if (!res.ok) {
      throw new Error(`Jikan seasons error: ${res.status}`);
    }

    const json = await res.json();
    if (!json.data || !Array.isArray(json.data)) {
      return { data: CURATED_ANIME.slice(0, 12), hasNextPage: false };
    }

    const animeList = json.data.map(mapJikanToAnime);
    const hasNext = json.pagination?.has_next_page ?? false;
    return { data: animeList, hasNextPage: hasNext };
  } catch (err) {
    console.warn('Jikan fetchSeasonalAnime fallback', err);
    return { data: CURATED_ANIME.slice(0, 12), hasNextPage: false };
  }
}

// Live Search Any Anime on Jikan API
export async function searchJikanAnime(
  query: string,
  page: number = 1,
  type?: string
): Promise<{ data: Anime[]; hasNextPage: boolean }> {
  const trimmed = query.trim();
  if (!trimmed) {
    return { data: CURATED_ANIME.slice(0, 24), hasNextPage: CURATED_ANIME.length > 24 };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4500);

    const typeParam = type && type !== 'All Formats' ? `&type=${type.toLowerCase()}` : '';
    const res = await fetch(
      `https://api.jikan.moe/v4/anime?q=${encodeURIComponent(trimmed)}&page=${page}&limit=24&sfw=true${typeParam}`,
      { signal: controller.signal }
    );
    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`Jikan search error ${res.status}`);
    }

    const json = await res.json();
    if (!json.data || !Array.isArray(json.data)) {
      return { data: fallbackSearch(trimmed), hasNextPage: false };
    }

    const results = json.data.map(mapJikanToAnime);
    const hasNext = json.pagination?.has_next_page ?? false;
    return { data: results, hasNextPage: hasNext };
  } catch (err) {
    console.warn('Jikan searchJikanAnime fallback', err);
    return { data: fallbackSearch(trimmed), hasNextPage: false };
  }
}

function fallbackSearch(query: string): Anime[] {
  const q = query.toLowerCase();
  return CURATED_ANIME.filter(anime =>
    anime.title.toLowerCase().includes(q) ||
    (anime.romajiTitle && anime.romajiTitle.toLowerCase().includes(q)) ||
    (anime.japaneseTitle && anime.japaneseTitle.includes(q)) ||
    anime.studio.toLowerCase().includes(q) ||
    anime.genres.some(g => g.toLowerCase().includes(q))
  );
}
