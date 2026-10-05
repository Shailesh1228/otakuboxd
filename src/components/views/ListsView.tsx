import React, { useState } from 'react';
import { Anime, AnimeList } from '../../types/anime';
import { Plus, ListOrdered, Heart, Film, ArrowLeft } from 'lucide-react';
import { CURATED_ANIME } from '../../data/curatedAnime';
import { getCachedAnime } from '../../services/jikanApi';
import { AnimeCard } from '../AnimeCard';

interface ListsViewProps {
  lists: AnimeList[];
  onCreateList: (title: string, description: string, initialAnimeIds: (string | number)[]) => void;
  onSelectAnime: (anime: Anime) => void;
  onQuickLog: (anime: Anime) => void;
  onToggleWatchlist: (anime: Anime) => void;
  onToggleLike: (anime: Anime) => void;
  watchlistIds: (string | number)[];
  likedIds: (string | number)[];
}

export const ListsView: React.FC<ListsViewProps> = ({
  lists,
  onCreateList,
  onSelectAnime,
  onQuickLog,
  onToggleWatchlist,
  onToggleLike,
  watchlistIds,
  likedIds
}) => {
  const [selectedList, setSelectedList] = useState<AnimeList | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    onCreateList(newTitle.trim(), newDesc.trim(), []);
    setNewTitle('');
    setNewDesc('');
    setIsModalOpen(false);
  };

  const resolveAnime = (id: string | number): Anime | undefined => {
    return CURATED_ANIME.find(a => String(a.id) === String(id)) || getCachedAnime(id);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* If looking at a single list */}
      {selectedList ? (
        <div className="space-y-6">
          <button
            type="button"
            onClick={() => setSelectedList(null)}
            className="flex items-center gap-1.5 text-xs text-[#89a] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all lists</span>
          </button>

          {/* List Header */}
          <div className="border-b border-[#242c34] pb-6 space-y-2">
            <h1 className="text-2xl sm:text-3xl font-bold text-white tracking-tight font-display">
              {selectedList.title}
            </h1>
            <p className="text-xs text-[#89a] font-mono">
              Curated by <span className="text-white font-semibold">{selectedList.authorName}</span> · {selectedList.items.length} films & series
            </p>
            {selectedList.description && (
              <p className="text-sm text-[#c8d4e0] max-w-2xl leading-relaxed pt-2">
                {selectedList.description}
              </p>
            )}
          </div>

          {/* List Items Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
            {selectedList.items.map((item, index) => {
              const anime = resolveAnime(item.animeId);
              if (!anime) return null;

              const isInWatchlist = watchlistIds.some(id => String(id) === String(anime.id));
              const isLiked = likedIds.some(id => String(id) === String(anime.id));

              return (
                <div key={item.animeId} className="relative group">
                  {/* Number Badge (1, 2, 3...) */}
                  <span className="absolute -top-2 -left-2 z-10 w-6 h-6 rounded-full bg-[#14181c] border border-[#00e054] text-[#00e054] font-mono font-bold text-xs flex items-center justify-center shadow">
                    {index + 1}
                  </span>
                  
                  <AnimeCard
                    anime={anime}
                    isInWatchlist={isInWatchlist}
                    isLiked={isLiked}
                    onSelect={onSelectAnime}
                    onQuickLog={onQuickLog}
                    onToggleWatchlist={onToggleWatchlist}
                    onToggleLike={onToggleLike}
                  />

                  {item.notes && (
                    <p className="text-[11px] text-[#89a] italic mt-1 line-clamp-2">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          {selectedList.items.length === 0 && (
            <div className="p-12 text-center rounded-xl bg-[#1b2228] border border-[#2c3440] text-xs text-[#89a]">
              This list is currently empty. Add titles from any anime details page!
            </div>
          )}
        </div>
      ) : (
        /* All Lists Overview */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#242c34] pb-4">
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight font-display">
                Curated Lists
              </h1>
              <p className="text-xs text-[#89a] mt-1 font-mono">
                Collect, curate, and share themed anime rankings and marathons.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg bg-[#00e054] text-[#14181c] font-semibold text-xs flex items-center gap-1.5 shadow transition-all self-start sm:self-auto"
            >
              <Plus className="w-3.5 h-3.5 stroke-[3]" />
              <span>Start a New List</span>
            </button>
          </div>

          {/* Lists Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {lists.map((list) => {
              const previewAnime = list.items.slice(0, 5).map(i => resolveAnime(i.animeId)).filter(Boolean) as Anime[];

              return (
                <div
                  key={list.id}
                  onClick={() => setSelectedList(list)}
                  className="group p-5 rounded-xl bg-[#191d22] border border-[#2c3440] hover:border-[#00e054] transition-all cursor-pointer flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-2">
                    <h3 className="text-base font-bold text-white group-hover:text-[#00e054] transition-colors">
                      {list.title}
                    </h3>
                    <p className="text-xs text-[#89a] line-clamp-2 leading-relaxed">
                      {list.description || 'No description provided.'}
                    </p>
                  </div>

                  {/* Overlapping Letterboxd 5-Poster Deck Preview */}
                  <div className="flex items-center -space-x-5 py-2 overflow-hidden">
                    {previewAnime.map((anime, idx) => (
                      <div
                        key={anime.id}
                        className="w-14 sm:w-16 aspect-[2/3] rounded bg-[#14181c] border-2 border-[#191d22] overflow-hidden shadow-lg transform transition-transform group-hover:-translate-y-1"
                        style={{ zIndex: 10 - idx }}
                      >
                        {anime.posterUrl ? (
                          <img src={anime.posterUrl} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <Film className="w-4 h-4 m-auto text-[#678]" />
                        )}
                      </div>
                    ))}
                    {list.items.length === 0 && (
                      <div className="text-xs text-[#678] font-mono italic">Empty list</div>
                    )}
                  </div>

                  {/* Meta strip */}
                  <div className="flex items-center justify-between text-xs text-[#678] font-mono pt-2 border-t border-[#242c34]">
                    <span>By {list.authorName}</span>
                    <div className="flex items-center gap-3">
                      <span>{list.items.length} titles</span>
                      <span className="flex items-center gap-1 text-[#ff4b60]">
                        <Heart className="w-3 h-3 fill-current" />
                        <span className="tabular-nums">{list.likesCount}</span>
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Create New List Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="relative w-full max-w-md bg-[#1f2328] rounded-xl border border-[#2c3440] shadow-2xl p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Create New Anime List</h3>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#89a] mb-1">Title</label>
                <input
                  type="text"
                  placeholder="e.g. Essential Cyberpunk & Dystopian Anime"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 bg-[#14181c] border border-[#2c3440] rounded-lg text-xs text-white focus:outline-none focus:border-[#00e054]"
                  autoFocus
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#89a] mb-1">Description</label>
                <textarea
                  rows={3}
                  placeholder="Tell others what makes this selection special..."
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full px-3 py-2 bg-[#14181c] border border-[#2c3440] rounded-lg text-xs text-white focus:outline-none focus:border-[#00e054]"
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3 py-1.5 text-xs text-[#89a] hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#00e054] text-[#14181c] font-semibold text-xs rounded-lg hover:bg-[#00f25c] transition-colors"
                >
                  Create List
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
