export interface User {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  location?: string;
  verified?: boolean;
  followingCount: number;
  followersCount: number;
  likesCount: number;
  isFollowing?: boolean;
}

export interface VideoComment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  text: string;
  timestamp: string;
  likes: number;
  isLiked?: boolean;
}

export interface VideoItem {
  id: string;
  videoUrl: string;
  thumbnailUrl?: string;
  caption: string;
  creator: User;
  musicTitle: string;
  musicArtist: string;
  location: string;
  hashtags: string[];
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  bookmarksCount: number;
  viewsCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'system';
  userId?: string;
  username?: string;
  userAvatar?: string;
  text: string;
  timeAgo: string;
  videoId?: string;
  videoThumb?: string;
  read: boolean;
}

export interface DirectMessage {
  id: string;
  senderId: string;
  recipientId: string;
  text: string;
  timestamp: string;
}

export interface LiveGift {
  id: string;
  name: string;
  nepaliName: string;
  coins: number;
  icon: string;
}

export type TabType = 'home' | 'discover' | 'upload' | 'inbox' | 'profile';
