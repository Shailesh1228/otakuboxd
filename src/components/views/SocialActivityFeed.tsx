import React, { useState } from 'react';
import { Anime, SocialActivity, SocialUser, UserProfile } from '../../types/anime';
import { StarRating } from '../StarRating';
import { CURATED_ANIME } from '../../data/curatedAnime';
import {
  Heart,
  MessageSquare,
  Repeat,
  AlertCircle,
  Plus,
  UserPlus,
  UserCheck,
  Share2,
  Film,
  Send,
  Sparkles,
  TrendingUp,
  Bookmark
} from 'lucide-react';

interface SocialActivityFeedProps {
  initialActivities: SocialActivity[];
  users: SocialUser[];
  profile: UserProfile;
  onSelectAnime: (anime: Anime) => void;
  onQuickLog: (anime: Anime) => void;
}

export const SocialActivityFeed: React.FC<SocialActivityFeedProps> = ({
  initialActivities,
  users: initialUsers,
  profile,
  onSelectAnime,
  onQuickLog
}) => {
  const [activities, setActivities] = useState<SocialActivity[]>(initialActivities);
  const [users, setUsers] = useState<SocialUser[]>(initialUsers);
  const [activeFilter, setActiveFilter] = useState<'all' | 'reviews' | 'ratings' | 'following'>('all');
  const [expandedComments, setExpandedComments] = useState<{ [actId: string]: boolean }>({
    'act-1': true // default open first post's discussion to show vibrant social chatter
  });
  const [commentInputs, setCommentInputs] = useState<{ [actId: string]: string }>({});
  const [revealedSpoilers, setRevealedSpoilers] = useState<{ [actId: string]: boolean }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Toggle user follow state
  const handleToggleFollow = (userId: string) => {
    setUsers(prev => prev.map(u => {
      if (u.id === userId) {
        const nextState = !u.isFollowing;
        return {
          ...u,
          isFollowing: nextState,
          followersCount: nextState ? u.followersCount + 1 : u.followersCount - 1
        };
      }
      return u;
    }));
  };

  // Toggle like on an activity
  const handleToggleLikeActivity = (actId: string) => {
    setActivities(prev => prev.map(act => {
      if (act.id === actId) {
        const isLiked = !act.likedByCurrentUser;
        return {
          ...act,
          likedByCurrentUser: isLiked,
          likesCount: isLiked ? act.likesCount + 1 : act.likesCount - 1
        };
      }
      return act;
    }));
  };

  // Toggle comments expanded
  const handleToggleComments = (actId: string) => {
    setExpandedComments(prev => ({ ...prev, [actId]: !prev[actId] }));
  };

  // Submit comment
  const handleAddComment = (actId: string, e: React.FormEvent) => {
    e.preventDefault();
    const text = (commentInputs[actId] || '').trim();
    if (!text) return;

    setActivities(prev => prev.map(act => {
      if (act.id === actId) {
        const newComment = {
          id: `c-${Date.now()}`,
          authorUsername: profile.username,
          authorDisplayName: profile.displayName,
          authorAvatar: profile.avatarUrl,
          text,
          createdAt: 'Just now'
        };
        return {
          ...act,
          comments: [...act.comments, newComment]
        };
      }
      return act;
    }));

    // Clear input & ensure comments are visible
    setCommentInputs(prev => ({ ...prev, [actId]: '' }));
    setExpandedComments(prev => ({ ...prev, [actId]: true }));
  };

  const handleShare = (actId: string) => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedId(actId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Resolve anime object for click handler
  const resolveAnime = (act: SocialActivity): Anime => {
    const found = CURATED_ANIME.find(a => String(a.id) === String(act.animeId));
    if (found) return found;
    return {
      id: act.animeId,
      title: act.animeTitle,
      format: act.animeFormat,
      year: act.animeYear,
      episodes: 1,
      studio: 'Studio',
      genres: [],
      synopsis: '',
      posterUrl: act.animePoster,
      averageRating: act.rating || 4.5,
      ratingsCount: 1,
      status: 'Finished Airing'
    };
  };

  // Filter activities
  const filteredActivities = activities.filter(act => {
    if (activeFilter === 'reviews') {
      return act.actionType === 'review';
    }
    if (activeFilter === 'ratings') {
      return act.actionType === 'rating' || act.actionType === 'review';
    }
    if (activeFilter === 'following') {
      const user = users.find(u => u.id === act.userId);
      return user?.isFollowing;
    }
    return true;
  });

  return (
    <div className="space-y-8 pb-16">
      
      {/* Feed Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#242c34] pb-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-white tracking-tight font-display">
              Otaku Activity Feed
            </h1>
            <span className="w-2 h-2 rounded-full bg-[#00e054] inline-block animate-pulse" />
          </div>
          <p className="text-xs text-[#89a] mt-1 font-mono">
            Recent logs, star ratings, and film essays from people in the anime community.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-[#191d22] rounded-lg border border-[#2c3440] self-start md:self-auto overflow-x-auto">
          {[
            { id: 'all', label: 'All Activity' },
            { id: 'reviews', label: 'Reviews' },
            { id: 'ratings', label: 'Ratings & Logs' },
            { id: 'following', label: 'Following' }
          ].map(tab => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap ${
                activeFilter === tab.id
                  ? 'bg-[#00e054] text-[#14181c] shadow'
                  : 'text-[#89a] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Grid: Feed stream on left (8 cols), Suggestions & Community widgets on right (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Activity Cards Stream */}
        <div className="lg:col-span-8 space-y-6">
          {filteredActivities.length > 0 ? (
            filteredActivities.map((act) => {
              const anime = resolveAnime(act);
              const user = users.find(u => u.id === act.userId);
              const isFollowing = user ? user.isFollowing : false;
              const isCommentsOpen = !!expandedComments[act.id];
              const isSpoilerRevealed = !!revealedSpoilers[act.id];

              return (
                <article
                  key={act.id}
                  className="p-5 sm:p-6 rounded-xl bg-[#191d22] border border-[#2c3440] hover:border-[#384452] transition-colors space-y-4"
                >
                  
                  {/* Activity Post Header: User, Action Verb, Time & Follow button */}
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-[#2c3440] bg-[#14181c] shrink-0">
                        <img
                          src={act.avatarUrl}
                          alt={act.displayName}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-baseline gap-1 text-xs">
                          <span className="font-semibold text-white truncate">
                            {act.displayName}
                          </span>
                          <span className="text-[#678] font-mono text-[11px]">
                            @{act.username}
                          </span>
                        </div>

                        {/* Action Verb Description */}
                        <div className="flex items-center gap-1.5 text-xs text-[#89a] mt-0.5">
                          {act.actionType === 'review' && (
                            <span>reviewed</span>
                          )}
                          {act.actionType === 'rating' && (
                            <span>rated</span>
                          )}
                          {act.actionType === 'liked' && (
                            <span className="flex items-center gap-1 text-[#ff4b60]">
                              <Heart className="w-3 h-3 fill-current inline" /> liked
                            </span>
                          )}
                          {act.actionType === 'watchlist' && (
                            <span>added to watchlist</span>
                          )}
                          {act.actionType === 'list_added' && (
                            <span>added to list <strong className="text-white font-normal">"{act.listTitle}"</strong></span>
                          )}
                          <span aria-hidden="true" className="text-[#445566]">·</span>
                          <span className="font-mono text-[#678] text-[11px]">{act.timestamp}</span>
                        </div>
                      </div>
                    </div>

                    {/* Follow/Unfollow Toggle */}
                    {user && (
                      <button
                        type="button"
                        onClick={() => handleToggleFollow(user.id)}
                        className={`px-2.5 py-1 rounded text-[11px] font-mono font-medium border flex items-center gap-1 transition-colors shrink-0 ${
                          isFollowing
                            ? 'bg-[#14181c] border-[#2c3440] text-[#89a] hover:text-white hover:border-[#ff4b60]'
                            : 'bg-[#00e054]/15 border-[#00e054]/30 text-[#00e054] hover:bg-[#00e054] hover:text-[#14181c]'
                        }`}
                        title={isFollowing ? 'Unfollow' : 'Follow'}
                      >
                        {isFollowing ? (
                          <>
                            <UserCheck className="w-3 h-3" />
                            <span>Following</span>
                          </>
                        ) : (
                          <>
                            <UserPlus className="w-3 h-3" />
                            <span>Follow</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Activity Body: Poster + Film Information + Review Prose */}
                  <div className="flex flex-col sm:flex-row gap-4 p-3.5 rounded-lg bg-[#14181c] border border-[#242c34]">
                    
                    {/* Anime Poster Thumbnail */}
                    <div
                      onClick={() => onSelectAnime(anime)}
                      className="w-20 sm:w-24 aspect-[2/3] rounded bg-[#1f2328] border border-[#2c3440] overflow-hidden shrink-0 cursor-pointer hover:border-[#00e054] transition-colors shadow"
                    >
                      {act.animePoster ? (
                        <img
                          src={act.animePoster}
                          alt={act.animeTitle}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Film className="w-6 h-6 m-auto text-[#678]" />
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <div>
                          <h3
                            onClick={() => onSelectAnime(anime)}
                            className="text-base font-bold text-white hover:text-[#00e054] transition-colors cursor-pointer"
                          >
                            {act.animeTitle}
                          </h3>
                          <div className="flex items-center gap-2 text-xs text-[#89a] font-mono mt-0.5">
                            <span>{act.animeYear}</span>
                            <span>·</span>
                            <span>{act.animeFormat}</span>
                          </div>
                        </div>

                        {/* Stars & Badges */}
                        <div className="flex items-center gap-2">
                          {act.rating !== undefined && act.rating > 0 && (
                            <StarRating rating={act.rating} size="sm" showNumeric />
                          )}
                          {act.isLiked && (
                            <Heart className="w-4 h-4 text-[#ff4b60] fill-current" />
                          )}
                          {act.isRewatch && (
                            <span title="Rewatch">
                              <Repeat className="w-4 h-4 text-[#00e054]" />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Review Text with Spoiler Shield */}
                      {act.reviewText && (
                        <div className="pt-1">
                          {act.containsSpoilers && !isSpoilerRevealed ? (
                            <div
                              onClick={() => setRevealedSpoilers(p => ({ ...p, [act.id]: true }))}
                              className="p-3 rounded bg-[#1b2228] border border-[#ff8000]/30 text-xs text-[#ff8000] cursor-pointer hover:bg-[#242c34] transition-colors flex items-center justify-between"
                            >
                              <div className="flex items-center gap-2">
                                <AlertCircle className="w-3.5 h-3.5" />
                                <span>Contains spoilers for {act.animeTitle}</span>
                              </div>
                              <span className="underline text-[11px]">Reveal review</span>
                            </div>
                          ) : (
                            <p className="text-xs sm:text-sm text-[#c8d4e0] leading-relaxed font-sans">
                              {act.reviewText}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Tags */}
                      {act.tags && act.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 pt-1">
                          {act.tags.map(t => (
                            <span key={t} className="text-[11px] font-mono text-[#89a]">
                              #{t}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                  </div>

                  {/* Post Bottom Bar: Like, Comments Toggle, Share, and Quick Log */}
                  <div className="flex items-center justify-between pt-2 border-t border-[#242c34] text-xs font-mono">
                    <div className="flex items-center gap-4">
                      {/* Like Activity Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleLikeActivity(act.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          act.likedByCurrentUser
                            ? 'text-[#ff4b60]'
                            : 'text-[#89a] hover:text-white'
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${act.likedByCurrentUser ? 'fill-current' : ''}`} />
                        <span className="tabular-nums">{act.likesCount}</span>
                      </button>

                      {/* Comments Toggle Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleComments(act.id)}
                        className={`flex items-center gap-1.5 transition-colors ${
                          isCommentsOpen ? 'text-[#00e054]' : 'text-[#89a] hover:text-white'
                        }`}
                      >
                        <MessageSquare className="w-4 h-4" />
                        <span className="tabular-nums">{act.comments.length}</span>
                        <span className="hidden sm:inline">comments</span>
                      </button>

                      {/* Share link */}
                      <button
                        type="button"
                        onClick={() => handleShare(act.id)}
                        className="text-[#89a] hover:text-white transition-colors"
                        title="Copy share link"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                      </button>
                      {copiedId === act.id && (
                        <span className="text-[10px] text-[#00e054]">Copied!</span>
                      )}
                    </div>

                    {/* Quick Log button for this anime */}
                    <button
                      type="button"
                      onClick={() => onQuickLog(anime)}
                      className="px-2.5 py-1 rounded bg-[#242c34] hover:bg-[#00e054] text-[#89a] hover:text-[#14181c] transition-colors flex items-center gap-1 text-[11px]"
                    >
                      <Plus className="w-3 h-3 stroke-[3]" />
                      <span>Log this anime</span>
                    </button>
                  </div>

                  {/* Expanded Comments Section with Real Interactive Input */}
                  {isCommentsOpen && (
                    <div className="pt-3 border-t border-[#242c34] space-y-3 animate-in fade-in duration-150">
                      
                      {/* Existing Comments */}
                      {act.comments.length > 0 && (
                        <div className="space-y-2.5">
                          {act.comments.map((comment) => (
                            <div
                              key={comment.id}
                              className="p-3 rounded-lg bg-[#14181c] border border-[#242c34] flex gap-3 text-xs"
                            >
                              <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-[#2c3440]">
                                <img
                                  src={comment.authorAvatar}
                                  alt={comment.authorDisplayName}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-1.5 font-mono">
                                    <span className="font-semibold text-white">{comment.authorDisplayName}</span>
                                    <span className="text-[#678] text-[10px]">@{comment.authorUsername}</span>
                                  </div>
                                  <span className="text-[10px] text-[#678] font-mono">{comment.createdAt}</span>
                                </div>
                                <p className="text-[#c8d4e0] mt-1 leading-relaxed">{comment.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment Input Form */}
                      <form
                        onSubmit={(e) => handleAddComment(act.id, e)}
                        className="flex gap-2 items-center pt-1"
                      >
                        <div className="w-7 h-7 rounded-full overflow-hidden shrink-0 border border-[#2c3440]">
                          <img
                            src={profile.avatarUrl}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <input
                          type="text"
                          placeholder="Join the discussion... (press Enter)"
                          value={commentInputs[act.id] || ''}
                          onChange={(e) => setCommentInputs({ ...commentInputs, [act.id]: e.target.value })}
                          className="flex-1 px-3 py-1.5 bg-[#14181c] border border-[#2c3440] rounded-lg text-xs text-white placeholder-[#567] focus:outline-none focus:border-[#00e054]"
                        />
                        <button
                          type="submit"
                          disabled={!(commentInputs[act.id] || '').trim()}
                          className="p-1.5 bg-[#00e054] text-[#14181c] rounded-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#00f25c] transition-colors"
                          title="Post comment"
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </form>

                    </div>
                  )}

                </article>
              );
            })
          ) : (
            <div className="p-12 text-center rounded-xl bg-[#191d22] border border-[#2c3440] space-y-3">
              <Sparkles className="w-8 h-8 text-[#678] mx-auto" />
              <h3 className="text-sm font-semibold text-white">No activity found</h3>
              <p className="text-xs text-[#89a] max-w-sm mx-auto">
                {activeFilter === 'following'
                  ? 'You are not following any users yet, or your followed members have no recent activity.'
                  : 'Try switching filters to see all community activity.'}
              </p>
            </div>
          )}
        </div>

        {/* Right Column: Social Discovery & Community Highlights */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* "Otakus to Follow" Card */}
          <div className="p-5 rounded-xl bg-[#191d22] border border-[#2c3440] space-y-4">
            <div className="flex items-center justify-between border-b border-[#242c34] pb-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-white">
                Otakus to Follow
              </h3>
              <span className="text-[11px] text-[#678] font-mono">Curators</span>
            </div>

            <div className="space-y-3.5 divide-y divide-[#242c34]">
              {users.map((u) => (
                <div key={u.id} className="pt-3.5 first:pt-0 flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-full overflow-hidden border border-[#2c3440] bg-[#14181c] shrink-0">
                      <img src={u.avatarUrl} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">{u.displayName}</p>
                      <p className="text-[10px] text-[#678] font-mono truncate">@{u.username}</p>
                      <p className="text-[11px] text-[#89a] line-clamp-2 mt-1 leading-snug">{u.bio}</p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleToggleFollow(u.id)}
                    className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors shrink-0 ${
                      u.isFollowing
                        ? 'bg-[#14181c] border border-[#2c3440] text-[#89a] hover:text-[#ff4b60]'
                        : 'bg-[#00e054] text-[#14181c] font-semibold hover:bg-[#00f25c]'
                    }`}
                  >
                    {u.isFollowing ? 'Following' : 'Follow'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Discussions Widget */}
          <div className="p-5 rounded-xl bg-[#191d22] border border-[#2c3440] space-y-3">
            <div className="flex items-center gap-2 border-b border-[#242c34] pb-2 text-white">
              <TrendingUp className="w-4 h-4 text-[#00e054]" />
              <h3 className="text-xs font-semibold uppercase tracking-wider">
                Trending Debates
              </h3>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-2.5 rounded bg-[#14181c] border border-[#242c34]">
                <p className="font-semibold text-white">Princess Mononoke 35mm Cel Scan</p>
                <p className="text-[11px] text-[#89a] mt-0.5">38 comments · Cel animation preservation debate</p>
              </div>

              <div className="p-2.5 rounded bg-[#14181c] border border-[#242c34]">
                <p className="font-semibold text-white">Frieren vs Steins;Gate Pacing</p>
                <p className="text-[11px] text-[#89a] mt-0.5">54 comments · Highest rated TV series discussion</p>
              </div>

              <div className="p-2.5 rounded bg-[#14181c] border border-[#242c34]">
                <p className="font-semibold text-white">Studio Trigger's Color Grading</p>
                <p className="text-[11px] text-[#89a] mt-0.5">27 comments · Hiroyuki Imaishi lighting breakdown</p>
              </div>
            </div>
          </div>

          {/* Community Stats */}
          <div className="p-4 rounded-xl bg-[#191d22] border border-[#2c3440] text-center font-mono text-xs">
            <div className="grid grid-cols-2 gap-3 divide-x divide-[#242c34]">
              <div>
                <span className="block text-lg font-bold text-white tabular-nums">48.2k</span>
                <span className="text-[10px] text-[#678] uppercase">Reviews Logged</span>
              </div>
              <div>
                <span className="block text-lg font-bold text-[#00e054] tabular-nums">12.4k</span>
                <span className="text-[10px] text-[#678] uppercase">Otakus Active</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
