import React from 'react';
import { Home, Compass, Plus, MessageCircle, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, currentUser, notifications } = useApp();

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <nav className="absolute bottom-0 left-0 right-0 z-30 h-14 bg-black/95 backdrop-blur-xl border-t border-zinc-900/80 flex items-center justify-around px-2 pb-safe select-none">
      {/* Home */}
      <button
        onClick={() => setActiveTab('home')}
        className={`flex flex-col items-center justify-center w-14 py-1 transition-all active:scale-95 ${
          activeTab === 'home' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Home className={`w-5 h-5 ${activeTab === 'home' ? 'stroke-[2.5px] text-white' : 'stroke-[1.75px]'}`} />
        <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'home' ? 'font-bold text-white' : 'font-medium'}`}>
          Home
        </span>
      </button>

      {/* Discover */}
      <button
        onClick={() => setActiveTab('discover')}
        className={`flex flex-col items-center justify-center w-14 py-1 transition-all active:scale-95 ${
          activeTab === 'discover' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <Compass className={`w-5 h-5 ${activeTab === 'discover' ? 'stroke-[2.5px] text-white' : 'stroke-[1.75px]'}`} />
        <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'discover' ? 'font-bold text-white' : 'font-medium'}`}>
          Discover
        </span>
      </button>

      {/* Upload (+ Button) - TikTok Signature Style with Nepal Crimson accent */}
      <button
        onClick={() => setActiveTab('upload')}
        className="flex items-center justify-center w-12 h-8 relative group active:scale-90 transition-transform my-auto"
        title="Upload Video from Android or PC"
      >
        {/* Left cyan/white glow tab */}
        <div className="absolute inset-0 bg-cyan-400 rounded-lg -translate-x-0.5 group-hover:-translate-x-1 transition-transform" />
        {/* Right Nepal crimson glow tab */}
        <div className="absolute inset-0 bg-rose-600 rounded-lg translate-x-0.5 group-hover:translate-x-1 transition-transform" />
        {/* Center white button */}
        <div className="relative w-10 h-7 bg-white rounded-md flex items-center justify-center text-black font-extrabold shadow-md">
          <Plus className="w-5 h-5 text-black stroke-[3px]" />
        </div>
      </button>

      {/* Inbox */}
      <button
        onClick={() => setActiveTab('inbox')}
        className={`flex flex-col items-center justify-center w-14 py-1 relative transition-all active:scale-95 ${
          activeTab === 'inbox' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        <div className="relative">
          <MessageCircle className={`w-5 h-5 ${activeTab === 'inbox' ? 'stroke-[2.5px] text-white' : 'stroke-[1.75px]'}`} />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 bg-rose-600 text-white text-[9px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center border border-black shadow-sm">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          )}
        </div>
        <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'inbox' ? 'font-bold text-white' : 'font-medium'}`}>
          Inbox
        </span>
      </button>

      {/* Profile */}
      <button
        onClick={() => setActiveTab('profile')}
        className={`flex flex-col items-center justify-center w-14 py-1 transition-all active:scale-95 ${
          activeTab === 'profile' ? 'text-white' : 'text-zinc-400 hover:text-zinc-200'
        }`}
      >
        {currentUser?.avatar ? (
          <img
            src={currentUser.avatar}
            alt={currentUser.displayName}
            className={`w-5 h-5 rounded-full object-cover border ${
              activeTab === 'profile' ? 'border-rose-500 ring-1 ring-rose-500' : 'border-zinc-700'
            }`}
          />
        ) : (
          <UserIcon className={`w-5 h-5 ${activeTab === 'profile' ? 'stroke-[2.5px] text-white' : 'stroke-[1.75px]'}`} />
        )}
        <span className={`text-[10px] mt-0.5 tracking-tight ${activeTab === 'profile' ? 'font-bold text-white' : 'font-medium'}`}>
          Profile
        </span>
      </button>
    </nav>
  );
};
