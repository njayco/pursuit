// Collection names and document structure definitions
export const COLLECTIONS = {
  USERS: "users",
  TRACKS: "tracks",
  ARTISTS: "artists",
  ALBUMS: "albums",
  PLAYLISTS: "playlists",
  VOTES: "votes",
  COMMENTS: "comments",
  FOLLOWS: "follows",
  NOTIFICATIONS: "notifications",
  ANALYTICS: "analytics",
} as const

// Type definitions for Firestore documents
export interface UserDocument {
  id: string
  email: string
  displayName: string
  photoURL?: string
  bio?: string
  location?: string
  website?: string
  isArtist: boolean
  isVerified: boolean
  followers: number
  following: number
  totalVotes: number
  joinedAt: any // Firestore Timestamp
  lastActive: any // Firestore Timestamp
  preferences: {
    genres: string[]
    notifications: {
      newFollowers: boolean
      trackLikes: boolean
      comments: boolean
    }
  }
  stats: {
    tracksLiked: number
    tracksSkipped: number
    playlistsCreated: number
  }
}

export interface TrackDocument {
  id: string
  title: string
  artist: string
  artistId: string
  album?: string
  albumId?: string
  genre: string[]
  duration: number // in seconds
  heatScore: number
  totalVotes: number
  upvotes: number
  downvotes: number
  plays: number
  previewUrl: string
  fullUrl: string
  artwork: string
  lyrics?: string
  isExplicit: boolean
  isActive: boolean
  uploadedAt: any // Firestore Timestamp
  updatedAt: any // Firestore Timestamp
  metadata: {
    bpm?: number
    key?: string
    energy?: number
    danceability?: number
  }
}

export interface ArtistDocument {
  id: string
  name: string
  bio?: string
  photoURL?: string
  coverURL?: string
  genre: string[]
  location?: string
  website?: string
  socialLinks: {
    instagram?: string
    twitter?: string
    spotify?: string
    soundcloud?: string
  }
  isVerified: boolean
  followers: number
  totalTracks: number
  totalPlays: number
  averageHeatScore: number
  joinedAt: any // Firestore Timestamp
  lastActive: any // Firestore Timestamp
}

export interface VoteDocument {
  id: string
  userId: string
  trackId: string
  type: "up" | "down"
  votedAt: any // Firestore Timestamp
}

export interface PlaylistDocument {
  id: string
  name: string
  description?: string
  coverURL?: string
  userId: string
  isPublic: boolean
  tracks: string[] // Track IDs
  followers: number
  totalDuration: number
  createdAt: any // Firestore Timestamp
  updatedAt: any // Firestore Timestamp
}

export interface CommentDocument {
  id: string
  trackId: string
  userId: string
  content: string
  likes: number
  replies: string[] // Comment IDs
  parentId?: string // For replies
  createdAt: any // Firestore Timestamp
  updatedAt: any // Firestore Timestamp
}

export interface FollowDocument {
  id: string
  followerId: string
  followingId: string
  followedAt: any // Firestore Timestamp
}

export interface NotificationDocument {
  id: string
  userId: string
  type: "follow" | "like" | "comment" | "track_upload" | "playlist_follow"
  title: string
  message: string
  data: Record<string, any>
  isRead: boolean
  createdAt: any // Firestore Timestamp
}

export interface AnalyticsDocument {
  id: string
  userId?: string
  trackId?: string
  event: "play" | "skip" | "like" | "share" | "download"
  metadata: Record<string, any>
  timestamp: any // Firestore Timestamp
  sessionId: string
  userAgent?: string
  location?: {
    country?: string
    city?: string
  }
}
