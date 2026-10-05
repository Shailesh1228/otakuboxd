import React, { useState } from 'react';
import { Anime, AnimeList } from '../types/anime';
import { X, Plus, Check } from 'lucide-react';

interface AddToListModalProps {
  isOpen: boolean;
  onClose: () => void;
  anime: Anime | null;
  lists: AnimeList[];
  onAddToList: (listId: string, animeId: string | number, note?: string) => void;
  onCreateList: (title: string, description: string, initialAnimeIds: (string | number)[]) => void;
}

export const AddToListModal: React.FC<AddToListModalProps> = ({
  isOpen,
  onClose,
  anime,
  lists,
  onAddToList,
  onCreateList
}) => {
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newListTitle, setNewListTitle] = useState('');
  const [newListDesc, setNewListDesc] = useState('');
  const [note, setNote] = useState('');
  const [successListId, setSuccessListId] = useState<string | null>(null);

  if (!isOpen || !anime) return null;

  const handleSelectExisting = (listId: string) => {
    onAddToList(listId, anime.id, note);
    setSuccessListId(listId);
    setTimeout(() => {
      setSuccessListId(null);
      onClose();
    }, 800);
  };

  const handleCreateAndAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    onCreateList(newListTitle.trim(), newListDesc.trim(), [anime.id]);
    setIsCreatingNew(false);
    setNewListTitle('');
    setNewListDesc('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-md bg-[#1f2328] rounded-xl border border-[#2c3440] shadow-2xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-[#2c3440]">
          <div>
            <h3 className="text-sm font-semibold text-white">Add to List</h3>
            <p className="text-xs text-[#89a] truncate mt-0.5">{anime.title}</p>
          </div>
          <button onClick={onClose} className="text-[#89a] hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        {!isCreatingNew ? (
          <div className="py-4 space-y-4">
            <div className="space-y-1">
              <label className="text-xs text-[#89a]">Optional note for this list entry</label>
              <input
                type="text"
                placeholder="e.g. My favorite episode is 19..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 bg-[#14181c] border border-[#2c3440] rounded-lg text-xs text-white focus:outline-none focus:border-[#00e054]"
              />
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              <span className="text-[11px] font-semibold text-[#678] uppercase tracking-wider">
                Select a list
              </span>
              {lists.map((list) => {
                const alreadyInList = list.items.some(i => String(i.animeId) === String(anime.id));
                const justAdded = successListId === list.id;

                return (
                  <div
                    key={list.id}
                    onClick={() => !alreadyInList && handleSelectExisting(list.id)}
                    className={`p-3 rounded-lg border transition-colors flex items-center justify-between cursor-pointer ${
                      justAdded
                        ? 'bg-[#00e054]/20 border-[#00e054]'
                        : alreadyInList
                        ? 'bg-[#14181c]/50 border-[#242c34] opacity-60 cursor-not-allowed'
                        : 'bg-[#14181c] border-[#2c3440] hover:border-[#00e054]'
                    }`}
                  >
                    <div>
                      <h4 className="text-xs font-semibold text-white">{list.title}</h4>
                      <p className="text-[11px] text-[#678] font-mono">{list.items.length} titles</p>
                    </div>
                    {justAdded ? (
                      <Check className="w-4 h-4 text-[#00e054]" />
                    ) : alreadyInList ? (
                      <span className="text-[10px] text-[#89a] font-mono">Already added</span>
                    ) : (
                      <Plus className="w-4 h-4 text-[#89a]" />
                    )}
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setIsCreatingNew(true)}
              className="w-full py-2.5 rounded-lg border border-dashed border-[#2c3440] hover:border-[#00e054] text-xs text-[#89a] hover:text-[#00e054] flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create New List</span>
            </button>
          </div>
        ) : (
          <form onSubmit={handleCreateAndAdd} className="py-4 space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#89a] mb-1">List Title</label>
              <input
                type="text"
                placeholder="e.g. Anime that made me question reality"
                value={newListTitle}
                onChange={(e) => setNewListTitle(e.target.value)}
                className="w-full px-3 py-2 bg-[#14181c] border border-[#2c3440] rounded-lg text-xs text-white focus:outline-none focus:border-[#00e054]"
                autoFocus
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#89a] mb-1">Description</label>
              <textarea
                rows={2}
                placeholder="Describe what connects these anime together..."
                value={newListDesc}
                onChange={(e) => setNewListDesc(e.target.value)}
                className="w-full px-3 py-2 bg-[#14181c] border border-[#2c3440] rounded-lg text-xs text-white focus:outline-none focus:border-[#00e054]"
              />
            </div>

            <div className="flex justify-between items-center pt-2">
              <button
                type="button"
                onClick={() => setIsCreatingNew(false)}
                className="text-xs text-[#89a] hover:text-white"
              >
                Back to lists
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#00e054] text-[#14181c] font-semibold text-xs rounded-lg hover:bg-[#00f25c] transition-colors"
              >
                Create & Add
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
