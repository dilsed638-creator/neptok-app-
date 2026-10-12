import React, { useState } from 'react';
import { X, Copy, Check, Share2, Download, Send, MessageCircle } from 'lucide-react';
import { VideoItem } from '../types';
import { useApp } from '../context/AppContext';

interface ShareModalProps {
  video: VideoItem;
  isOpen: boolean;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ video, isOpen, onClose }) => {
  const { allCreators } = useApp();
  const [copied, setCopied] = useState(false);
  const [sentFriendId, setSentFriendId] = useState<string | null>(null);

  if (!isOpen) return null;

  const currentUrl = window.location.href;
  const shareText = `Watch "${video.caption.substring(0, 40)}..." by @${video.creator.username} on NepTok 🇳🇵`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${currentUrl}#${video.id}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `NepTok: ${video.caption.substring(0, 30)}`,
          text: shareText,
          url: currentUrl,
        });
      } catch {
        // User cancelled or failed
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSendToFriend = (friendId: string) => {
    setSentFriendId(friendId);
    setTimeout(() => setSentFriendId(null), 2500);
  };

  const handleSocialShare = (platform: string) => {
    let url = '';
    const encodedText = encodeURIComponent(shareText);
    const encodedUrl = encodeURIComponent(currentUrl);

    switch (platform) {
      case 'whatsapp':
        url = `https://api.whatsapp.com/send?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'facebook':
        url = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'twitter':
        url = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'telegram':
        url = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
    }

    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      {/* Drawer */}
      <div className="relative w-full bg-[#141419] rounded-t-2xl flex flex-col border-t border-zinc-800 shadow-2xl z-10 p-4 pb-6 animate-in slide-in-from-bottom duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div className="w-6" />
          <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">
            Share to
          </span>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Send to Friends */}
        <div className="py-3">
          <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide block mb-2">
            Send via Direct Message
          </span>
          <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
            {allCreators.slice(0, 5).map(creator => (
              <button
                key={creator.id}
                onClick={() => handleSendToFriend(creator.id)}
                className="flex flex-col items-center gap-1 min-w-[56px] group transition active:scale-95"
              >
                <div className="relative">
                  <img
                    src={creator.avatar}
                    alt={creator.displayName}
                    className="w-12 h-12 rounded-full object-cover border-2 border-zinc-700 group-hover:border-rose-500 transition"
                  />
                  {sentFriendId === creator.id ? (
                    <div className="absolute inset-0 bg-rose-600/90 rounded-full flex items-center justify-center text-white">
                      <Check className="w-5 h-5 stroke-[3px]" />
                    </div>
                  ) : (
                    <div className="absolute -bottom-1 -right-1 bg-zinc-800 rounded-full p-1 border border-zinc-600">
                      <Send className="w-2.5 h-2.5 text-zinc-300" />
                    </div>
                  )}
                </div>
                <span className="text-[10px] text-zinc-300 truncate max-w-[60px]">
                  {sentFriendId === creator.id ? 'Sent!' : creator.displayName.split(' ')[0]}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Share options icons */}
        <div className="py-3 border-t border-zinc-800/80">
          <div className="grid grid-cols-4 gap-3">
            {/* Copy Link */}
            <button
              onClick={handleCopyLink}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-zinc-800/60 transition active:scale-95"
            >
              <div className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-zinc-100">
                {copied ? <Check className="w-5 h-5 text-emerald-400 stroke-[3px]" /> : <Copy className="w-5 h-5" />}
              </div>
              <span className="text-[10px] text-zinc-300 font-medium">
                {copied ? 'Copied!' : 'Copy Link'}
              </span>
            </button>

            {/* WhatsApp */}
            <button
              onClick={() => handleSocialShare('whatsapp')}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-zinc-800/60 transition active:scale-95"
            >
              <div className="w-11 h-11 rounded-full bg-emerald-600 flex items-center justify-center shadow-lg text-white">
                <MessageCircle className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-zinc-300 font-medium">WhatsApp</span>
            </button>

            {/* Native Mobile Share */}
            <button
              onClick={handleNativeShare}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-zinc-800/60 transition active:scale-95"
            >
              <div className="w-11 h-11 rounded-full bg-rose-600 flex items-center justify-center shadow-lg text-white">
                <Share2 className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-zinc-300 font-medium">More Options</span>
            </button>

            {/* Save Video */}
            <button
              onClick={() => {
                alert(`Video link copied! On Android APK, videos can be saved directly to phone storage.`);
                onClose();
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-zinc-800/60 transition active:scale-95"
            >
              <div className="w-11 h-11 rounded-full bg-zinc-800 flex items-center justify-center border border-zinc-700 text-zinc-300">
                <Download className="w-5 h-5" />
              </div>
              <span className="text-[10px] text-zinc-300 font-medium">Save Video</span>
            </button>
          </div>
        </div>

        {/* Cancel button */}
        <button
          onClick={onClose}
          className="mt-2 w-full py-2.5 rounded-xl bg-zinc-800/80 text-xs font-semibold text-zinc-300 hover:bg-zinc-700 hover:text-white transition"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};
