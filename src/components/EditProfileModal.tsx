import React, { useState } from 'react';
import { X, Check, Camera, Image } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const EditProfileModal: React.FC = () => {
  const { isEditProfileOpen, setIsEditProfileOpen, currentUser, updateProfile } = useApp();

  const [displayName, setDisplayName] = useState(currentUser?.displayName || '');
  const [username, setUsername] = useState(currentUser?.username || '');
  const [bio, setBio] = useState(currentUser?.bio || '');
  const [location, setLocation] = useState(currentUser?.location || 'Kathmandu, Nepal');
  const [avatarUrl, setAvatarUrl] = useState(currentUser?.avatar || '');

  if (!isEditProfileOpen || !currentUser) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      displayName: displayName.trim(),
      username: username.trim().toLowerCase(),
      bio: bio.trim(),
      location: location.trim(),
      avatar: avatarUrl.trim() || currentUser.avatar,
    });
    setIsEditProfileOpen(false);
  };

  const PRESET_AVATARS = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm pointer-events-auto">
      <div className="relative w-full max-w-sm rounded-2xl bg-[#14141C] border border-zinc-800 p-5 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <span className="text-xs font-bold text-white uppercase tracking-wider">
            Edit Profile
          </span>
          <button
            onClick={() => setIsEditProfileOpen(false)}
            className="p-1 rounded-full text-zinc-400 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3 mt-4">
          {/* Avatar Preview */}
          <div className="flex flex-col items-center">
            <div className="relative">
              <img
                src={avatarUrl || currentUser.avatar}
                alt="Profile Avatar"
                className="w-18 h-18 rounded-full object-cover border-2 border-rose-500 shadow-md"
              />
            </div>
            <span className="text-[10px] text-zinc-400 mt-1.5">Choose avatar preset:</span>
            <div className="flex gap-2 mt-1">
              {PRESET_AVATARS.map((url, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setAvatarUrl(url)}
                  className={`w-7 h-7 rounded-full overflow-hidden border transition ${
                    avatarUrl === url ? 'border-rose-500 ring-2 ring-rose-500' : 'border-zinc-700'
                  }`}
                >
                  <img src={url} alt="preset" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
              Display Name
            </label>
            <input
              type="text"
              required
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              className="w-full bg-zinc-900 text-xs text-white px-3 py-2 rounded-xl border border-zinc-700 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={e => setUsername(e.target.value)}
              className="w-full bg-zinc-900 text-xs text-white px-3 py-2 rounded-xl border border-zinc-700 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
              Location
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. Kathmandu, Pokhara, Dharan"
              className="w-full bg-zinc-900 text-xs text-white px-3 py-2 rounded-xl border border-zinc-700 focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="text-[11px] font-semibold text-zinc-300 block mb-1">
              Bio
            </label>
            <textarea
              rows={2}
              maxLength={120}
              value={bio}
              onChange={e => setBio(e.target.value)}
              className="w-full bg-zinc-900 text-xs text-white px-3 py-2 rounded-xl border border-zinc-700 focus:outline-none focus:border-rose-500 resize-none"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditProfileOpen(false)}
              className="flex-1 py-2.5 rounded-xl bg-zinc-800 text-xs font-semibold text-zinc-300 hover:bg-zinc-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white shadow-md"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
