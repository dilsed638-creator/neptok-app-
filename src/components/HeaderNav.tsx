import React from 'react';
import { Radio, Search, Smartphone, Monitor, Volume2, VolumeX } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeaderNav: React.FC = () => {
  const {
    currentFeedTab,
    setCurrentFeedTab,
    setIsLiveActive,
    setActiveTab,
    isMobileFrame,
    setIsMobileFrame,
    isMuted,
    setIsMuted,
    setIsApkGuideOpen,
  } = useApp();

  return (
    <header className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-4 pt-3 pb-2 bg-gradient-to-b from-black/80 via-black/40 to-transparent pointer-events-auto">
      {/* Live Streaming Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsLiveActive(true)}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md border border-rose-500/40 text-xs font-semibold text-white hover:bg-rose-600/30 transition-all active:scale-95 group shadow-sm"
          title="Watch Nepali Live Streams"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-600"></span>
          </span>
          <Radio className="w-3.5 h-3.5 text-rose-400 group-hover:rotate-12 transition-transform" />
          <span className="tracking-wider uppercase text-[11px] font-bold text-rose-300">LIVE</span>
        </button>
      </div>

      {/* Center Feed Tabs: Following | For You */}
      <div className="flex items-center gap-4 text-sm font-bold">
        <button
          onClick={() => setCurrentFeedTab('following')}
          className={`relative py-1 transition-all ${
            currentFeedTab === 'following'
              ? 'text-white scale-105 drop-shadow'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Following
          {currentFeedTab === 'following' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          )}
        </button>

        <span className="text-zinc-600 text-xs select-none">|</span>

        <button
          onClick={() => setCurrentFeedTab('foryou')}
          className={`relative py-1 transition-all ${
            currentFeedTab === 'foryou'
              ? 'text-white scale-105 drop-shadow'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          For You
          {currentFeedTab === 'foryou' && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-rose-500 rounded-full shadow-[0_0_8px_rgba(244,63,94,0.8)]" />
          )}
        </button>
      </div>

      {/* Right Action Icons */}
      <div className="flex items-center gap-2">
        {/* Sound Mute/Unmute */}
        <button
          onClick={() => setIsMuted(prev => !prev)}
          className="p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 hover:text-white hover:bg-black/60 transition active:scale-95"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
        </button>

        {/* Search button */}
        <button
          onClick={() => setActiveTab('discover')}
          className="p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-white/90 hover:text-white hover:bg-black/60 transition active:scale-95"
          title="Search NepTok"
        >
          <Search className="w-4 h-4" />
        </button>

        {/* Mobile / Web View Toggle (Desktop only) */}
        <button
          onClick={() => setIsMobileFrame(!isMobileFrame)}
          className="hidden md:flex p-1.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-zinc-300 hover:text-white hover:bg-black/60 transition active:scale-95"
          title={isMobileFrame ? 'Expand to Full View' : 'Switch to Android Phone Bezel'}
        >
          {isMobileFrame ? <Monitor className="w-4 h-4" /> : <Smartphone className="w-4 h-4 text-rose-400" />}
        </button>

        {/* Android APK badge */}
        <button
          onClick={() => setIsApkGuideOpen(true)}
          className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-[10px] font-bold text-emerald-300 hover:bg-emerald-900/60 transition active:scale-95"
          title="Android APK Packaging Info"
        >
          <span>APK</span>
        </button>
      </div>
    </header>
  );
};
