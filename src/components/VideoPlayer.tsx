import React, { useRef, useState, useEffect } from 'react';
import { Heart, MessageCircle, Share2, Bookmark, Music, Play, Plus, Check, MapPin, Volume2, VolumeX } from 'lucide-react';
import { VideoItem } from '../types';
import { useApp } from '../context/AppContext';
import { CommentsModal } from './CommentsModal';
import { ShareModal } from './ShareModal';

interface VideoPlayerProps {
  video: VideoItem;
  isActive: boolean;
  onNextVideo?: () => void;
  onPrevVideo?: () => void;
}

interface HeartParticle {
  id: number;
  x: number;
  y: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, isActive }) => {
  const {
    toggleLikeVideo,
    toggleBookmarkVideo,
    toggleFollowUser,
    setViewingCreator,
    setActiveTab,
    isMuted,
    setIsMuted,
    currentUser,
    setIsAuthModalOpen,
  } = useApp();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [progress, setProgress] = useState(0);
  const [heartParticles, setHeartParticles] = useState<HeartParticle[]>([]);
  const lastTapRef = useRef<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Play / pause when active changes
  useEffect(() => {
    if (!videoRef.current) return;

    if (isActive) {
      setHasError(false);
      videoRef.current.currentTime = 0;
      const playPromise = videoRef.current.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => setIsPlaying(true))
          .catch(() => {
            // Autoplay with sound might be blocked, mute and retry
            if (videoRef.current) {
              videoRef.current.muted = true;
              videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
            }
          });
      }
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [isActive]);

  // Sync mute state
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  // Track progress
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration;
      setProgress((current / total) * 100);
    }
  };

  // Toggle Play / Pause on single tap
  const handleTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    // Detect Double Tap
    if (now - lastTapRef.current < DOUBLE_TAP_DELAY) {
      // Trigger like on double tap
      if (!video.isLiked) {
        toggleLikeVideo(video.id);
      }

      // Add heart particle at tap location
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const newHeart: HeartParticle = { id: Date.now() + Math.random(), x, y };
      setHeartParticles(prev => [...prev, newHeart]);

      setTimeout(() => {
        setHeartParticles(prev => prev.filter(h => h.id !== newHeart.id));
      }, 900);

      lastTapRef.current = 0;
      return;
    }

    lastTapRef.current = now;

    // Single Tap -> Play/Pause
    setTimeout(() => {
      if (lastTapRef.current === now && videoRef.current) {
        if (isPlaying) {
          videoRef.current.pause();
          setIsPlaying(false);
        } else {
          videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
        }
      }
    }, DOUBLE_TAP_DELAY);
  };

  const handleSeek = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (!videoRef.current || !videoRef.current.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const pct = Math.max(0, Math.min(1, clickX / rect.width));
    videoRef.current.currentTime = pct * videoRef.current.duration;
    setProgress(pct * 100);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2000);
  };

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    toggleLikeVideo(video.id);
  };

  const handleBookmarkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    toggleBookmarkVideo(video.id);
    showToast(video.isBookmarked ? 'Removed from favorites' : 'Saved to favorites ❤️');
  };

  const handleCreatorClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setViewingCreator(video.creator);
    setActiveTab('profile');
  };

  const handleFollowClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    toggleFollowUser(video.creator.id);
    showToast(video.creator.isFollowing ? `Unfollowed @${video.creator.username}` : `Following @${video.creator.username}!`);
  };

  const formatCount = (count: number): string => {
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  return (
    <div
      className="relative w-full h-full bg-black select-none overflow-hidden cursor-pointer"
      onClick={handleTap}
    >
      {/* Toast alert */}
      {toastMessage && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/80 backdrop-blur-md border border-rose-500/40 text-xs font-semibold text-white shadow-xl animate-in fade-in duration-150">
          {toastMessage}
        </div>
      )}

      {/* Floating Hearts spawned on double tap */}
      {heartParticles.map(h => (
        <div
          key={h.id}
          className="pointer-events-none absolute z-40 -translate-x-1/2 -translate-y-1/2 animate-float-heart"
          style={{ left: `${h.x}px`, top: `${h.y}px` }}
        >
          <Heart className="w-20 h-20 fill-rose-600 text-rose-500 drop-shadow-[0_0_16px_rgba(225,29,72,0.9)]" />
        </div>
      ))}

      {/* Video Element */}
      {!hasError ? (
        <video
          ref={videoRef}
          src={video.videoUrl}
          poster={video.thumbnailUrl}
          className="w-full h-full object-cover"
          playsInline
          loop
          muted={isMuted}
          onTimeUpdate={handleTimeUpdate}
          onError={() => setHasError(true)}
        />
      ) : (
        /* Graceful high-fidelity scenic fallback visualizer if CDN video is restricted */
        <div className="relative w-full h-full flex flex-col justify-end bg-gradient-to-b from-zinc-900 via-rose-950/40 to-black overflow-hidden">
          {video.thumbnailUrl && (
            <img
              src={video.thumbnailUrl}
              alt={video.caption}
              className="absolute inset-0 w-full h-full object-cover filter brightness-75 scale-105"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />

          {/* Sound wave simulation */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 p-4 rounded-2xl bg-black/50 backdrop-blur-md border border-rose-500/30">
            <span className="w-1.5 bg-rose-500 rounded-full animate-audio-bar-1" />
            <span className="w-1.5 bg-rose-400 rounded-full animate-audio-bar-2" />
            <span className="w-1.5 bg-rose-500 rounded-full animate-audio-bar-3" />
            <span className="text-xs font-bold text-white ml-2 tracking-wide">Playing Nepal Audio</span>
          </div>
        </div>
      )}

      {/* Center Paused Indicator */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
          <div className="w-18 h-18 rounded-full bg-black/40 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white scale-110 shadow-2xl animate-in zoom-in-75 duration-150">
            <Play className="w-9 h-9 fill-white ml-1 text-white" />
          </div>
        </div>
      )}

      {/* Dark Vignette Gradients for readability */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/90 pointer-events-none" />

      {/* Right Action Column */}
      <div
        className="absolute right-2 bottom-20 z-30 flex flex-col items-center gap-4.5 pointer-events-auto"
        onClick={e => e.stopPropagation()}
      >
        {/* Creator Avatar & Follow Button */}
        <div className="relative flex flex-col items-center mb-1">
          <button
            onClick={handleCreatorClick}
            className="w-11 h-11 rounded-full p-0.5 border-2 border-white/80 overflow-hidden shadow-lg hover:scale-105 transition active:scale-95 bg-black"
          >
            <img
              src={video.creator.avatar}
              alt={video.creator.displayName}
              className="w-full h-full rounded-full object-cover"
            />
          </button>

          {/* Follow Plus Badge */}
          {currentUser?.id !== video.creator.id && (
            <button
              onClick={handleFollowClick}
              className={`absolute -bottom-2 w-5 h-5 rounded-full flex items-center justify-center shadow-md transition-all active:scale-90 ${
                video.creator.isFollowing
                  ? 'bg-zinc-700 text-white'
                  : 'bg-rose-600 text-white hover:bg-rose-500 ring-2 ring-black'
              }`}
            >
              {video.creator.isFollowing ? (
                <Check className="w-3 h-3 stroke-[3px]" />
              ) : (
                <Plus className="w-3.5 h-3.5 stroke-[3px]" />
              )}
            </button>
          )}
        </div>

        {/* Like Button */}
        <button
          onClick={handleLikeClick}
          className="flex flex-col items-center group transition active:scale-125"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center drop-shadow-md">
            <Heart
              className={`w-7 h-7 transition-colors ${
                video.isLiked
                  ? 'fill-rose-600 text-rose-500 scale-110 drop-shadow-[0_0_10px_rgba(244,63,94,0.8)]'
                  : 'text-white group-hover:text-rose-400'
              }`}
            />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow">
            {formatCount(video.likesCount)}
          </span>
        </button>

        {/* Comment Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            setIsCommentsOpen(true);
          }}
          className="flex flex-col items-center group transition active:scale-125"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center drop-shadow-md">
            <MessageCircle className="w-7 h-7 text-white group-hover:text-cyan-400 transition-colors" />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow">
            {formatCount(video.commentsCount)}
          </span>
        </button>

        {/* Bookmark Button */}
        <button
          onClick={handleBookmarkClick}
          className="flex flex-col items-center group transition active:scale-125"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center drop-shadow-md">
            <Bookmark
              className={`w-7 h-7 transition-colors ${
                video.isBookmarked
                  ? 'fill-amber-400 text-amber-400 scale-110 drop-shadow-[0_0_10px_rgba(251,191,36,0.8)]'
                  : 'text-white group-hover:text-amber-400'
              }`}
            />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow">
            {formatCount(video.bookmarksCount)}
          </span>
        </button>

        {/* Share Button */}
        <button
          onClick={e => {
            e.stopPropagation();
            setIsShareOpen(true);
          }}
          className="flex flex-col items-center group transition active:scale-125"
        >
          <div className="w-10 h-10 rounded-full flex items-center justify-center drop-shadow-md">
            <Share2 className="w-7 h-7 text-white group-hover:text-emerald-400 transition-colors" />
          </div>
          <span className="text-[11px] font-bold text-white drop-shadow">
            {formatCount(video.sharesCount)}
          </span>
        </button>

        {/* Vinyl Audio Disc */}
        <div className="relative mt-2">
          <div
            className={`w-10 h-10 rounded-full bg-gradient-to-tr from-zinc-950 via-zinc-800 to-zinc-950 p-1 border-2 border-zinc-700/80 shadow-2xl ${
              isPlaying ? 'animate-spin-slow' : ''
            }`}
          >
            <img
              src={video.creator.avatar}
              alt="Music Disc"
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          {/* Audio notes floating */}
          {isPlaying && (
            <div className="absolute -top-3 -left-2 text-rose-400 animate-float-heart text-xs pointer-events-none">
              🎵
            </div>
          )}
        </div>
      </div>

      {/* Bottom Information Column */}
      <div
        className="absolute left-3 right-16 bottom-16 z-20 flex flex-col text-left pointer-events-auto pr-2"
        onClick={e => e.stopPropagation()}
      >
        {/* Creator Name & Verification */}
        <div className="flex items-center gap-2 mb-1">
          <button
            onClick={handleCreatorClick}
            className="text-sm font-bold text-white hover:underline flex items-center gap-1 drop-shadow"
          >
            @{video.creator.username}
          </button>
          {video.creator.verified && (
            <span className="inline-flex items-center justify-center w-3.5 h-3.5 rounded-full bg-cyan-500 text-black text-[9px] font-black">
              ✓
            </span>
          )}
          <span className="text-[11px] text-zinc-300 font-medium">· {video.createdAt}</span>
        </div>

        {/* Location Badge */}
        {video.location && (
          <div className="inline-flex items-center gap-1 self-start px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 text-[10px] text-zinc-200 mb-1.5">
            <MapPin className="w-2.5 h-2.5 text-rose-400" />
            <span>{video.location}</span>
          </div>
        )}

        {/* Caption & Hashtags */}
        <p className="text-xs text-zinc-100 line-clamp-2 leading-snug drop-shadow-md mb-2 break-words">
          {video.caption}
        </p>

        {/* Music Sound Bar with scrolling ticker */}
        <div className="flex items-center gap-2 text-xs text-white/90 drop-shadow">
          <div className="flex items-center gap-1.5 overflow-hidden">
            <Music className="w-3.5 h-3.5 shrink-0 text-rose-400 animate-pulse" />
            <div className="truncate font-medium text-[11px]">
              {video.musicTitle} · {video.musicArtist}
            </div>
          </div>
        </div>
      </div>

      {/* Draggable Progress Bar Scrubber at the very bottom */}
      <div
        className="absolute bottom-14 left-0 right-0 h-1.5 bg-white/20 hover:h-2.5 cursor-pointer transition-all z-20 group"
        onClick={handleSeek}
      >
        <div
          className="h-full bg-gradient-to-r from-rose-600 via-rose-500 to-amber-400 rounded-r relative"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>

      {/* Comments Modal Bottom Sheet */}
      <CommentsModal
        video={video}
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
      />

      {/* Share Modal Bottom Sheet */}
      <ShareModal
        video={video}
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
      />
    </div>
  );
};
