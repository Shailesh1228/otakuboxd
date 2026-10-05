export type AnimeFormat = 'TV' | 'Movie' | 'OVA' | 'ONA' | 'Special';

export interface Anime {
  id: string | number;
  title: string;
  romajiTitle?: string;
  japaneseTitle?: string;
  format: AnimeFormat;
  episodes: number | null;
  duration?: string;
  year: number;
  season?: string;
  studio: string;
  director?: string;
  genres: string[];
  synopsis: string;
  posterUrl: string;
  backdropUrl?: string;
  averageRating: number; // 0 to 5 scale
  ratingsCount: number;
  status: 'Finished Airing' | 'Currently Airing' | 'Not yet aired';
}

export interface AnimeLog {
  id: string;
  animeId: string | number;
  animeTitle: string;
  animePoster: string;
  animeYear: number;
  animeFormat: AnimeFormat;
  watchedDate: string; // YYYY-MM-DD
  rating: number; // 0 to 5 in 0.5 steps
  isLiked: boolean;
  isRewatch: boolean;
  reviewText: string;
  containsSpoilers: boolean;
  tags: string[];
  progress?: string; // e.g. "Completed", "Ep 1-12", "Rewatch #2"
  createdAt: string;
}

export interface AnimeList {
  id: string;
  title: string;
  description: string;
  coverImage?: string;
  items: {
    animeId: string | number;
    notes?: string;
  }[];
  authorName: string;
  createdAt: string;
  likesCount: number;
}

export interface UserProfile {
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  favoriteFourIds: (string | number)[];
  location: string;
  joinedDate: string;
  pinnedReviewId?: string;
}

export interface SocialComment {
  id: string;
  authorUsername: string;
  authorDisplayName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface SocialActivity {
  id: string;
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  actionType: 'review' | 'rating' | 'liked' | 'watchlist' | 'list_added';
  animeId: string | number;
  animeTitle: string;
  animeYear: number;
  animeFormat: AnimeFormat;
  animePoster: string;
  rating?: number; // 0.5 to 5.0
  isLiked?: boolean;
  isRewatch?: boolean;
  reviewText?: string;
  containsSpoilers?: boolean;
  tags?: string[];
  listTitle?: string;
  timestamp: string;
  likesCount: number;
  likedByCurrentUser?: boolean;
  comments: SocialComment[];
}

export interface SocialUser {
  id: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  isFollowing: boolean;
  followersCount: number;
  recentAnimeTitle: string;
}

export type ActiveTab = 'explore' | 'activity' | 'diary' | 'reviews' | 'lists' | 'watchlist' | 'profile';

