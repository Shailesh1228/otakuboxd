import { SocialActivity, SocialUser } from '../types/anime';
import avatarRen from '../assets/images/avatar_otaku_cinephile_1791173403875.jpg';
import cyberpunkPoster from '../assets/images/poster_cyberpunk_neo_tokyo_1791173380206.jpg';
import mechaPoster from '../assets/images/poster_fantasy_mecha_odyssey_1791173393165.jpg';
import heroSky from '../assets/images/hero_cinematic_anime_sky_1791173367541.jpg';

export const MOCK_SOCIAL_USERS: SocialUser[] = [
  {
    id: 'u-1',
    username: 'mariko_sakuga',
    displayName: 'Mariko Takahashi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Kyoto Seika animation researcher. Archiving 35mm cel cuts & Yutaka Nakamura keyframes.',
    isFollowing: true,
    followersCount: 3840,
    recentAnimeTitle: 'Princess Mononoke'
  },
  {
    id: 'u-2',
    username: 'kenji_film',
    displayName: 'Kenji Sato',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Writing for Kinema Junpo & Otakuboxd. 2,600+ anime logged. Satoshi Kon purist.',
    isFollowing: true,
    followersCount: 5210,
    recentAnimeTitle: 'Steins;Gate'
  },
  {
    id: 'u-3',
    username: 'daisuke_k',
    displayName: 'Daisuke Kanda',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Mecha & 90s cyberpunk head. Evangelion synchronization rate 89%.',
    isFollowing: false,
    followersCount: 1980,
    recentAnimeTitle: 'Cyberpunk: Edgerunners'
  },
  {
    id: 'u-4',
    username: 'yuki_cinema',
    displayName: 'Yuki Minami',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    bio: 'Kyoto Animation devotee. Searching for truth in hand-drawn eyes.',
    isFollowing: true,
    followersCount: 4120,
    recentAnimeTitle: 'A Silent Voice'
  },
  {
    id: 'u-5',
    username: 'chiyo_otaku',
    displayName: 'Chiyo Shimizu',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Bocchi bassist in training. Slice-of-life connoisseur. ☕',
    isFollowing: false,
    followersCount: 1450,
    recentAnimeTitle: 'Bocchi the Rock!'
  }
];

export const INITIAL_SOCIAL_ACTIVITIES: SocialActivity[] = [
  {
    id: 'act-1',
    userId: 'u-1',
    username: 'mariko_sakuga',
    displayName: 'Mariko Takahashi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    actionType: 'review',
    animeId: 10,
    animeTitle: 'Princess Mononoke',
    animeYear: 1997,
    animeFormat: 'Movie',
    animePoster: 'https://cdn.myanimelist.net/images/anime/7/75919.jpg',
    rating: 5.0,
    isLiked: true,
    isRewatch: true,
    reviewText: 'Revisiting the 35mm print at the National Film Archive. The organic weight of the Tatarigami demon in the opening five minutes remains the absolute pinnacle of hand-drawn cel craftsmanship. Not a single digital shortcut, just pure muscle memory and visceral ecological terror.',
    containsSpoilers: false,
    tags: ['ghibli', 'miyazaki', '35mm', 'sakuga-masterpiece'],
    timestamp: '2 hours ago',
    likesCount: 64,
    likedByCurrentUser: false,
    comments: [
      {
        id: 'c-1',
        authorUsername: 'kenji_film',
        authorDisplayName: 'Kenji Sato',
        authorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        text: 'That opening sequence took over a year just for Miyazaki and Ando to personally correct every frame of the tendrils.',
        createdAt: '1 hour ago'
      },
      {
        id: 'c-2',
        authorUsername: 'cinephile_otaku',
        authorDisplayName: 'Ren Kurosawa',
        authorAvatar: avatarRen,
        text: 'The Joe Hisaishi score when Ashitaka leaves Emishi village never fails to give me chills.',
        createdAt: '45 mins ago'
      }
    ]
  },
  {
    id: 'act-2',
    userId: 'u-3',
    username: 'daisuke_k',
    displayName: 'Daisuke Kanda',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    actionType: 'review',
    animeId: 9,
    animeTitle: 'Cyberpunk: Edgerunners',
    animeYear: 2022,
    animeFormat: 'ONA',
    animePoster: cyberpunkPoster,
    rating: 4.5,
    isLiked: true,
    isRewatch: false,
    reviewText: 'Hiroyuki Imaishi stripped of all creative restraint. The color script is violent, kinetic, and completely unapologetic. That final descent down Arasaka Tower with "I Really Want to Stay at Your House" playing broke every single person who watched it.',
    containsSpoilers: false,
    tags: ['trigger', 'imaishi', 'night-city', 'ost-tearjerker'],
    timestamp: '5 hours ago',
    likesCount: 118,
    likedByCurrentUser: true,
    comments: [
      {
        id: 'c-3',
        authorUsername: 'yuki_cinema',
        authorDisplayName: 'Yuki Minami',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
        text: 'Still haven\'t recovered from the moon sequence.',
        createdAt: '3 hours ago'
      }
    ]
  },
  {
    id: 'act-3',
    userId: 'u-4',
    username: 'yuki_cinema',
    displayName: 'Yuki Minami',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    actionType: 'review',
    animeId: 14,
    animeTitle: 'A Silent Voice',
    animeYear: 2016,
    animeFormat: 'Movie',
    animePoster: 'https://cdn.myanimelist.net/images/anime/1122/96481.jpg',
    rating: 5.0,
    isLiked: true,
    isRewatch: true,
    reviewText: 'Naoko Yamada’s camera doesn’t just observe characters—it observes their posture, the tremor in their fingers, and the floor they stare at when they can’t look someone in the eyes. The moment the blue crosses fall away in the finale is the purest depiction of human catharsis in animation history.',
    containsSpoilers: false,
    tags: ['kyoto-animation', 'naoko-yamada', 'tears', 'empathy'],
    timestamp: 'Yesterday',
    likesCount: 89,
    likedByCurrentUser: false,
    comments: []
  },
  {
    id: 'act-4',
    userId: 'u-2',
    username: 'kenji_film',
    displayName: 'Kenji Sato',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    actionType: 'rating',
    animeId: 11,
    animeTitle: 'Steins;Gate',
    animeYear: 2011,
    animeFormat: 'TV',
    animePoster: 'https://cdn.myanimelist.net/images/anime/1935/127974.jpg',
    rating: 4.5,
    isLiked: true,
    isRewatch: false,
    reviewText: 'A masterclass in structural causality. The tonal pivot at episode 12 remains one of the sharpest narrative shifts in television anime history. Okabe\'s descent from chunibyo delusion to genuine existential trauma is brilliantly voice-acted by Mamoru Miyano.',
    containsSpoilers: true,
    tags: ['sci-fi', 'white-fox', 'time-travel', 'masterpiece'],
    timestamp: 'Yesterday',
    likesCount: 42,
    likedByCurrentUser: false,
    comments: []
  },
  {
    id: 'act-5',
    userId: 'u-5',
    username: 'chiyo_otaku',
    displayName: 'Chiyo Shimizu',
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    actionType: 'liked',
    animeId: 17,
    animeTitle: 'Bocchi the Rock!',
    animeYear: 2022,
    animeFormat: 'TV',
    animePoster: 'https://cdn.myanimelist.net/images/anime/1448/127956.jpg',
    rating: 5.0,
    isLiked: true,
    isRewatch: false,
    reviewText: 'The low-poly Blender model breakdown scene in episode 4 is documentary evidence of my daily social interactions. CloverWorks gave the animators infinite creative freedom and it shows in every single cut.',
    containsSpoilers: false,
    tags: ['comedy', 'music', 'cloverworks', 'kessoku-band'],
    timestamp: '2 days ago',
    likesCount: 95,
    likedByCurrentUser: true,
    comments: []
  },
  {
    id: 'act-6',
    userId: 'u-1',
    username: 'mariko_sakuga',
    displayName: 'Mariko Takahashi',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    actionType: 'list_added',
    animeId: 4,
    animeTitle: 'Akira',
    animeYear: 1988,
    animeFormat: 'Movie',
    animePoster: cyberpunkPoster,
    listTitle: 'Top Tier 90s Cel Animation Masterpieces',
    rating: 5.0,
    isLiked: true,
    timestamp: '3 days ago',
    likesCount: 31,
    likedByCurrentUser: false,
    comments: []
  },
  {
    id: 'act-7',
    userId: 'u-3',
    username: 'daisuke_k',
    displayName: 'Daisuke Kanda',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    actionType: 'watchlist',
    animeId: 2,
    animeTitle: 'Neon Genesis Evangelion',
    animeYear: 1995,
    animeFormat: 'TV',
    animePoster: mechaPoster,
    timestamp: '4 days ago',
    likesCount: 19,
    likedByCurrentUser: false,
    comments: []
  }
];
