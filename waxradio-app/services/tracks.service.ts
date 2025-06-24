import { firestoreUtils, queryConstraints } from "@/lib/firebase-utils"
import { COLLECTIONS, type TrackDocument, type VoteDocument } from "@/lib/firebase-collections"

export class TracksService {
  // Get all tracks with optional filters
  static async getTracks(
    options: {
      genre?: string
      limit?: number
      orderBy?: "heatScore" | "uploadedAt" | "plays"
      orderDirection?: "asc" | "desc"
    } = {},
  ) {
    const constraints = []

    if (options.genre) {
      constraints.push(queryConstraints.whereEqual("genre", options.genre))
    }

    if (options.orderBy) {
      const direction = options.orderDirection || "desc"
      constraints.push(
        direction === "desc"
          ? queryConstraints.orderByDesc(options.orderBy)
          : queryConstraints.orderByAsc(options.orderBy),
      )
    }

    if (options.limit) {
      constraints.push(queryConstraints.limitTo(options.limit))
    }

    return (await firestoreUtils.getDocuments(COLLECTIONS.TRACKS, constraints)) as TrackDocument[]
  }

  // Get a single track
  static async getTrack(trackId: string): Promise<TrackDocument | null> {
    return (await firestoreUtils.getDocument(COLLECTIONS.TRACKS, trackId)) as TrackDocument | null
  }

  // Get tracks by artist
  static async getTracksByArtist(artistId: string): Promise<TrackDocument[]> {
    const constraints = [queryConstraints.whereEqual("artistId", artistId), queryConstraints.orderByDesc("uploadedAt")]
    return (await firestoreUtils.getDocuments(COLLECTIONS.TRACKS, constraints)) as TrackDocument[]
  }

  // Vote on a track
  static async voteOnTrack(userId: string, trackId: string, voteType: "up" | "down") {
    // Check if user already voted
    const existingVotes = await firestoreUtils.getDocuments(COLLECTIONS.VOTES, [
      queryConstraints.whereEqual("userId", userId),
      queryConstraints.whereEqual("trackId", trackId),
    ])

    // Remove existing vote if any
    if (existingVotes.length > 0) {
      await firestoreUtils.deleteDocument(COLLECTIONS.VOTES, existingVotes[0].id)

      // Update track vote counts
      const track = await this.getTrack(trackId)
      if (track) {
        const oldVoteType = existingVotes[0].type
        await firestoreUtils.updateDocument(COLLECTIONS.TRACKS, trackId, {
          [oldVoteType === "up" ? "upvotes" : "downvotes"]: Math.max(
            0,
            track[oldVoteType === "up" ? "upvotes" : "downvotes"] - 1,
          ),
          totalVotes: Math.max(0, track.totalVotes - 1),
        })
      }
    }

    // Add new vote
    const voteData: Partial<VoteDocument> = {
      userId,
      trackId,
      type: voteType,
      votedAt: new Date(),
    }

    const voteId = `${userId}_${trackId}`
    await firestoreUtils.setDocument(COLLECTIONS.VOTES, voteId, voteData)

    // Update track vote counts and heat score
    const track = await this.getTrack(trackId)
    if (track) {
      const newUpvotes = voteType === "up" ? track.upvotes + 1 : track.upvotes
      const newDownvotes = voteType === "down" ? track.downvotes + 1 : track.downvotes
      const newTotalVotes = newUpvotes + newDownvotes

      // Calculate new heat score (30-110 range)
      const voteRatio = newTotalVotes > 0 ? newUpvotes / newTotalVotes : 0.5
      const heatScore = Math.round(30 + voteRatio * 80)

      await firestoreUtils.updateDocument(COLLECTIONS.TRACKS, trackId, {
        upvotes: newUpvotes,
        downvotes: newDownvotes,
        totalVotes: newTotalVotes,
        heatScore,
      })
    }

    return voteData
  }

  // Get user's vote for a track
  static async getUserVote(userId: string, trackId: string): Promise<VoteDocument | null> {
    const votes = await firestoreUtils.getDocuments(COLLECTIONS.VOTES, [
      queryConstraints.whereEqual("userId", userId),
      queryConstraints.whereEqual("trackId", trackId),
    ])
    return votes.length > 0 ? (votes[0] as VoteDocument) : null
  }

  // Increment play count
  static async incrementPlayCount(trackId: string) {
    await firestoreUtils.incrementField(COLLECTIONS.TRACKS, trackId, "plays")
  }

  // Search tracks
  static async searchTracks(searchTerm: string): Promise<TrackDocument[]> {
    // Note: This is a basic implementation. For production, consider using Algolia or similar
    const allTracks = await this.getTracks({ limit: 100 })
    return allTracks.filter(
      (track) =>
        track.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        track.artist.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }

  // Get trending tracks (high heat score + recent activity)
  static async getTrendingTracks(limit = 20): Promise<TrackDocument[]> {
    return await this.getTracks({
      orderBy: "heatScore",
      orderDirection: "desc",
      limit,
    })
  }

  // Subscribe to track updates
  static subscribeToTrack(trackId: string, callback: (track: TrackDocument | null) => void) {
    return firestoreUtils.subscribeToDocument(COLLECTIONS.TRACKS, trackId, callback)
  }

  // Subscribe to tracks collection
  static subscribeToTracks(
    callback: (tracks: TrackDocument[]) => void,
    options: {
      genre?: string
      limit?: number
      orderBy?: "heatScore" | "uploadedAt" | "plays"
    } = {},
  ) {
    const constraints = []

    if (options.genre) {
      constraints.push(queryConstraints.whereEqual("genre", options.genre))
    }

    if (options.orderBy) {
      constraints.push(queryConstraints.orderByDesc(options.orderBy))
    }

    if (options.limit) {
      constraints.push(queryConstraints.limitTo(options.limit))
    }

    return firestoreUtils.subscribeToCollection(COLLECTIONS.TRACKS, callback, constraints)
  }
}
