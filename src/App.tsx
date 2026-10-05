import React, { useState, useEffect, useCallback } from 'react';
import { ActiveTab, Anime, AnimeLog, AnimeList, UserProfile } from './types/anime';
import { StorageService } from './services/storage';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ExploreView } from './components/views/ExploreView';
import { DiaryView } from './components/views/DiaryView';
import { ReviewsView } from './components/views/ReviewsView';
import { ListsView } from './components/views/ListsView';
import { WatchlistView } from './components/views/WatchlistView';
import { ProfileView } from './components/views/ProfileView';
import { SocialActivityFeed } from './components/views/SocialActivityFeed';
import { INITIAL_SOCIAL_ACTIVITIES, MOCK_SOCIAL_USERS } from './data/mockSocialActivity';
import { LogModal } from './components/LogModal';
import { AnimeDetailModal } from './components/AnimeDetailModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { AddToListModal } from './components/AddToListModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('explore');
  const [profile, setProfile] = useState<UserProfile>(() => StorageService.getProfile());
  const [logs, setLogs] = useState<AnimeLog[]>(() => StorageService.getLogs());
  const [watchlistIds, setWatchlistIds] = useState<(string | number)[]>(() => StorageService.getWatchlist());
  const [likedIds, setLikedIds] = useState<(string | number)[]>(() => StorageService.getLiked());
  const [lists, setLists] = useState<AnimeList[]>(() => StorageService.getLists());

  // Modals state
  const [logModalOpen, setLogModalOpen] = useState(false);
  const [logModalAnime, setLogModalAnime] = useState<Anime | null>(null);
  const [logModalExisting, setLogModalExisting] = useState<AnimeLog | null>(null);

  const [detailModalAnime, setDetailModalAnime] = useState<Anime | null>(null);
  const [quickSearchOpen, setQuickSearchOpen] = useState(false);
  const [addToListAnime, setAddToListAnime] = useState<Anime | null>(null);

  // Global keyboard shortcut CMD+K or / to search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQuickSearchOpen(prev => !prev);
      } else if (e.key === '/' && !['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        e.preventDefault();
        setQuickSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Handlers
  const handleOpenLogModal = useCallback((anime?: Anime | null, existingLog?: AnimeLog | null) => {
    setLogModalAnime(anime || null);
    setLogModalExisting(existingLog || null);
    setLogModalOpen(true);
  }, []);

  const handleSaveLog = useCallback((newLog: AnimeLog) => {
    if (logModalExisting) {
      const updated = StorageService.updateLog(newLog);
      setLogs([...updated]);
    } else {
      const updated = StorageService.addLog(newLog);
      setLogs([...updated]);
      // Update watchlist & liked in state
      setWatchlistIds(StorageService.getWatchlist());
      setLikedIds(StorageService.getLiked());
    }
  }, [logModalExisting]);

  const handleDeleteLog = useCallback((logId: string) => {
    const updated = StorageService.deleteLog(logId);
    setLogs([...updated]);
  }, []);

  const handleToggleWatchlist = useCallback((anime: Anime) => {
    StorageService.toggleWatchlist(anime.id);
    setWatchlistIds(StorageService.getWatchlist());
  }, []);

  const handleToggleLike = useCallback((anime: Anime) => {
    StorageService.toggleLiked(anime.id);
    setLikedIds(StorageService.getLiked());
  }, []);

  const handleUpdateProfile = useCallback((newProfile: UserProfile) => {
    StorageService.saveProfile(newProfile);
    setProfile(newProfile);
  }, []);

  const handleCreateList = useCallback((title: string, desc: string, ids: (string | number)[]) => {
    const updated = StorageService.createList(title, desc, ids);
    setLists([...updated]);
  }, []);

  const handleAddAnimeToList = useCallback((listId: string, animeId: string | number, note?: string) => {
    StorageService.addAnimeToList(listId, animeId, note);
    setLists(StorageService.getLists());
  }, []);

  const handleExportData = useCallback(() => {
    const jsonStr = StorageService.exportData();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `otakuboxd-diary-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const handleImportData = useCallback((jsonStr: string): boolean => {
    const success = StorageService.importData(jsonStr);
    if (success) {
      setProfile(StorageService.getProfile());
      setLogs(StorageService.getLogs());
      setWatchlistIds(StorageService.getWatchlist());
      setLikedIds(StorageService.getLiked());
      setLists(StorageService.getLists());
    }
    return success;
  }, []);

  // Find user log for currently viewed anime in detail modal
  const currentDetailUserLog = detailModalAnime
    ? logs.find(l => String(l.animeId) === String(detailModalAnime.id)) || null
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-[#14181c] text-[#9ab0c2] selection:bg-[#00e054] selection:text-[#14181c]">
      
      {/* 3-Zone Navigation Header */}
      <Navbar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onOpenLogModal={() => handleOpenLogModal(null, null)}
        onOpenSearchModal={() => setQuickSearchOpen(true)}
        profile={profile}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 pt-6 sm:pt-8">
        {activeTab === 'explore' && (
          <ExploreView
            onSelectAnime={setDetailModalAnime}
            onQuickLog={(anime) => handleOpenLogModal(anime, null)}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleLike={handleToggleLike}
            watchlistIds={watchlistIds}
            likedIds={likedIds}
            userLogs={logs}
            onNavigateToActivity={() => setActiveTab('activity')}
          />
        )}

        {activeTab === 'activity' && (
          <SocialActivityFeed
            initialActivities={INITIAL_SOCIAL_ACTIVITIES}
            users={MOCK_SOCIAL_USERS}
            profile={profile}
            onSelectAnime={setDetailModalAnime}
            onQuickLog={(anime) => handleOpenLogModal(anime, null)}
          />
        )}

        {activeTab === 'diary' && (
          <DiaryView
            logs={logs}
            onOpenLogModal={handleOpenLogModal}
            onDeleteLog={handleDeleteLog}
            onSelectAnime={setDetailModalAnime}
          />
        )}

        {activeTab === 'reviews' && (
          <ReviewsView
            logs={logs}
            profile={profile}
            onOpenLogModal={handleOpenLogModal}
            onSelectAnime={setDetailModalAnime}
          />
        )}

        {activeTab === 'lists' && (
          <ListsView
            lists={lists}
            onCreateList={handleCreateList}
            onSelectAnime={setDetailModalAnime}
            onQuickLog={(anime) => handleOpenLogModal(anime, null)}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleLike={handleToggleLike}
            watchlistIds={watchlistIds}
            likedIds={likedIds}
          />
        )}

        {activeTab === 'watchlist' && (
          <WatchlistView
            watchlistIds={watchlistIds}
            onSelectAnime={setDetailModalAnime}
            onQuickLog={(anime) => handleOpenLogModal(anime, null)}
            onToggleWatchlist={handleToggleWatchlist}
            onToggleLike={handleToggleLike}
            likedIds={likedIds}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            profile={profile}
            logs={logs}
            lists={lists}
            watchlistIds={watchlistIds}
            likedIds={likedIds}
            onUpdateProfile={handleUpdateProfile}
            onSelectAnime={setDetailModalAnime}
            onQuickLog={(anime) => handleOpenLogModal(anime, null)}
            onExportData={handleExportData}
            onImportData={handleImportData}
          />
        )}
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <LogModal
        isOpen={logModalOpen}
        onClose={() => {
          setLogModalOpen(false);
          setLogModalAnime(null);
          setLogModalExisting(null);
        }}
        initialAnime={logModalAnime}
        existingLog={logModalExisting}
        onSaveLog={handleSaveLog}
        onDeleteLog={handleDeleteLog}
      />

      <AnimeDetailModal
        anime={detailModalAnime}
        onClose={() => setDetailModalAnime(null)}
        userLog={currentDetailUserLog}
        isInWatchlist={detailModalAnime ? watchlistIds.some(id => String(id) === String(detailModalAnime.id)) : false}
        isLiked={detailModalAnime ? likedIds.some(id => String(id) === String(detailModalAnime.id)) : false}
        onToggleWatchlist={handleToggleWatchlist}
        onToggleLike={handleToggleLike}
        onOpenLogModal={(anime) => handleOpenLogModal(anime, currentDetailUserLog)}
        onOpenAddToListModal={(anime) => setAddToListAnime(anime)}
      />

      <QuickSearchModal
        isOpen={quickSearchOpen}
        onClose={() => setQuickSearchOpen(false)}
        onSelectAnime={setDetailModalAnime}
        onLogAnime={(anime) => handleOpenLogModal(anime, null)}
      />

      <AddToListModal
        isOpen={!!addToListAnime}
        onClose={() => setAddToListAnime(null)}
        anime={addToListAnime}
        lists={lists}
        onAddToList={handleAddAnimeToList}
        onCreateList={handleCreateList}
      />

    </div>
  );
}
