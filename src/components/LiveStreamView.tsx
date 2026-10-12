import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, Gift, Users, Sparkles, Volume2, VolumeX, Plus } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { LIVE_GIFTS } from '../data/demoData';
import { LiveGift } from '../types';

interface LiveMessage {
  id: string;
  sender: string;
  text: string;
  isGift?: boolean;
  giftIcon?: string;
}

interface FloatingHeart {
  id: number;
  x: number;
  color: string;
}

interface FloatingGiftDisplay {
  id: number;
  gift: LiveGift;
}

export const LiveStreamView: React.FC = () => {
  const { setIsLiveActive, coinBalance, spendCoins, addCoins, currentUser } = useApp();

  const [viewerCount, setViewerCount] = useState(1420);
  const [messages, setMessages] = useState<LiveMessage[]>([
    { id: '1', sender: 'Bikash_Everest', text: 'Namaste everyone from Namche Bazaar! 🏔️' },
    { id: '2', sender: 'Sunita_KTM', text: 'Your voice is so relaxing Priyanka di ❤️' },
    { id: '3', sender: 'Rohan_Biker', text: 'Can you sing Resham Firiri acoustic version?' },
    { id: '4', sender: 'Pooja_Butwal', text: 'Greetings to all NepTok fam from Butwal 🇳🇵' },
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [isGiftDrawerOpen, setIsGiftDrawerOpen] = useState(false);
  const [floatingHearts, setFloatingHearts] = useState<FloatingHeart[]>([]);
  const [floatingGifts, setFloatingGifts] = useState<FloatingGiftDisplay[]>([]);
  const [isMuted, setIsMuted] = useState(false);
  const [recentGiftBanner, setRecentGiftBanner] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-scroll chat messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Periodic random viewer count changes & simulated comments
  useEffect(() => {
    const viewerInterval = setInterval(() => {
      setViewerCount(prev => prev + Math.floor(Math.random() * 7) - 3);
    }, 4000);

    const SIMULATED_CHAT = [
      { sender: 'Dipen_Pokhara', text: 'Fewa lake weather is so clear today!' },
      { sender: 'Anjali_Lalitpur', text: 'Proud to see Nepali talent on NepTok 👏' },
      { sender: 'Nabin_Dharan', text: 'Big love from Eastern Nepal!' },
      { sender: 'Kiran_Mustang', text: 'The acoustic guitar tone is incredible 🎸' },
      { sender: 'Suman_Biratnagar', text: 'Namaste from Biratnagar! ❤️🇳🇵' },
    ];

    let chatIdx = 0;
    const chatInterval = setInterval(() => {
      if (chatIdx < SIMULATED_CHAT.length) {
        setMessages(prev => [
          ...prev,
          {
            id: `sim-${Date.now()}`,
            sender: SIMULATED_CHAT[chatIdx].sender,
            text: SIMULATED_CHAT[chatIdx].text,
          },
        ]);
        chatIdx++;
      }
    }, 5500);

    return () => {
      clearInterval(viewerInterval);
      clearInterval(chatInterval);
    };
  }, []);

  // Handle tap on screen to spawn floating hearts
  const handleTapScreen = (e: React.MouseEvent<HTMLDivElement>) => {
    const colors = ['#FF2A55', '#DC143C', '#F43F5E', '#FB7185', '#F59E0B'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    const xPos = Math.random() * 60 + 20; // 20% to 80%

    const newHeart: FloatingHeart = {
      id: Date.now() + Math.random(),
      x: xPos,
      color: randomColor,
    };

    setFloatingHearts(prev => [...prev, newHeart]);
    setTimeout(() => {
      setFloatingHearts(prev => prev.filter(h => h.id !== newHeart.id));
    }, 1800);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: LiveMessage = {
      id: `msg-${Date.now()}`,
      sender: currentUser?.displayName || 'Guest User',
      text: inputMsg.trim(),
    };

    setMessages(prev => [...prev, newMsg]);
    setInputMsg('');
  };

  const handleSendGift = (gift: LiveGift) => {
    const success = spendCoins(gift.coins);
    if (!success) {
      alert(`Not enough coins! You need ${gift.coins} coins. Click the "+" button to get 200 free test coins!`);
      return;
    }

    // Add gift message
    const giftMessage: LiveMessage = {
      id: `gift-${Date.now()}`,
      sender: currentUser?.displayName || 'You',
      text: `sent ${gift.name} (${gift.nepaliName})!`,
      isGift: true,
      giftIcon: gift.icon,
    };
    setMessages(prev => [...prev, giftMessage]);

    // Show announcement banner
    setRecentGiftBanner(`${currentUser?.displayName || 'You'} sent ${gift.icon} ${gift.name}!`);
    setTimeout(() => setRecentGiftBanner(null), 3000);

    // Spawn floating gift animation
    const floatingGift: FloatingGiftDisplay = {
      id: Date.now(),
      gift,
    };
    setFloatingGifts(prev => [...prev, floatingGift]);
    setTimeout(() => {
      setFloatingGifts(prev => prev.filter(g => g.id !== floatingGift.id));
    }, 2200);

    setIsGiftDrawerOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col select-none overflow-hidden">
      {/* Background Live Stream Feed (Authentic Pokhara sunset acoustic session) */}
      <div className="absolute inset-0 z-0" onClick={handleTapScreen}>
        <video
          src="https://assets.mixkit.co/videos/preview/mixkit-young-woman-skater-showing-a-peace-sign-41481-large.mp4"
          poster="https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1080&q=80"
          className="w-full h-full object-cover"
          playsInline
          loop
          autoPlay
          muted={isMuted}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-transparent to-black/90" />
      </div>

      {/* Floating Gift Big Animation */}
      {floatingGifts.map(item => (
        <div
          key={item.id}
          className="absolute z-40 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center animate-in zoom-in-50 duration-300"
        >
          <div className="text-8xl filter drop-shadow-[0_0_30px_rgba(244,63,94,0.9)] animate-bounce">
            {item.gift.icon}
          </div>
          <div className="mt-2 px-4 py-1.5 rounded-full bg-rose-600/90 text-white font-extrabold text-sm shadow-2xl border border-white/30 backdrop-blur-md">
            {item.gift.name} • {item.gift.nepaliName}
          </div>
        </div>
      ))}

      {/* Floating Hearts spawned on tap */}
      {floatingHearts.map(h => (
        <div
          key={h.id}
          className="absolute bottom-24 pointer-events-none z-30 animate-fly-up"
          style={{ left: `${h.x}%` }}
        >
          <Heart
            className="w-8 h-8 fill-current drop-shadow-md"
            style={{ color: h.color }}
          />
        </div>
      ))}

      {/* Top Header Bar */}
      <div className="relative z-20 flex items-center justify-between p-4 pt-3">
        {/* Host Info */}
        <div className="flex items-center gap-2 p-1 pr-3 rounded-full bg-black/50 backdrop-blur-md border border-white/10">
          <img
            src="https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=150&q=80"
            alt="Priyanka Gurung"
            className="w-8 h-8 rounded-full object-cover border border-rose-500"
          />
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <span className="text-xs font-bold text-white">Priyanka Gurung</span>
              <span className="text-[9px] bg-cyan-500 text-black px-1 rounded-full font-bold">✓</span>
            </div>
            <span className="text-[10px] text-zinc-300 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
              Pokhara Sunset Acoustic 🎸
            </span>
          </div>
        </div>

        {/* Viewers counter & Controls */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-xs font-bold text-zinc-200">
            <Users className="w-3.5 h-3.5 text-rose-400" />
            <span>{viewerCount.toLocaleString()}</span>
          </div>

          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-black/70 transition"
          >
            {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsLiveActive(false)}
            className="p-2 rounded-full bg-black/50 backdrop-blur-md border border-white/10 text-white hover:bg-rose-600 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Gift Announcement Banner */}
      {recentGiftBanner && (
        <div className="relative z-20 self-center mt-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-rose-600/90 via-purple-600/90 to-rose-600/90 border border-white/30 text-xs font-bold text-white shadow-2xl animate-in slide-in-from-top-2">
          {recentGiftBanner}
        </div>
      )}

      <div className="flex-1" onClick={handleTapScreen} />

      {/* Live Chat Stream Overlay */}
      <div className="relative z-20 px-4 pb-2 max-h-56 overflow-y-auto no-scrollbar space-y-1.5 pointer-events-auto">
        {messages.slice(-8).map(m => (
          <div
            key={m.id}
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full max-w-[85%] text-xs backdrop-blur-md shadow-sm ${
              m.isGift
                ? 'bg-rose-950/80 border border-rose-500/50 text-white font-semibold'
                : 'bg-black/45 border border-white/10 text-zinc-200'
            }`}
          >
            <span className="font-bold text-rose-300 shrink-0">@{m.sender}:</span>
            <span className="break-words">{m.text}</span>
            {m.giftIcon && <span className="text-base">{m.giftIcon}</span>}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Live Controls */}
      <div className="relative z-20 p-3 bg-black/80 backdrop-blur-md border-t border-zinc-900 flex items-center gap-2 pointer-events-auto">
        <form onSubmit={handleSendMessage} className="flex-1 flex items-center">
          <input
            type="text"
            value={inputMsg}
            onChange={e => setInputMsg(e.target.value)}
            placeholder="Send a live message..."
            className="w-full bg-[#181822] text-xs text-white placeholder-zinc-500 px-3.5 py-2.5 rounded-full border border-zinc-700/80 focus:outline-none focus:border-rose-500"
          />
        </form>

        {/* Gift Button with Coin Counter */}
        <button
          onClick={() => setIsGiftDrawerOpen(!isGiftDrawerOpen)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-full bg-gradient-to-r from-rose-600 to-amber-500 text-white text-xs font-bold shadow-lg hover:brightness-110 transition active:scale-95"
        >
          <Gift className="w-4 h-4" />
          <span>Gifts</span>
        </button>

        {/* Tap Heart Button */}
        <button
          onClick={handleTapScreen as any}
          className="p-2.5 rounded-full bg-rose-600/80 text-white hover:bg-rose-500 transition active:scale-95"
          title="Send Hearts"
        >
          <Heart className="w-4 h-4 fill-white" />
        </button>
      </div>

      {/* Gifts Drawer Sheet */}
      {isGiftDrawerOpen && (
        <div className="relative z-40 bg-[#14141C] border-t border-zinc-800 p-4 rounded-t-2xl shadow-2xl animate-in slide-in-from-bottom duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider">
                Send Nepali Gifts
              </span>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/40 text-[11px] font-bold text-amber-300">
                <span>🪙 {coinBalance} Coins</span>
                <button
                  onClick={() => addCoins(200)}
                  className="ml-1 text-[10px] text-amber-200 bg-amber-600 px-1.5 rounded hover:bg-amber-500"
                  title="Claim 200 Free Test Coins"
                >
                  +200 Free
                </button>
              </div>
            </div>
            <button
              onClick={() => setIsGiftDrawerOpen(false)}
              className="p-1 rounded-full text-zinc-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5 py-4">
            {LIVE_GIFTS.map(gift => (
              <button
                key={gift.id}
                onClick={() => handleSendGift(gift)}
                className="flex flex-col items-center p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800 hover:border-rose-500 hover:bg-rose-950/30 transition active:scale-95 group"
              >
                <span className="text-3xl mb-1 group-hover:scale-115 transition-transform">
                  {gift.icon}
                </span>
                <span className="text-[11px] font-bold text-white">{gift.name}</span>
                <span className="text-[9px] text-zinc-400">{gift.nepaliName}</span>
                <span className="text-[10px] font-bold text-amber-400 mt-1">
                  🪙 {gift.coins}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
