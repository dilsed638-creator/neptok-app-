import React, { useState, useRef } from 'react';
import { Upload, Smartphone, Video, Music, MapPin, Hash, Sparkles, AlertCircle, CheckCircle2, Play, Pause } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TRENDING_SOUNDS } from '../data/demoData';

const NEPAL_LOCATIONS = [
  'Kathmandu, Nepal',
  'Pokhara, Nepal',
  'Lalitpur (Patan), Nepal',
  'Bhaktapur Durbar Square',
  'Namche Bazaar, Everest',
  'Chitwan National Park',
  'Upper Mustang, Nepal',
  'Dharan, Eastern Nepal',
  'Lumbini (Birthplace of Buddha)',
  'Rara Lake, Mugu',
];

const PRESET_DEMO_CLIPS = [
  {
    name: 'Pokhara Lakeside Bike Tour',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-curvy-road-on-a-tree-covered-mountain-41537-large.mp4',
    thumb: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
    caption: 'Cruising the hill highway of Nepal! Pristine fresh air and winding turns 🇳🇵🛵 #RideNepal #NepalVibes',
  },
  {
    name: 'Kathmandu Street Cafe Vibes',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-skater-showing-a-peace-sign-41481-large.mp4',
    thumb: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=600&q=80',
    caption: 'Sunny golden hour vibes in Kathmandu! Who is down for rooftop coffee? ☕✨ #Kathmandu #GoldenHour',
  },
  {
    name: 'Thamel Neon Streets Walk',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-girl-in-neon-sign-1232-large.mp4',
    thumb: 'https://images.unsplash.com/photo-1582650625119-3a31f8418b7d?auto=format&fit=crop&w=600&q=80',
    caption: 'Late night walk through the vibrant alleys of Thamel with live bands playing 🎸 #ThamelNights #Nepal',
  },
  {
    name: 'Nepali Folk Dance Reel',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-vertical-shot-42031-large.mp4',
    thumb: 'https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&w=600&q=80',
    caption: 'Learning the iconic Nepali folk rhythm! Practice every day 💃🌸 #FolkDance #NepTokDance',
  },
];

export const UploadView: React.FC = () => {
  const { currentUser, addNewVideo, setIsAuthModalOpen } = useApp();

  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [thumbnailUrl, setThumbnailUrl] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>(NEPAL_LOCATIONS[0]);
  const [selectedSound, setSelectedSound] = useState(TRENDING_SOUNDS[0]);
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'private'>('public');
  const [allowComments, setAllowComments] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [isPlayingPreview, setIsPlayingPreview] = useState<boolean>(false);
  const [uploadSuccess, setUploadSuccess] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);
  const videoPreviewRef = useRef<HTMLVideoElement | null>(null);

  // Handle local video file upload from Android gallery / phone storage
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      alert('Please select a valid video file (MP4, WebM, MOV).');
      return;
    }

    setVideoFile(file);
    const objectUrl = URL.createObjectURL(file);
    setVideoPreviewUrl(objectUrl);
    setThumbnailUrl(''); // Reset custom thumbnail
    setIsPlayingPreview(true);
  };

  // Select a pre-configured demo clip for testing
  const handleSelectPreset = (preset: typeof PRESET_DEMO_CLIPS[0]) => {
    setVideoFile(null);
    setVideoPreviewUrl(preset.url);
    setThumbnailUrl(preset.thumb);
    setCaption(preset.caption);
    setIsPlayingPreview(true);
  };

  const handleTogglePreviewPlay = () => {
    if (!videoPreviewRef.current) return;
    if (isPlayingPreview) {
      videoPreviewRef.current.pause();
      setIsPlayingPreview(false);
    } else {
      videoPreviewRef.current.play();
      setIsPlayingPreview(true);
    }
  };

  const handleAddHashtag = (tag: string) => {
    if (!caption.includes(tag)) {
      setCaption(prev => (prev ? `${prev} ${tag}` : tag));
    }
  };

  const handlePost = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
      return;
    }

    if (!videoPreviewUrl) {
      alert('Please upload a video or pick one of the demo clips first.');
      return;
    }

    if (!caption.trim()) {
      alert('Please add a short caption or hashtag for your video.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(10);

    // Simulate upload progression for smooth feedback
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      // Extract hashtags
      const matches = caption.match(/#[a-zA-Z0-9_]+/g) || ['#NepTok', '#Nepal'];

      // Add to feed
      addNewVideo({
        videoUrl: videoPreviewUrl,
        thumbnailUrl: thumbnailUrl || 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=600&q=80',
        caption: caption.trim(),
        creator: currentUser,
        musicTitle: selectedSound.title,
        musicArtist: selectedSound.artist,
        location: selectedLocation,
        hashtags: matches,
      });

      setIsUploading(false);
      setUploadSuccess(true);
    }, 1200);
  };

  return (
    <div className="w-full h-full bg-[#0B0B0E] flex flex-col pb-16 overflow-y-auto no-scrollbar">
      {/* Top Header */}
      <div className="sticky top-0 z-20 bg-[#0B0B0E]/95 backdrop-blur-md px-4 py-3.5 border-b border-zinc-900 flex items-center justify-between">
        <div>
          <h1 className="text-sm font-extrabold text-white flex items-center gap-1.5">
            <Video className="w-4 h-4 text-rose-500" />
            Upload Video
          </h1>
          <p className="text-[10px] text-zinc-400">Share Nepali moments with the world</p>
        </div>

        <button
          onClick={handlePost}
          disabled={!videoPreviewUrl || isUploading}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition active:scale-95 shadow-md flex items-center gap-1.5 ${
            videoPreviewUrl && !isUploading
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {isUploading ? (
            <span>Posting... {uploadProgress}%</span>
          ) : (
            <span>Post Video</span>
          )}
        </button>
      </div>

      <div className="p-4 space-y-5">
        {/* Android Video File Picker Area */}
        <div className="rounded-2xl border-2 border-dashed border-zinc-800 hover:border-rose-500/60 bg-[#121218] p-5 text-center transition">
          {videoPreviewUrl ? (
            <div className="flex flex-col items-center">
              {/* Video Player Preview */}
              <div
                className="relative aspect-[9/16] w-48 max-w-full rounded-xl overflow-hidden bg-black shadow-2xl border border-zinc-800 cursor-pointer group"
                onClick={handleTogglePreviewPlay}
              >
                <video
                  ref={videoPreviewRef}
                  src={videoPreviewUrl}
                  className="w-full h-full object-cover"
                  playsInline
                  loop
                  autoPlay
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="p-2 rounded-full bg-black/60 text-white">
                    {isPlayingPreview ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 fill-white" />}
                  </div>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="px-3 py-1 text-[11px] font-semibold text-rose-400 hover:text-rose-300 bg-rose-950/40 border border-rose-500/30 rounded-lg transition"
                >
                  Change Video
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setVideoPreviewUrl('');
                    setVideoFile(null);
                  }}
                  className="px-3 py-1 text-[11px] font-semibold text-zinc-400 hover:text-white bg-zinc-800 rounded-lg transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center py-4">
              <div className="w-14 h-14 rounded-2xl bg-rose-950/40 border border-rose-500/30 flex items-center justify-center text-rose-500 mb-3">
                <Upload className="w-7 h-7" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1">Select Video from Phone or PC</h3>
              <p className="text-xs text-zinc-400 max-w-xs mb-4">
                MP4 or WebM vertical format recommended (up to 60 seconds).
              </p>

              {/* Action buttons for Android Phone Gallery & Camera */}
              <div className="flex flex-wrap justify-center gap-2.5">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-bold text-white transition active:scale-95 shadow-md"
                >
                  <Smartphone className="w-4 h-4" />
                  Choose File / Gallery
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-semibold text-zinc-200 transition active:scale-95 border border-zinc-700"
                >
                  <Video className="w-4 h-4" />
                  Record with Camera
                </button>
              </div>

              {/* Hidden file inputs */}
              <input
                ref={fileInputRef}
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="hidden"
              />
              <input
                ref={cameraInputRef}
                type="file"
                accept="video/*"
                capture="environment"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          )}
        </div>

        {/* Quick Testing Presets */}
        <div className="p-3 rounded-xl bg-[#14141C] border border-zinc-800/80">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-zinc-300">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Quick Demo Clips (Instant 1-Click Test)
          </div>
          <p className="text-[11px] text-zinc-400 mb-2.5">
            Don't have a video on your device right now? Choose a sample clip to test uploading instantly:
          </p>
          <div className="grid grid-cols-2 gap-2">
            {PRESET_DEMO_CLIPS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSelectPreset(preset)}
                className={`p-2 rounded-lg text-left border transition active:scale-95 flex items-center gap-2 ${
                  videoPreviewUrl === preset.url
                    ? 'bg-rose-950/40 border-rose-500 text-white'
                    : 'bg-zinc-900/80 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <img
                  src={preset.thumb}
                  alt={preset.name}
                  className="w-10 h-10 rounded-md object-cover shrink-0"
                />
                <span className="text-[11px] font-semibold line-clamp-2 leading-tight">
                  {preset.name}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Video Caption & Hashtags */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-zinc-300 flex items-center justify-between">
            <span>Caption & Hashtags</span>
            <span className="text-[10px] text-zinc-500">{caption.length}/150</span>
          </label>
          <textarea
            value={caption}
            onChange={e => setCaption(e.target.value)}
            rows={3}
            maxLength={150}
            placeholder="Describe your video, mention friends, and add trending tags..."
            className="w-full bg-[#181822] text-xs text-white placeholder-zinc-500 p-3 rounded-xl border border-zinc-800 focus:outline-none focus:border-rose-500 transition resize-none"
          />

          {/* Quick Hashtags */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-zinc-500 font-semibold mr-1">Suggested:</span>
            {['#NepTok', '#Nepal', '#Kathmandu', '#Pokhara', '#Himalayas', '#FoodNepal'].map(tag => (
              <button
                key={tag}
                type="button"
                onClick={() => handleAddHashtag(tag)}
                className="px-2 py-0.5 rounded-full bg-zinc-800 hover:bg-zinc-700 text-[10px] font-medium text-zinc-300 transition"
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Sound Selection */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <Music className="w-3.5 h-3.5 text-rose-500" />
            Audio Sound
          </label>
          <select
            value={selectedSound.id}
            onChange={e => {
              const snd = TRENDING_SOUNDS.find(s => s.id === e.target.value);
              if (snd) setSelectedSound(snd);
            }}
            className="w-full bg-[#181822] text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-rose-500 transition"
          >
            {TRENDING_SOUNDS.map(s => (
              <option key={s.id} value={s.id}>
                {s.title} · {s.artist}
              </option>
            ))}
            <option value="original">Original Audio (from device)</option>
          </select>
        </div>

        {/* Location Picker */}
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-rose-500" />
            Location
          </label>
          <select
            value={selectedLocation}
            onChange={e => setSelectedLocation(e.target.value)}
            className="w-full bg-[#181822] text-xs text-white p-2.5 rounded-xl border border-zinc-800 focus:outline-none focus:border-rose-500 transition"
          >
            {NEPAL_LOCATIONS.map(loc => (
              <option key={loc} value={loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Settings Toggles */}
        <div className="p-3 rounded-xl bg-[#14141C] border border-zinc-800/80 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-zinc-300">Who can view this video</span>
            <select
              value={privacy}
              onChange={e => setPrivacy(e.target.value as any)}
              className="bg-zinc-800 text-[11px] text-zinc-200 rounded-lg px-2 py-1 border border-zinc-700"
            >
              <option value="public">Public (Everyone)</option>
              <option value="friends">Friends Only</option>
              <option value="private">Private (Only Me)</option>
            </select>
          </div>

          <div className="flex items-center justify-between border-t border-zinc-800 pt-2.5">
            <span className="text-xs font-semibold text-zinc-300">Allow comments</span>
            <input
              type="checkbox"
              checked={allowComments}
              onChange={e => setAllowComments(e.target.checked)}
              className="w-4 h-4 accent-rose-600 rounded cursor-pointer"
            />
          </div>
        </div>

        {/* Submit Post Button */}
        <button
          type="button"
          onClick={handlePost}
          disabled={!videoPreviewUrl || isUploading}
          className={`w-full py-3 rounded-xl text-xs font-bold transition active:scale-95 shadow-lg flex items-center justify-center gap-2 ${
            videoPreviewUrl && !isUploading
              ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30'
              : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'
          }`}
        >
          {isUploading ? (
            <span>Uploading to NepTok... {uploadProgress}%</span>
          ) : (
            <>
              <Upload className="w-4 h-4" />
              <span>Post to NepTok 🇳🇵</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
