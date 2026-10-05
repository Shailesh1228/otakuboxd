import React from 'react';
import { ActiveTab, UserProfile } from '../types/anime';
import { Plus, Search } from 'lucide-react';

interface NavbarProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  onOpenLogModal: () => void;
  onOpenSearchModal: () => void;
  profile: UserProfile;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenLogModal,
  onOpenSearchModal,
  profile
}) => {
  const navItems: { id: ActiveTab; label: string }[] = [
    { id: 'explore', label: 'Films & Series' },
    { id: 'activity', label: 'Activity' },
    { id: 'diary', label: 'Diary' },
    { id: 'reviews', label: 'Reviews' },
    { id: 'lists', label: 'Lists' },
    { id: 'watchlist', label: 'Watchlist' },
  ];

  return (
    <header className="sticky top-0 z-40 w-full bg-[#14181c]/95 backdrop-blur border-b border-[#242c34]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        
        {/* Zone 1: Single text element wordmark with iconic Letterboxd 3-dot styling */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => onTabChange('explore')}
            className="flex items-center gap-2 group text-left"
          >
            {/* 3 Iconic Otaku dots: Vermilion (Manga red), Emerald (Letterboxd green), Cyan (Anime sky) */}
            <div className="flex items-center -space-x-1" aria-hidden="true">
              <span className="w-3 h-3 rounded-full bg-[#ff4500] inline-block opacity-90 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-[#00e054] inline-block opacity-95 shadow-sm" />
              <span className="w-3 h-3 rounded-full bg-[#40bcf4] inline-block opacity-90 shadow-sm" />
            </div>
            <span className="font-display text-lg font-bold tracking-tight text-white group-hover:text-[#00e054] transition-colors whitespace-nowrap">
              otakuboxd
            </span>
          </button>
        </div>

        {/* Zone 2: 4–6 clean nav links with subtle hover/active states */}
        <nav className="hidden md:flex items-center gap-6 text-xs uppercase tracking-wider font-semibold">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`transition-colors whitespace-nowrap py-1 ${
                  isActive
                    ? 'text-white border-b-2 border-[#00e054]'
                    : 'text-[#89a] hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: 1-2 primary actions (Search + '+ Log' CTA + Profile) */}
        <div className="flex items-center gap-3">
          {/* Quick Search Trigger */}
          <button
            type="button"
            onClick={onOpenSearchModal}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#1b2228] hover:bg-[#242c34] text-[#89a] hover:text-white border border-[#2c3440] text-xs transition-colors"
            title="Search anime (Ctrl+K or /)"
          >
            <Search className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-mono text-[11px]">Search...</span>
          </button>

          {/* Primary CTA: Log Anime Button */}
          <button
            type="button"
            onClick={onOpenLogModal}
            className="px-3.5 py-1.5 bg-[#00e054] hover:bg-[#00f25c] text-[#14181c] font-semibold text-xs rounded-md shadow flex items-center gap-1.5 transition-all whitespace-nowrap"
          >
            <Plus className="w-3.5 h-3.5 stroke-[3]" />
            <span className="hidden sm:inline">Log</span>
          </button>

          {/* User Profile Avatar Link */}
          <button
            type="button"
            onClick={() => onTabChange('profile')}
            className={`w-8 h-8 rounded-full overflow-hidden border-2 transition-transform hover:scale-105 shrink-0 ${
              activeTab === 'profile' ? 'border-[#00e054]' : 'border-[#2c3440] hover:border-white'
            }`}
            title={`Logged in as ${profile.displayName}`}
          >
            <img
              src={profile.avatarUrl}
              alt={profile.displayName}
              className="w-full h-full object-cover"
            />
          </button>
        </div>

      </div>

      {/* Mobile nav subrow */}
      <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-[#242c34] bg-[#14181c] text-[11px] font-semibold uppercase tracking-wider">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={`py-1 px-1 transition-colors ${
              activeTab === item.id ? 'text-[#00e054]' : 'text-[#89a]'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>
    </header>
  );
};
