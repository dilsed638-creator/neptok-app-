import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { HeaderNav } from './components/HeaderNav';
import { BottomNav } from './components/BottomNav';
import { VideoFeed } from './components/VideoFeed';
import { DiscoverView } from './components/DiscoverView';
import { UploadView } from './components/UploadView';
import { InboxView } from './components/InboxView';
import { ProfileView } from './components/ProfileView';
import { LiveStreamView } from './components/LiveStreamView';
import { AuthModal } from './components/AuthModal';
import { EditProfileModal } from './components/EditProfileModal';
import { ApkGuideModal } from './components/ApkGuideModal';
import { Smartphone, Monitor, Download, Radio } from 'lucide-react';

const MainAppContent: React.FC = () => {
  const {
    activeTab,
    isLiveActive,
    isMobileFrame,
    setIsMobileFrame,
    setIsApkGuideOpen,
    setIsLiveActive,
  } = useApp();

  return (
    <div className="min-h-screen w-full bg-[#070709] text-white flex flex-col items-center justify-center sm:p-4 overflow-hidden select-none font-sans">
      {/* Desktop Companion Bar (Visible only on desktop/tablet) */}
      <div className="hidden lg:flex items-center justify-between w-full max-w-4xl px-4 py-2 mb-2 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-rose-600 flex items-center justify-center text-white font-extrabold text-[10px]">
            🇳🇵
          </div>
          <span className="font-extrabold text-white tracking-wider text-sm">
            NEP<span className="text-rose-500">TOK</span>
          </span>
          <span className="text-[11px] text-zinc-500 hidden sm:inline">
            • Nepal's Mobile Short Video Social Platform
          </span>
        </div>

        <div className="flex items-center gap-3">
          {/* Quick APK packaging modal */}
          <button
            onClick={() => setIsApkGuideOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 text-emerald-300 font-semibold transition active:scale-95 shadow-sm"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Android APK Export</span>
          </button>

          {/* Quick Live Stream */}
          <button
            onClick={() => setIsLiveActive(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-rose-950/50 hover:bg-rose-900/60 border border-rose-500/40 text-rose-300 font-semibold transition active:scale-95"
          >
            <Radio className="w-3.5 h-3.5 text-rose-500" />
            <span>Watch Live</span>
          </button>

          {/* Device Frame Toggle */}
          <button
            onClick={() => setIsMobileFrame(!isMobileFrame)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 transition active:scale-95"
          >
            {isMobileFrame ? (
              <>
                <Monitor className="w-3.5 h-3.5" />
                <span>Full Width</span>
              </>
            ) : (
              <>
                <Smartphone className="w-3.5 h-3.5 text-rose-400" />
                <span>Phone Frame</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Viewport Container */}
      <div
        className={`relative w-full h-[100dvh] bg-[#0B0B0E] overflow-hidden flex flex-col transition-all duration-300 ${
          isMobileFrame
            ? 'sm:h-[844px] sm:max-h-[92vh] sm:max-w-[420px] sm:rounded-[42px] sm:border-[8px] sm:border-[#1E1E28] sm:shadow-[0_25px_70px_rgba(0,0,0,0.85)]'
            : 'max-w-2xl sm:h-[90vh] sm:rounded-3xl sm:border sm:border-zinc-800 sm:shadow-2xl'
        }`}
      >
        {/* Android Phone Speaker / Camera Notch (When in Phone frame mode on desktop) */}
        {isMobileFrame && (
          <div className="hidden sm:flex absolute top-2 left-1/2 -translate-x-1/2 z-40 items-center justify-center pointer-events-none">
            <div className="w-24 h-4 bg-black rounded-full flex items-center justify-center gap-2 border border-zinc-800/60">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-900 border border-zinc-700/80" />
              <div className="w-8 h-1 bg-zinc-800 rounded-full" />
            </div>
          </div>
        )}

        {/* Top Header (Visible on Home feed) */}
        {activeTab === 'home' && <HeaderNav />}

        {/* Active Tab View */}
        <main className="relative flex-1 w-full h-full overflow-hidden">
          {activeTab === 'home' && <VideoFeed />}
          {activeTab === 'discover' && <DiscoverView />}
          {activeTab === 'upload' && <UploadView />}
          {activeTab === 'inbox' && <InboxView />}
          {activeTab === 'profile' && <ProfileView />}
        </main>

        {/* Persistent Bottom Navigation */}
        <BottomNav />

        {/* Full-screen Live Streaming Simulation View */}
        {isLiveActive && <LiveStreamView />}

        {/* Modals */}
        <AuthModal />
        <EditProfileModal />
        <ApkGuideModal />
      </div>

      {/* Desktop Keyboard Hints Footnote */}
      <div className="hidden lg:flex items-center gap-4 mt-2 text-[11px] text-zinc-500 select-none">
        <span>Navigation: <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">↑</kbd> <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">↓</kbd> or Mouse Scroll</span>
        <span>•</span>
        <span>Like: <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">Double Tap</kbd> or <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">L</kbd></span>
        <span>•</span>
        <span>Mute: <kbd className="px-1.5 py-0.5 rounded bg-zinc-900 border border-zinc-800 text-zinc-300 font-mono">M</kbd></span>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
