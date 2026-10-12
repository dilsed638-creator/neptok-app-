import React, { useState } from 'react';
import { Search, Flame, Music, UserPlus, UserCheck, Play, Hash, MapPin, X } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRENDING_TAGS, TRENDING_SOUNDS } from '../data/demoData';
import { User, VideoItem } from '../types';

export const DiscoverView: React.FC = () => {
  const {
    videos,
    allCreators,
    toggleFollowUser,
    setViewingCreator,
    setActiveTab,
    setActiveVideoIndex,
    setCurrentFeedTab,
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'top' | 'users' | 'videos' | 'sounds'>('top');

  // Filter items based on query
  const query = searchQuery.toLowerCase().trim();

  const filteredVideos = videos.filter(v =>
    !query ||
    v.caption.toLowerCase().includes(query) ||
    v.creator.username.toLowerCase().includes(query) ||
    v.creator.displayName.toLowerCase().includes(query) ||
    v.location.toLowerCase().includes(query) ||
    v.hashtags.some(h => h.toLowerCase().includes(query))
  );

  const filteredUsers = allCreators.filter(u =>
    !query ||
    u.username.toLowerCase().includes(query) ||
    u.displayName.toLowerCase().includes(query) ||
    u.bio.toLowerCase().includes(query) ||
    (u.location && u.location.toLowerCase().includes(query))
  );

  const filteredSounds = TRENDING_SOUNDS.filter(s =>
    !query ||
    s.title.toLowerCase().includes(query) ||
    s.artist.toLowerCase().includes(query)
  );

  const handleSelectVideo = (video: VideoItem) => {
    const idx = videos.findIndex(v => v.id === video.id);
    if (idx !== -1) {
      setActiveVideoIndex(idx);
    }
    setCurrentFeedTab('foryou');
    setActiveTab('home');
  };

  const handleSelectCreator = (creator: User) => {
    setViewingCreator(creator);
    setActiveTab('profile');
  };

  const handleTagClick = (tag: string) => {
    setSearchQuery(tag.replace('#', ''));
  };

  return (
    <div className="w-full h-full bg-[#0B0B0E] flex flex-col pb-16 overflow-y-auto no-scrollbar">
      {/* Top Search Header */}
      <div className="sticky top-0 z-20 bg-[#0B0B0E]/95 backdrop-blur-md px-4 pt-4 pb-2 border-b border-zinc-900">
        <div className="relative flex items-center">
          <Search className="absolute left-3 w-4 h-4 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search creators, #Nepal, sounds, locations..."
            className="w-full bg-[#181822] text-xs text-white placeholder-zinc-500 pl-9 pr-8 py-2.5 rounded-full border border-zinc-800 focus:outline-none focus:border-rose-500 transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 p-0.5 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
          {[
            { id: 'top', label: 'Top' },
            { id: 'videos', label: 'Videos' },
            { id: 'users', label: 'Creators' },
            { id: 'sounds', label: 'Sounds' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3.5 py-1 text-xs font-semibold rounded-full transition ${
                activeFilter === tab.id
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Featured Banner (Hero Carousel of Nepal Highlights) */}
      {!searchQuery && activeFilter === 'top' && (
        <div className="p-4">
          <div className="relative rounded-2xl overflow-hidden bg-gradient-to-r from-rose-950 via-zinc-900 to-black border border-rose-600/30 p-5 shadow-xl">
            <div className="absolute right-2 top-2 opacity-15">
              <span className="text-7xl font-black text-rose-500">🇳🇵</span>
            </div>
            <div className="relative z-10">
              <span className="px-2.5 py-0.5 rounded-full bg-rose-600/80 text-[10px] font-bold text-white uppercase tracking-wider">
                Trending in Nepal
              </span>
              <h2 className="text-lg font-extrabold text-white mt-2 leading-tight">
                #DiscoverNepal 2026
              </h2>
              <p className="text-xs text-zinc-300 mt-1 max-w-xs">
                Celebrate the beauty of the Himalayas, ancient culture, vibrant street foods and youth creativity.
              </p>
              <button
                onClick={() => handleTagClick('#DiscoverNepal')}
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-black text-xs font-bold hover:bg-zinc-200 transition active:scale-95 shadow-md"
              >
                <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
                Explore 1.2M Videos
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Trending Hashtags Section */}
      {(!searchQuery || activeFilter === 'top') && (
        <div className="px-4 py-2">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-zinc-300 tracking-wider uppercase flex items-center gap-1.5">
              <Hash className="w-3.5 h-3.5 text-rose-500" />
              Trending Hashtags
            </h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {TRENDING_TAGS.map(t => (
              <button
                key={t.tag}
                onClick={() => handleTagClick(t.tag)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition active:scale-95 ${
                  t.isTrending
                    ? 'bg-rose-950/30 border-rose-500/40 text-rose-300 hover:bg-rose-900/40'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:bg-zinc-800'
                }`}
              >
                <span>{t.tag}</span>
                <span className="text-[10px] text-zinc-500">({t.count})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Featured Nepali Creators */}
      {(activeFilter === 'top' || activeFilter === 'users') && (
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-zinc-300 tracking-wider uppercase flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-rose-500" />
              Popular Nepali Creators
            </h3>
          </div>
          <div className="space-y-2.5">
            {filteredUsers.slice(0, 5).map(creator => (
              <div
                key={creator.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#14141C] border border-zinc-800/80 hover:border-zinc-700 transition"
              >
                <div
                  className="flex items-center gap-3 cursor-pointer min-w-0"
                  onClick={() => handleSelectCreator(creator)}
                >
                  <img
                    src={creator.avatar}
                    alt={creator.displayName}
                    className="w-10 h-10 rounded-full object-cover border border-zinc-700 shrink-0"
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {creator.displayName}
                      </span>
                      {creator.verified && (
                        <span className="w-3.5 h-3.5 rounded-full bg-cyan-500 text-black text-[9px] font-bold flex items-center justify-center shrink-0">
                          ✓
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-zinc-400 block truncate">
                      @{creator.username}
                    </span>
                    {creator.location && (
                      <span className="text-[10px] text-zinc-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-2.5 h-2.5 text-rose-400" />
                        {creator.location}
                      </span>
                    )}
                  </div>
                </div>

                {/* Follow Button */}
                <button
                  onClick={() => toggleFollowUser(creator.id)}
                  className={`px-3 py-1.5 rounded-full text-xs font-bold flex items-center gap-1 shrink-0 transition active:scale-95 ${
                    creator.isFollowing
                      ? 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700 border border-zinc-700'
                      : 'bg-rose-600 text-white hover:bg-rose-500 shadow-sm'
                  }`}
                >
                  {creator.isFollowing ? (
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
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trending Sounds Section */}
      {(activeFilter === 'top' || activeFilter === 'sounds') && (
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-zinc-300 tracking-wider uppercase flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-rose-500" />
              Trending Nepali Audio Tracks
            </h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {filteredSounds.map(sound => (
              <div
                key={sound.id}
                className="flex items-center justify-between p-2.5 rounded-xl bg-[#14141C] border border-zinc-800/80"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-rose-950/60 border border-rose-500/30 flex items-center justify-center text-rose-400 shrink-0">
                    <Music className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-bold text-white truncate block">
                      {sound.title}
                    </span>
                    <span className="text-[10px] text-zinc-400 truncate block">
                      {sound.artist} · {sound.uses}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleTagClick(sound.title.split(' ')[0])}
                  className="px-2 py-1 rounded bg-zinc-800 hover:bg-rose-600 hover:text-white text-[10px] font-semibold text-zinc-300 transition"
                >
                  Use Sound
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Video Grid Section */}
      {(activeFilter === 'top' || activeFilter === 'videos') && (
        <div className="px-4 py-3">
          <div className="flex items-center justify-between mb-2.5">
            <h3 className="text-xs font-bold text-zinc-300 tracking-wider uppercase flex items-center gap-1.5">
              <Play className="w-3.5 h-3.5 text-rose-500" />
              Trending Videos
            </h3>
            <span className="text-[11px] text-zinc-500">{filteredVideos.length} clips</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {filteredVideos.map(video => (
              <div
                key={video.id}
                onClick={() => handleSelectVideo(video)}
                className="relative aspect-[9/14] rounded-xl overflow-hidden bg-zinc-900 border border-zinc-800/80 group cursor-pointer shadow-md hover:border-rose-500/50 transition-all"
              >
                {/* Thumbnail image or video snapshot */}
                <img
                  src={video.thumbnailUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80'}
                  alt={video.caption}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Dark gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Play icon overlay */}
                <div className="absolute top-2 right-2 p-1 rounded-full bg-black/40 backdrop-blur-sm text-white">
                  <Play className="w-3 h-3 fill-white text-white" />
                </div>

                {/* Views count */}
                <div className="absolute bottom-2 left-2 right-2">
                  <p className="text-[11px] font-bold text-white line-clamp-1 drop-shadow mb-0.5">
                    {video.caption}
                  </p>
                  <div className="flex items-center justify-between text-[10px] text-zinc-300">
                    <span>@{video.creator.username}</span>
                    <span className="font-semibold">{video.viewsCount > 1000 ? `${(video.viewsCount/1000).toFixed(0)}K` : video.viewsCount} views</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
