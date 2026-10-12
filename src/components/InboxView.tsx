import React, { useState } from 'react';
import { Bell, Heart, MessageCircle, UserPlus, Sparkles, Check, Send, X, ArrowLeft } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { NotificationItem, User } from '../types';

interface Message {
  id: string;
  senderId: string;
  text: string;
  time: string;
  isSelf: boolean;
}

export const InboxView: React.FC = () => {
  const {
    notifications,
    markNotificationRead,
    allCreators,
    currentUser,
    setViewingCreator,
    setActiveTab,
    setActiveVideoIndex,
    videos,
  } = useApp();

  const [activeTab, setActiveTabState] = useState<'notifications' | 'messages'>('notifications');
  const [filterType, setFilterType] = useState<string>('all');
  const [activeChatUser, setActiveChatUser] = useState<User | null>(null);
  const [chatMessages, setChatMessages] = useState<Record<string, Message[]>>({
    'user_priyanka_pkr': [
      { id: 'm1', senderId: 'user_priyanka_pkr', text: 'Namaste Aarav! Loved your Thamel nightlife video 🔥', time: 'Yesterday', isSelf: false },
      { id: 'm2', senderId: 'user_aarav_ktm', text: 'Thank you Priyanka! The rooftop acoustic scene here is super lively.', time: 'Yesterday', isSelf: true },
      { id: 'm3', senderId: 'user_priyanka_pkr', text: 'You should definitely visit Pokhara next weekend! Let us do a collab reel by the lake.', time: '10:45 AM', isSelf: false },
    ],
    'user_himal_trekker': [
      { id: 'm4', senderId: 'user_himal_trekker', text: 'Heading up to Dingboche tomorrow. Internet is fast here at Namche!', time: '2 days ago', isSelf: false },
      { id: 'm5', senderId: 'user_aarav_ktm', text: 'Stay warm and safe bro! Can not wait to see summit footage.', time: '2 days ago', isSelf: true },
    ]
  });
  const [inputMessage, setInputMessage] = useState('');

  const filteredNotifs = notifications.filter(n => {
    if (filterType === 'all') return true;
    return n.type === filterType;
  });

  const handleNotificationClick = (notif: NotificationItem) => {
    markNotificationRead(notif.id);
    if (notif.videoId) {
      const idx = videos.findIndex(v => v.id === notif.videoId);
      if (idx !== -1) {
        setActiveVideoIndex(idx);
        setActiveTab('home');
      }
    }
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || !activeChatUser) return;

    const newMsg: Message = {
      id: `m-${Date.now()}`,
      senderId: currentUser?.id || 'self',
      text: inputMessage.trim(),
      time: 'Just now',
      isSelf: true,
    };

    setChatMessages(prev => ({
      ...prev,
      [activeChatUser.id]: [...(prev[activeChatUser.id] || []), newMsg],
    }));

    setInputMessage('');

    // Simulate instant friendly creator reply
    setTimeout(() => {
      const replyMsg: Message = {
        id: `m-reply-${Date.now()}`,
        senderId: activeChatUser.id,
        text: `Dhanyabad! 🙏 Appreciate your support on NepTok!`,
        time: 'Just now',
        isSelf: false,
      };
      setChatMessages(prev => ({
        ...prev,
        [activeChatUser.id]: [...(prev[activeChatUser.id] || []), replyMsg],
      }));
    }, 1200);
  };

  return (
    <div className="w-full h-full bg-[#0B0B0E] flex flex-col pb-16 overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-[#0B0B0E]/95 backdrop-blur-md px-4 py-3 border-b border-zinc-900">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Bell className="w-4 h-4 text-rose-500" />
            Inbox & Activity
          </h1>

          {/* Toggle between Notifications & Messages */}
          <div className="flex p-0.5 rounded-lg bg-zinc-900 border border-zinc-800">
            <button
              onClick={() => setActiveTabState('notifications')}
              className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${
                activeTab === 'notifications'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTabState('messages')}
              className={`px-3 py-1 rounded-md text-[11px] font-bold transition ${
                activeTab === 'messages'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Messages
            </button>
          </div>
        </div>

        {/* Activity Filter Chips */}
        {activeTab === 'notifications' && (
          <div className="flex items-center gap-2 mt-3 overflow-x-auto no-scrollbar">
            {[
              { id: 'all', label: 'All' },
              { id: 'like', label: 'Likes' },
              { id: 'comment', label: 'Comments' },
              { id: 'follow', label: 'Followers' },
              { id: 'system', label: 'NepTok Team' },
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setFilterType(f.id)}
                className={`px-3 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  filterType === f.id
                    ? 'bg-zinc-200 text-black'
                    : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Content */}
      {activeTab === 'notifications' ? (
        /* Notifications List */
        <div className="p-4 space-y-2.5">
          {filteredNotifs.length === 0 ? (
            <div className="py-16 text-center text-zinc-500 text-xs">
              No notifications in this category
            </div>
          ) : (
            filteredNotifs.map(notif => (
              <div
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={`flex items-start gap-3 p-3 rounded-xl border transition cursor-pointer ${
                  notif.read
                    ? 'bg-[#121218] border-zinc-800/60 hover:border-zinc-700'
                    : 'bg-rose-950/20 border-rose-500/40 hover:border-rose-500/60'
                }`}
              >
                {/* Icon Badge */}
                <div className="relative shrink-0">
                  {notif.userAvatar ? (
                    <img
                      src={notif.userAvatar}
                      alt={notif.username || ''}
                      className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-rose-600 flex items-center justify-center text-white font-bold text-xs">
                      🇳🇵
                    </div>
                  )}

                  {/* Type badge icon */}
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] text-white shadow-sm border border-black bg-zinc-900">
                    {notif.type === 'like' && <Heart className="w-2.5 h-2.5 text-rose-500 fill-rose-500" />}
                    {notif.type === 'comment' && <MessageCircle className="w-2.5 h-2.5 text-cyan-400 fill-cyan-400" />}
                    {notif.type === 'follow' && <UserPlus className="w-2.5 h-2.5 text-emerald-400" />}
                    {notif.type === 'system' && <Sparkles className="w-2.5 h-2.5 text-amber-400" />}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="text-xs text-zinc-200 leading-snug">
                    {notif.username && (
                      <span className="font-bold text-white mr-1">@{notif.username}</span>
                    )}
                    <span>{notif.text}</span>
                  </div>
                  <span className="text-[10px] text-zinc-500 mt-1 block">{notif.timeAgo}</span>
                </div>

                {/* Video thumbnail preview if applicable */}
                {notif.videoThumb && (
                  <img
                    src={notif.videoThumb}
                    alt="Video thumbnail"
                    className="w-9 h-12 rounded object-cover border border-zinc-800 shrink-0"
                  />
                )}
              </div>
            ))
          )}
        </div>
      ) : (
        /* Direct Messages List */
        <div className="p-4 space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
              Conversations
            </span>
          </div>

          {allCreators.map(creator => {
            const messages = chatMessages[creator.id] || [];
            const lastMsg = messages[messages.length - 1];

            return (
              <div
                key={creator.id}
                onClick={() => setActiveChatUser(creator)}
                className="flex items-center justify-between p-3 rounded-xl bg-[#14141C] border border-zinc-800 hover:border-rose-500/40 transition cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={creator.avatar}
                      alt={creator.displayName}
                      className="w-11 h-11 rounded-full object-cover border border-zinc-700 shrink-0"
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-black" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-white truncate">
                        {creator.displayName}
                      </span>
                      {creator.verified && (
                        <span className="w-3 h-3 rounded-full bg-cyan-500 text-black text-[8px] font-bold flex items-center justify-center">
                          ✓
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-zinc-400 truncate mt-0.5">
                      {lastMsg ? lastMsg.text : 'Tap to start conversation...'}
                    </p>
                  </div>
                </div>

                <span className="text-[10px] text-zinc-500 shrink-0">
                  {lastMsg ? lastMsg.time : 'Active'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Direct Message Active Chat Modal */}
      {activeChatUser && (
        <div className="fixed inset-0 z-50 bg-[#0B0B0E] flex flex-col">
          {/* Chat Header */}
          <div className="p-3 bg-[#14141C] border-b border-zinc-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setActiveChatUser(null)}
                className="p-1 rounded-full hover:bg-zinc-800 text-zinc-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <img
                src={activeChatUser.avatar}
                alt={activeChatUser.displayName}
                className="w-8 h-8 rounded-full object-cover border border-zinc-700"
              />
              <div>
                <h4 className="text-xs font-bold text-white">{activeChatUser.displayName}</h4>
                <span className="text-[10px] text-zinc-400">@{activeChatUser.username}</span>
              </div>
            </div>
            <button
              onClick={() => {
                setViewingCreator(activeChatUser);
                setActiveTab('profile');
                setActiveChatUser(null);
              }}
              className="text-xs font-semibold text-rose-400 hover:text-rose-300 px-2 py-1 rounded bg-rose-950/40 border border-rose-500/30"
            >
              View Profile
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 no-scrollbar">
            {(chatMessages[activeChatUser.id] || []).map(msg => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[75%] px-3.5 py-2 rounded-2xl text-xs leading-relaxed ${
                    msg.isSelf
                      ? 'bg-rose-600 text-white rounded-br-xs'
                      : 'bg-zinc-800 text-zinc-100 rounded-bl-xs'
                  }`}
                >
                  {msg.text}
                </div>
                <span className="text-[9px] text-zinc-500 mt-1 px-1">{msg.time}</span>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#14141C] border-t border-zinc-800 flex items-center gap-2">
            <input
              type="text"
              value={inputMessage}
              onChange={e => setInputMessage(e.target.value)}
              placeholder={`Message ${activeChatUser.displayName.split(' ')[0]}...`}
              className="flex-1 bg-zinc-900 text-xs text-white placeholder-zinc-500 px-3 py-2.5 rounded-full border border-zinc-700 focus:outline-none focus:border-rose-500"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim()}
              className="p-2.5 rounded-full bg-rose-600 hover:bg-rose-500 text-white disabled:opacity-40 transition active:scale-95 shadow-md"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
