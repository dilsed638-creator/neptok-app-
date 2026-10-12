import React, { useState } from 'react';
import { Settings, Edit3, Grid, Heart, Bookmark, MapPin, Share2, LogOut, ArrowLeft, UserPlus, UserCheck, Smartphone, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VideoItem } from '../types';

export const ProfileView: React.FC = () => {
  const {
    currentUser,
    viewingCreator,
    setViewingCreator,
    videos,
    toggleFollowUser,
    setActiveVideoIndex,
    setActiveTab,
    setCurrentFeedTab,
    setIsEditProfileOpen,
    setIsApkGuideOpen,
    setIsAuthModalOpen,
    logout,
  } = useApp();

  const [activeTabSection, setActiveTabSection] = useState<'videos' | 'liked' | 'bookmarks'>('videos');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isSettingsMenuOpen, setIsSettingsMenuOpen] = useState(false);

  // Decide if viewing own profile or another creator's profile
  const isSelf = !viewingCreator || viewingCreator.id === currentUser?.id;
  const targetUser = isSelf ? currentUser : viewingCreator;

  if (!targetUser) {
    return (
      <div className="w-full h-full bg-[#0B0B0E] flex flex-col items-center justify-center p-6 text-center">
        <h3 className="text-base font-bold text-white mb-2">You are browsing as Guest</h3>
        <p className="text-xs text-zinc-400 mb-6">Log in or sign up to view your profile, post videos, and customize your account.</p>
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="px-6 py-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-lg transition active:scale-95"
        >
          Sign In or Sign Up
        </button>
      </div>
    );
  }

  // Filter videos for the profile tabs
  const userVideos = videos.filter(v => v.creator.id === targetUser.id);
  const likedVideos = videos.filter(v => v.isLiked);
  const bookmarkedVideos = videos.filter(v => v.isBookmarked);

  let displayedVideos: VideoItem[] = [];
  if (activeTabSection === 'videos') displayedVideos = userVideos;
  else if (activeTabSection === 'liked') displayedVideos = likedVideos;
  else if (activeTabSection === 'bookmarks') displayedVideos = bookmarkedVideos;

  const handlePlayVideo = (video: VideoItem) => {
    const idx = videos.findIndex(v => v.id === video.id);
    if (idx !== -1) {
      setActiveVideoIndex(idx);
    }
    setCurrentFeedTab('foryou');
    setActiveTab('home');
  };

  const handleShareProfile = () => {
    navigator.clipboard.writeText(`${window.location.origin}/@${targetUser.username}`);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="w-full h-full bg-[#0B0B0E] flex flex-col pb-16 overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-[#0B0B0E]/95 backdrop-blur-md px-4 py-3 border-b border-zinc-900 flex items-center justify-between">
        {!isSelf ? (
          <button
            onClick={() => setViewingCreator(null)}
            className="p-1 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        ) : (
          <div className="w-5" />
        )}

        <span className="text-xs font-bold text-white">
          @{targetUser.username}
        </span>

        <div className="flex items-center gap-2">
          {isSelf && (
            <div className="relative">
              <button
                onClick={() => setIsSettingsMenuOpen(!isSettingsMenuOpen)}
                className="p-1.5 rounded-full text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
              >
                <Settings className="w-4 h-4" />
              </button>

              {/* Settings Dropdown */}
              {isSettingsMenuOpen && (
                <div className="absolute right-0 top-8 w-48 rounded-xl bg-[#181822] border border-zinc-800 p-1.5 shadow-2xl z-30 animate-in fade-in zoom-in-95 duration-150">
                  <button
                    onClick={() => {
                      setIsApkGuideOpen(true);
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-emerald-400 hover:bg-zinc-800/80 rounded-lg flex items-center gap-2"
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    Android APK Setup
                  </button>
                  <button
                    onClick={() => {
                      setIsEditProfileOpen(true);
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800/80 rounded-lg flex items-center gap-2"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Edit Profile
                  </button>
                  <button
                    onClick={() => {
                      logout();
                      setIsSettingsMenuOpen(false);
                    }}
                    className="w-full text-left px-3 py-2 text-xs font-medium text-rose-400 hover:bg-rose-950/40 rounded-lg flex items-center gap-2 border-t border-zinc-800/80 mt-1"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Log Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* User Info Header */}
      <div className="flex flex-col items-center px-4 pt-4 pb-2 text-center">
        {/* Avatar */}
        <div className="relative mb-3">
          <img
            src={targetUser.avatar}
            alt={targetUser.displayName}
            className="w-22 h-22 rounded-full object-cover border-2 border-rose-500 shadow-xl"
          />
          {targetUser.verified && (
            <span className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-cyan-500 text-black text-xs font-black flex items-center justify-center border-2 border-black">
              ✓
            </span>
          )}
        </div>

        {/* Display Name & Username */}
        <h2 className="text-base font-extrabold text-white flex items-center gap-1.5">
          {targetUser.displayName}
        </h2>
        <span className="text-xs text-zinc-400 mt-0.5">@{targetUser.username}</span>

        {/* Location if available */}
        {targetUser.location && (
          <div className="flex items-center gap-1 text-[11px] text-zinc-400 mt-1">
            <MapPin className="w-3 h-3 text-rose-500" />
            <span>{targetUser.location}</span>
          </div>
        )}

        {/* Stats Row */}
        <div className="flex items-center justify-center gap-8 my-4 py-2 border-y border-zinc-900 w-full max-w-xs">
          <div className="flex flex-col items-center">
            <span className="text-sm font-extrabold text-white">
              {targetUser.followingCount}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">Following</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-extrabold text-white">
              {targetUser.followersCount > 1000
                ? `${(targetUser.followersCount / 1000).toFixed(1)}K`
                : targetUser.followersCount}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">Followers</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-extrabold text-white">
              {targetUser.likesCount > 1000
                ? `${(targetUser.likesCount / 1000).toFixed(1)}K`
                : targetUser.likesCount}
            </span>
            <span className="text-[10px] text-zinc-400 font-medium">Likes</span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-zinc-300 max-w-sm leading-relaxed mb-4">
          {targetUser.bio}
        </p>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 w-full max-w-xs">
          {isSelf ? (
            <>
              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-white transition active:scale-95 border border-zinc-700/80 flex items-center justify-center gap-1.5"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Edit Profile
              </button>
              <button
                onClick={handleShareProfile}
                className="py-2 px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-300 transition active:scale-95 border border-zinc-700/80 flex items-center justify-center gap-1"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Copied' : 'Share'}</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => toggleFollowUser(targetUser.id)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition active:scale-95 flex items-center justify-center gap-1.5 shadow-md ${
                  targetUser.isFollowing
                    ? 'bg-zinc-800 text-zinc-200 border border-zinc-700 hover:bg-zinc-700'
                    : 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
                }`}
              >
                {targetUser.isFollowing ? (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    Following
                  </>
                ) : (
                  <>
                    <UserPlus className="w-3.5 h-3.5" />
                    Follow
                  </>
                )}
              </button>
              <button
                onClick={() => {
                  setActiveTab('inbox');
                  setViewingCreator(null);
                }}
                className="flex-1 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition active:scale-95 border border-zinc-700/80"
              >
                Message
              </button>
            </>
          )}
        </div>
      </div>

      {/* Tabs Row */}
      <div className="flex border-b border-zinc-900 mt-3">
        <button
          onClick={() => setActiveTabSection('videos')}
          className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold transition border-b-2 ${
            activeTabSection === 'videos'
              ? 'text-white border-rose-500'
              : 'text-zinc-500 border-transparent hover:text-zinc-300'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Videos ({userVideos.length})</span>
        </button>

        {isSelf && (
          <>
            <button
              onClick={() => setActiveTabSection('liked')}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold transition border-b-2 ${
                activeTabSection === 'liked'
                  ? 'text-white border-rose-500'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              <Heart className="w-4 h-4" />
              <span>Liked ({likedVideos.length})</span>
            </button>

            <button
              onClick={() => setActiveTabSection('bookmarks')}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 text-xs font-bold transition border-b-2 ${
                activeTabSection === 'bookmarks'
                  ? 'text-white border-rose-500'
                  : 'text-zinc-500 border-transparent hover:text-zinc-300'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Saved ({bookmarkedVideos.length})</span>
            </button>
          </>
        )}
      </div>

      {/* Video Thumbnails Grid */}
      <div className="p-2">
        {displayedVideos.length === 0 ? (
          <div className="py-16 text-center text-zinc-500 text-xs">
            {activeTabSection === 'videos' && 'No videos uploaded yet.'}
            {activeTabSection === 'liked' && 'No liked videos yet.'}
            {activeTabSection === 'bookmarks' && 'No saved videos yet.'}
          </div>
        ) : (
          <div className="grid grid-cols-3 gap-1.5">
            {displayedVideos.map(vid => (
              <div
                key={vid.id}
                onClick={() => handlePlayVideo(vid)}
                className="relative aspect-[9/14] bg-zinc-900 rounded-md overflow-hidden group cursor-pointer border border-zinc-800/60 hover:border-rose-500/50"
              >
                <img
                  src={vid.thumbnailUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'}
                  alt={vid.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute bottom-1 left-1.5 text-[10px] font-bold text-white drop-shadow flex items-center gap-1">
                  <span>▶</span>
                  <span>{vid.viewsCount > 1000 ? `${(vid.viewsCount/1000).toFixed(0)}K` : vid.viewsCount}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
