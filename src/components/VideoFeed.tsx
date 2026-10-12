import React, { useRef, useEffect, useState, useCallback } from 'react';
import { ChevronUp, ChevronDown, Compass, UserCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VideoPlayer } from './VideoPlayer';

export const VideoFeed: React.FC = () => {
  const {
    videos,
    activeVideoIndex,
    setActiveVideoIndex,
    currentFeedTab,
    setCurrentFeedTab,
    setActiveTab,
    toggleLikeVideo,
    setIsMuted,
  } = useApp();

  const containerRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number>(0);
  const touchEndY = useRef<number>(0);
  const isThrottled = useRef<boolean>(false);

  // Filter videos based on current tab: 'foryou' or 'following'
  const filteredVideos = currentFeedTab === 'foryou'
    ? videos
    : videos.filter(v => v.creator.isFollowing);

  const total = filteredVideos.length;
  const currentVideo = filteredVideos[activeVideoIndex] || filteredVideos[0];

  const handleNext = useCallback(() => {
    if (activeVideoIndex < total - 1) {
      setActiveVideoIndex(prev => (typeof prev === 'number' ? prev + 1 : 1));
    }
  }, [activeVideoIndex, total, setActiveVideoIndex]);

  const handlePrev = useCallback(() => {
    if (activeVideoIndex > 0) {
      setActiveVideoIndex(prev => (typeof prev === 'number' ? prev - 1 : 0));
    }
  }, [activeVideoIndex, setActiveVideoIndex]);

  // Touch Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    touchEndY.current = e.changedTouches[0].clientY;
    const diff = touchStartY.current - touchEndY.current;
    const MIN_SWIPE_DISTANCE = 45;

    if (Math.abs(diff) > MIN_SWIPE_DISTANCE) {
      if (diff > 0) {
        // Swiped Up -> Next Video
        handleNext();
      } else {
        // Swiped Down -> Previous Video
        handlePrev();
      }
    }
  };

  // Mouse Wheel navigation
  const handleWheel = (e: React.WheelEvent) => {
    if (isThrottled.current) return;
    const THRESHOLD = 35;

    if (Math.abs(e.deltaY) > THRESHOLD) {
      isThrottled.current = true;
      if (e.deltaY > 0) {
        handleNext();
      } else {
        handlePrev();
      }
      setTimeout(() => {
        isThrottled.current = false;
      }, 450);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowDown', 'j', 'J'].includes(e.key)) {
        e.preventDefault();
        handleNext();
      } else if (['ArrowUp', 'k', 'K'].includes(e.key)) {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'l' || e.key === 'L') {
        if (currentVideo) {
          toggleLikeVideo(currentVideo.id);
        }
      } else if (e.key === 'm' || e.key === 'M') {
        setIsMuted(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, currentVideo, toggleLikeVideo, setIsMuted]);

  // Handle empty following tab
  if (currentFeedTab === 'following' && filteredVideos.length === 0) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center bg-[#0B0B0E]">
        <div className="w-16 h-16 rounded-full bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4 shadow-lg">
          <UserCheck className="w-8 h-8" />
        </div>
        <h3 className="text-base font-bold text-white mb-1">No Following Videos Yet</h3>
        <p className="text-xs text-zinc-400 max-w-xs mb-5">
          Follow popular creators from Kathmandu, Pokhara, Mustang and across Nepal to see their daily clips here!
        </p>
        <div className="flex gap-3">
          <button
            onClick={() => setCurrentFeedTab('foryou')}
            className="px-4 py-2 rounded-full bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition active:scale-95 shadow-md"
          >
            Switch to For You
          </button>
          <button
            onClick={() => setActiveTab('discover')}
            className="px-4 py-2 rounded-full bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition active:scale-95"
          >
            Discover Creators
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative w-full h-full overflow-hidden select-none bg-black"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onWheel={handleWheel}
    >
      {/* Active Video Player */}
      {currentVideo && (
        <VideoPlayer
          video={currentVideo}
          isActive={true}
          onNextVideo={handleNext}
          onPrevVideo={handlePrev}
        />
      )}

      {/* Desktop/Web Navigation Arrows Floating on Left */}
      <div className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 flex-col gap-2 z-30 pointer-events-auto">
        <button
          onClick={handlePrev}
          disabled={activeVideoIndex === 0}
          className={`p-2 rounded-full backdrop-blur-md border border-white/10 transition active:scale-90 ${
            activeVideoIndex === 0
              ? 'bg-black/20 text-zinc-600 cursor-not-allowed'
              : 'bg-black/50 text-white hover:bg-rose-600 hover:border-rose-500 shadow-lg'
          }`}
          title="Previous Video (Up Arrow)"
        >
          <ChevronUp className="w-5 h-5" />
        </button>

        <button
          onClick={handleNext}
          disabled={activeVideoIndex >= total - 1}
          className={`p-2 rounded-full backdrop-blur-md border border-white/10 transition active:scale-90 ${
            activeVideoIndex >= total - 1
              ? 'bg-black/20 text-zinc-600 cursor-not-allowed'
              : 'bg-black/50 text-white hover:bg-rose-600 hover:border-rose-500 shadow-lg'
          }`}
          title="Next Video (Down Arrow)"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Video Indicator Pill */}
      <div className="absolute top-14 left-4 z-20 pointer-events-none">
        <div className="px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-semibold text-zinc-300 border border-white/10">
          {activeVideoIndex + 1} / {total}
        </div>
      </div>
    </div>
  );
};
