import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, VideoItem, VideoComment, NotificationItem, TabType } from '../types';
import { CURRENT_USER, DEMO_USERS, DEMO_VIDEOS, INITIAL_COMMENTS, DEMO_NOTIFICATIONS } from '../data/demoData';

interface AppContextType {
  currentUser: User | null;
  videos: VideoItem[];
  activeVideoIndex: number;
  setActiveVideoIndex: (index: number | ((prev: number) => number)) => void;
  currentFeedTab: 'foryou' | 'following';
  setCurrentFeedTab: (tab: 'foryou' | 'following') => void;
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  isLiveActive: boolean;
  setIsLiveActive: (val: boolean) => void;
  isMobileFrame: boolean;
  setIsMobileFrame: (val: boolean) => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
  authMode: 'login' | 'signup';
  setAuthMode: (mode: 'login' | 'signup') => void;
  isApkGuideOpen: boolean;
  setIsApkGuideOpen: (open: boolean) => void;
  isEditProfileOpen: boolean;
  setIsEditProfileOpen: (open: boolean) => void;
  viewingCreator: User | null;
  setViewingCreator: (user: User | null) => void;
  comments: Record<string, VideoComment[]>;
  toggleLikeVideo: (videoId: string) => void;
  toggleBookmarkVideo: (videoId: string) => void;
  toggleFollowUser: (userId: string) => void;
  addComment: (videoId: string, text: string) => void;
  toggleLikeComment: (videoId: string, commentId: string) => void;
  addNewVideo: (newVideo: Omit<VideoItem, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'bookmarksCount' | 'viewsCount' | 'isLiked' | 'isBookmarked' | 'createdAt'>) => void;
  login: (userData: { username: string; displayName?: string }) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  notifications: NotificationItem[];
  markNotificationRead: (id: string) => void;
  coinBalance: number;
  spendCoins: (amount: number) => boolean;
  addCoins: (amount: number) => void;
  allCreators: User[];
  isMuted: boolean;
  setIsMuted: (val: boolean | ((prev: boolean) => boolean)) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Saved user state
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('neptok_current_user');
      return saved ? JSON.parse(saved) : CURRENT_USER;
    } catch {
      return CURRENT_USER;
    }
  });

  // Videos state
  const [videos, setVideos] = useState<VideoItem[]>(() => {
    try {
      const saved = localStorage.getItem('neptok_videos');
      return saved ? JSON.parse(saved) : DEMO_VIDEOS;
    } catch {
      return DEMO_VIDEOS;
    }
  });

  const [activeVideoIndex, setActiveVideoIndex] = useState<number>(0);
  const [currentFeedTab, setCurrentFeedTab] = useState<'foryou' | 'following'>('foryou');
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [isLiveActive, setIsLiveActive] = useState<boolean>(false);
  const [isMobileFrame, setIsMobileFrame] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [isApkGuideOpen, setIsApkGuideOpen] = useState<boolean>(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState<boolean>(false);
  const [viewingCreator, setViewingCreator] = useState<User | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Comments state
  const [comments, setComments] = useState<Record<string, VideoComment[]>>(() => {
    try {
      const saved = localStorage.getItem('neptok_comments');
      return saved ? JSON.parse(saved) : INITIAL_COMMENTS;
    } catch {
      return INITIAL_COMMENTS;
    }
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem('neptok_notifications');
      return saved ? JSON.parse(saved) : DEMO_NOTIFICATIONS;
    } catch {
      return DEMO_NOTIFICATIONS;
    }
  });

  // Creators list for follow state
  const [allCreators, setAllCreators] = useState<User[]>(DEMO_USERS);

  // Coins for live streaming gifts
  const [coinBalance, setCoinBalance] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('neptok_coins');
      return saved ? parseInt(saved, 10) : 550;
    } catch {
      return 550;
    }
  });

  // Save changes to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('neptok_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('neptok_current_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('neptok_videos', JSON.stringify(videos));
  }, [videos]);

  useEffect(() => {
    localStorage.setItem('neptok_comments', JSON.stringify(comments));
  }, [comments]);

  useEffect(() => {
    localStorage.setItem('neptok_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('neptok_coins', coinBalance.toString());
  }, [coinBalance]);

  // Actions
  const toggleLikeVideo = (videoId: string) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          const isLiked = !v.isLiked;
          return {
            ...v,
            isLiked,
            likesCount: isLiked ? v.likesCount + 1 : Math.max(0, v.likesCount - 1),
          };
        }
        return v;
      })
    );
  };

  const toggleBookmarkVideo = (videoId: string) => {
    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          const isBookmarked = !v.isBookmarked;
          return {
            ...v,
            isBookmarked,
            bookmarksCount: isBookmarked ? v.bookmarksCount + 1 : Math.max(0, v.bookmarksCount - 1),
          };
        }
        return v;
      })
    );
  };

  const toggleFollowUser = (userId: string) => {
    // Update allCreators
    setAllCreators(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const isFollowing = !u.isFollowing;
          return {
            ...u,
            isFollowing,
            followersCount: isFollowing ? u.followersCount + 1 : Math.max(0, u.followersCount - 1),
          };
        }
        return u;
      })
    );

    // Update videos creator follow state
    setVideos(prev =>
      prev.map(v => {
        if (v.creator.id === userId) {
          const isFollowing = !v.creator.isFollowing;
          return {
            ...v,
            creator: {
              ...v.creator,
              isFollowing,
              followersCount: isFollowing ? v.creator.followersCount + 1 : Math.max(0, v.creator.followersCount - 1),
            },
          };
        }
        return v;
      })
    );

    // Update viewing creator if open
    if (viewingCreator && viewingCreator.id === userId) {
      setViewingCreator(prev => {
        if (!prev) return null;
        const isFollowing = !prev.isFollowing;
        return {
          ...prev,
          isFollowing,
          followersCount: isFollowing ? prev.followersCount + 1 : Math.max(0, prev.followersCount - 1),
        };
      });
    }

    // Update current user following count
    if (currentUser) {
      setCurrentUser(prev => {
        if (!prev) return null;
        const targetIsFollowing = allCreators.find(u => u.id === userId)?.isFollowing;
        const delta = targetIsFollowing ? -1 : 1;
        return {
          ...prev,
          followingCount: Math.max(0, prev.followingCount + delta),
        };
      });
    }
  };

  const addComment = (videoId: string, text: string) => {
    if (!text.trim() || !currentUser) return;

    const newComment: VideoComment = {
      id: `comment-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      userId: currentUser.id,
      username: currentUser.username,
      userAvatar: currentUser.avatar,
      text: text.trim(),
      timestamp: 'Just now',
      likes: 0,
      isLiked: false,
    };

    setComments(prev => ({
      ...prev,
      [videoId]: [newComment, ...(prev[videoId] || [])],
    }));

    setVideos(prev =>
      prev.map(v => {
        if (v.id === videoId) {
          return {
            ...v,
            commentsCount: v.commentsCount + 1,
          };
        }
        return v;
      })
    );
  };

  const toggleLikeComment = (videoId: string, commentId: string) => {
    setComments(prev => {
      const list = prev[videoId] || [];
      const updated = list.map(c => {
        if (c.id === commentId) {
          const isLiked = !c.isLiked;
          return {
            ...c,
            isLiked,
            likes: isLiked ? c.likes + 1 : Math.max(0, c.likes - 1),
          };
        }
        return c;
      });
      return {
        ...prev,
        [videoId]: updated,
      };
    });
  };

  const addNewVideo = (newVideoData: Omit<VideoItem, 'id' | 'likesCount' | 'commentsCount' | 'sharesCount' | 'bookmarksCount' | 'viewsCount' | 'isLiked' | 'isBookmarked' | 'createdAt'>) => {
    const newVideo: VideoItem = {
      ...newVideoData,
      id: `vid-${Date.now()}`,
      likesCount: 0,
      commentsCount: 0,
      sharesCount: 0,
      bookmarksCount: 0,
      viewsCount: 1,
      isLiked: false,
      isBookmarked: false,
      createdAt: 'Just now',
    };

    setVideos(prev => [newVideo, ...prev]);
    setActiveVideoIndex(0);
    setActiveTab('home');

    // Notify user in notifications
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      type: 'system',
      text: `Your video "${newVideo.caption.substring(0, 30)}..." has been posted to NepTok!`,
      timeAgo: 'Just now',
      videoId: newVideo.id,
      videoThumb: newVideo.thumbnailUrl,
      read: false,
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  const login = (userData: { username: string; displayName?: string }) => {
    const user: User = {
      id: `user_${userData.username.toLowerCase().replace(/[^a-z0-9]/g, '_')}`,
      username: userData.username.toLowerCase(),
      displayName: userData.displayName || userData.username,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=400&q=80',
      bio: 'Namaste! Proud member of the NepTok community 🇳🇵',
      location: 'Nepal',
      verified: false,
      followingCount: 12,
      followersCount: 38,
      likesCount: 120,
      isFollowing: false,
    };
    setCurrentUser(user);
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updates };
    setCurrentUser(updated);

    // Also update current user in videos
    setVideos(prev =>
      prev.map(v => {
        if (v.creator.id === updated.id) {
          return {
            ...v,
            creator: { ...v.creator, ...updates },
          };
        }
        return v;
      })
    );
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const spendCoins = (amount: number): boolean => {
    if (coinBalance < amount) return false;
    setCoinBalance(prev => prev - amount);
    return true;
  };

  const addCoins = (amount: number) => {
    setCoinBalance(prev => prev + amount);
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        videos,
        activeVideoIndex,
        setActiveVideoIndex,
        currentFeedTab,
        setCurrentFeedTab,
        activeTab,
        setActiveTab,
        isLiveActive,
        setIsLiveActive,
        isMobileFrame,
        setIsMobileFrame,
        isAuthModalOpen,
        setIsAuthModalOpen,
        authMode,
        setAuthMode,
        isApkGuideOpen,
        setIsApkGuideOpen,
        isEditProfileOpen,
        setIsEditProfileOpen,
        viewingCreator,
        setViewingCreator,
        comments,
        toggleLikeVideo,
        toggleBookmarkVideo,
        toggleFollowUser,
        addComment,
        toggleLikeComment,
        addNewVideo,
        login,
        logout,
        updateProfile,
        notifications,
        markNotificationRead,
        coinBalance,
        spendCoins,
        addCoins,
        allCreators,
        isMuted,
        setIsMuted,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
