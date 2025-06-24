import { storageUtils } from "@/lib/firebase-utils"

export class StorageService {
  // Upload track audio file
  static async uploadTrackAudio(file: File, trackId: string, type: "preview" | "full"): Promise<string> {
    const path = `tracks/${trackId}/${type}.mp3`
    return await storageUtils.uploadFile(path, file)
  }

  // Upload track artwork
  static async uploadTrackArtwork(file: File, trackId: string): Promise<string> {
    const path = `tracks/${trackId}/artwork.jpg`
    return await storageUtils.uploadFile(path, file)
  }

  // Upload user avatar
  static async uploadUserAvatar(file: File, userId: string): Promise<string> {
    const path = `users/${userId}/avatar.jpg`
    return await storageUtils.uploadFile(path, file)
  }

  // Upload artist cover photo
  static async uploadArtistCover(file: File, artistId: string): Promise<string> {
    const path = `artists/${artistId}/cover.jpg`
    return await storageUtils.uploadFile(path, file)
  }

  // Upload playlist cover
  static async uploadPlaylistCover(file: File, playlistId: string): Promise<string> {
    const path = `playlists/${playlistId}/cover.jpg`
    return await storageUtils.uploadFile(path, file)
  }

  // Delete file
  static async deleteFile(path: string): Promise<void> {
    await storageUtils.deleteFile(path)
  }

  // Upload with progress tracking
  static uploadWithProgress(file: File, path: string) {
    return storageUtils.uploadFileWithProgress(path, file)
  }
}
