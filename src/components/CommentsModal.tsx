import React, { useState } from 'react';
import { X, Heart, Send, MessageCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { VideoItem } from '../types';

interface CommentsModalProps {
  video: VideoItem;
  isOpen: boolean;
  onClose: () => void;
}

export const CommentsModal: React.FC<CommentsModalProps> = ({ video, isOpen, onClose }) => {
  const { comments, addComment, toggleLikeComment, currentUser, setIsAuthModalOpen } = useApp();
  const [commentText, setCommentText] = useState('');

  if (!isOpen) return null;

  const videoComments = comments[video.id] || [];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }
    if (!commentText.trim()) return;

    addComment(video.id, commentText);
    setCommentText('');
  };

  const handleAddEmoji = (emoji: string) => {
    setCommentText(prev => prev + emoji);
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col justify-end pointer-events-auto">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="relative w-full max-h-[72vh] h-[68vh] bg-[#141419] rounded-t-2xl flex flex-col border-t border-zinc-800 shadow-2xl z-10 animate-in slide-in-from-bottom duration-200">
        {/* Drag handle & Header */}
        <div className="p-3 border-b border-zinc-800/80 flex items-center justify-between">
          <div className="w-8" />
          <div className="flex flex-col items-center">
            <div className="w-10 h-1 bg-zinc-700 rounded-full mb-2" />
            <span className="text-xs font-bold text-zinc-200 tracking-wide">
              {videoComments.length} {videoComments.length === 1 ? 'Comment' : 'Comments'}
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-zinc-400 hover:text-white hover:bg-zinc-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 no-scrollbar">
          {videoComments.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 text-zinc-400">
              <MessageCircle className="w-12 h-12 stroke-1 text-zinc-600 mb-2" />
              <p className="text-sm font-semibold text-zinc-300">No comments yet</p>
              <p className="text-xs text-zinc-500 mt-1">Be the first Nepali creator to share thoughts!</p>
            </div>
          ) : (
            videoComments.map(comment => (
              <div key={comment.id} className="flex gap-3 group">
                <img
                  src={comment.userAvatar}
                  alt={comment.username}
                  className="w-8 h-8 rounded-full object-cover shrink-0 border border-zinc-700"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-zinc-300 hover:text-rose-400 cursor-pointer">
                      @{comment.username}
                    </span>
                    <span className="text-[10px] text-zinc-500">{comment.timestamp}</span>
                  </div>
                  <p className="text-xs text-zinc-100 mt-0.5 leading-relaxed break-words">
                    {comment.text}
                  </p>
                  <div className="flex items-center gap-4 mt-1.5 text-[10px] text-zinc-400">
                    <button className="hover:text-zinc-200 font-medium">Reply</button>
                  </div>
                </div>

                {/* Like Comment */}
                <button
                  onClick={() => toggleLikeComment(video.id, comment.id)}
                  className="flex flex-col items-center self-start pt-1 text-zinc-400 hover:text-rose-500 transition active:scale-125"
                >
                  <Heart
                    className={`w-3.5 h-3.5 ${
                      comment.isLiked ? 'fill-rose-500 text-rose-500' : 'text-zinc-500'
                    }`}
                  />
                  {comment.likes > 0 && (
                    <span className={`text-[10px] mt-0.5 ${comment.isLiked ? 'text-rose-500 font-bold' : ''}`}>
                      {comment.likes}
                    </span>
                  )}
                </button>
              </div>
            ))
          )}
        </div>

        {/* Emoji Bar */}
        <div className="px-4 py-1.5 flex items-center gap-2 overflow-x-auto border-t border-zinc-800/60 no-scrollbar bg-black/20">
          {['❤️', '🔥', '🇳🇵', '🙏', '👏', '🤤', '✨', '😂'].map(emoji => (
            <button
              key={emoji}
              onClick={() => handleAddEmoji(emoji)}
              className="text-base p-1 hover:scale-125 transition-transform"
            >
              {emoji}
            </button>
          ))}
        </div>

        {/* Comment Input */}
        <form onSubmit={handleSubmit} className="p-3 bg-[#181820] border-t border-zinc-800 flex items-center gap-2">
          {currentUser ? (
            <img
              src={currentUser.avatar}
              alt={currentUser.displayName}
              className="w-7 h-7 rounded-full object-cover shrink-0 border border-zinc-700"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-zinc-700 shrink-0" />
          )}

          <input
            type="text"
            value={commentText}
            onChange={e => setCommentText(e.target.value)}
            placeholder={currentUser ? 'Add comment for Nepal creators...' : 'Sign in to comment...'}
            className="flex-1 bg-zinc-900/90 text-xs text-white placeholder-zinc-500 px-3 py-2 rounded-full border border-zinc-700/80 focus:outline-none focus:border-rose-500 transition"
          />

          <button
            type="submit"
            disabled={!commentText.trim()}
            className={`p-2 rounded-full transition active:scale-90 ${
              commentText.trim()
                ? 'bg-rose-600 text-white shadow-md hover:bg-rose-500'
                : 'text-zinc-500 hover:text-zinc-400'
            }`}
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
