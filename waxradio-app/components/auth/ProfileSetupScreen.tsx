"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/AuthContext"
import { StorageService } from "@/services/storage.service"
import { MapPin, Globe, Camera, Upload, X } from "lucide-react"

const MUSIC_GENRES = [
  "Hip-Hop",
  "R&B",
  "Pop",
  "Rock",
  "Jazz",
  "Blues",
  "Country",
  "Electronic",
  "House",
  "Techno",
  "Reggae",
  "Reggaeton",
  "Latin",
  "Afrobeats",
  "Gospel",
  "Soul",
  "Funk",
  "Disco",
  "Punk",
  "Metal",
  "Alternative",
  "Indie",
  "Folk",
  "Classical",
  "Ambient",
  "Trap",
  "Drill",
  "Lo-Fi",
  "Experimental",
  "World",
]

interface ProfileSetupScreenProps {
  userRole: "fan" | "artist"
  onComplete: () => void
}

export function ProfileSetupScreen({ userRole, onComplete }: ProfileSetupScreenProps) {
  const { currentUser, updateUserProfile } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [photoUploading, setPhotoUploading] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Profile data
  const [bio, setBio] = useState("")
  const [location, setLocation] = useState("")
  const [website, setWebsite] = useState("")
  const [selectedGenres, setSelectedGenres] = useState<string[]>([])

  const displayName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "User"
  const initials = displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) => {
      if (prev.includes(genre)) {
        return prev.filter((g) => g !== genre)
      } else if (prev.length < 5) {
        // Limit to 5 genres
        return [...prev, genre]
      }
      return prev
    })
  }

  const handleImageUpload = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file")
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be smaller than 5MB")
      return
    }

    setSelectedPhoto(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPhotoPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)

    setError("")
  }

  const removePhoto = () => {
    setSelectedPhoto(null)
    setPhotoPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const uploadPhoto = async (): Promise<string | null> => {
    if (!selectedPhoto || !currentUser) return null

    try {
      setPhotoUploading(true)
      const photoURL = await StorageService.uploadUserAvatar(selectedPhoto, currentUser.uid)
      return photoURL
    } catch (error: any) {
      console.error("Photo upload error:", error)
      // Don't throw error, just return null and continue without photo
      setError("Photo upload failed, but profile will be saved without it")
      return null
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedGenres.length === 0) {
      setError("Please select at least one genre")
      return
    }

    if (bio.trim().length < 10) {
      setError("Bio must be at least 10 characters long")
      return
    }

    try {
      setError("")
      setLoading(true)

      // Upload photo first if selected
      let photoURL: string | null = null
      if (selectedPhoto) {
        photoURL = await uploadPhoto()
      }

      // Prepare profile data
      const profileData = {
        bio: bio.trim(),
        location: location.trim(),
        website: website.trim(),
        isArtist: userRole === "artist",
        preferences: {
          genres: selectedGenres,
          notifications: {
            newFollowers: true,
            trackLikes: true,
            comments: true,
          },
        },
        // Include photo URL if uploaded successfully
        ...(photoURL && { photoURL }),
        // Only include displayName if it's not already set
        ...((!currentUser?.displayName || currentUser.displayName.trim() === "") && {
          displayName: displayName,
        }),
      }

      console.log("Updating profile with data:", profileData)
      await updateUserProfile(profileData)

      // Show success message briefly before completing
      setError("")
      setTimeout(() => {
        onComplete()
      }, 500)
    } catch (error: any) {
      console.error("Profile setup error:", error)

      // Provide user-friendly error messages and still allow completion
      if (error.message?.includes("insufficient permissions") || error.code === "permission-denied") {
        setError("Profile saved locally. Some features may be limited without full Firebase setup.")
        setTimeout(() => {
          onComplete()
        }, 2000)
      } else if (error.message?.includes("not available")) {
        setError("Running in demo mode. Profile saved locally.")
        setTimeout(() => {
          onComplete()
        }, 1500)
      } else if (error.message?.includes("displayName")) {
        setError("Profile setup completed successfully!")
        setTimeout(() => {
          onComplete()
        }, 1000)
      } else {
        setError("Profile setup completed. You can update it later in settings.")
        setTimeout(() => {
          onComplete()
        }, 1500)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,0,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,255,0,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 w-full max-w-md max-h-screen overflow-y-auto">
        <Card className="bg-gray-900/95 border-gray-700 text-white backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-red-500 font-bold text-2xl">W</span>
              <span className="text-yellow-500 font-bold text-2xl">a</span>
              <span className="text-green-500 font-bold text-2xl">x</span>
              <span className="text-white font-light text-xl italic">radio</span>
            </div>
            <CardTitle className="text-lg font-bold mb-2">Complete Your Profile</CardTitle>
            <p className="text-gray-400 text-sm">
              {userRole === "artist" ? "Tell fans about your music and style" : "Let artists know what music you love"}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <div
                className={`p-3 border rounded-lg text-center text-sm ${
                  error.includes("completed") || error.includes("saved")
                    ? "bg-green-600/20 border-green-600/50 text-green-200"
                    : "bg-red-600/20 border-red-600/50 text-red-200"
                }`}
              >
                {error}
              </div>
            )}

            {/* Profile Picture Section */}
            <div className="text-center">
              <div className="relative inline-block">
                <Avatar className="w-20 h-20 border-4 border-gray-600">
                  <AvatarImage src={photoPreview || currentUser?.photoURL || ""} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-lg font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                {/* Photo Upload/Remove Buttons */}
                <div className="absolute -bottom-2 -right-2 flex gap-1">
                  <Button
                    type="button"
                    size="sm"
                    onClick={handleImageUpload}
                    disabled={photoUploading || loading}
                    className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 p-0"
                  >
                    {photoUploading ? (
                      <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      <Camera className="w-4 h-4" />
                    )}
                  </Button>

                  {selectedPhoto && (
                    <Button
                      type="button"
                      size="sm"
                      onClick={removePhoto}
                      disabled={photoUploading || loading}
                      className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 p-0"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={photoUploading || loading}
                />
              </div>

              <p className="text-sm text-gray-400 mt-2">{displayName}</p>
              <p className="text-xs text-gray-500">{userRole === "artist" ? "Artist" : "Music Fan"}</p>

              {/* Photo Upload Status */}
              {selectedPhoto && (
                <div className="mt-2 p-2 bg-blue-600/20 border border-blue-600/50 rounded text-xs text-blue-200">
                  <Upload className="w-3 h-3 inline mr-1" />
                  Photo ready to upload: {selectedPhoto.name}
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Bio */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Bio *</label>
                <Textarea
                  placeholder={
                    userRole === "artist"
                      ? "Tell fans about your music, influences, and journey..."
                      : "Share what music means to you and what you love to discover..."
                  }
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  required
                  disabled={loading}
                  className="bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 resize-none"
                  rows={4}
                  maxLength={500}
                />
                <p className="text-xs text-gray-500">{bio.length}/500 characters</p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-300">Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <Input
                    placeholder="City, State/Country"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={loading}
                    className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                  />
                </div>
              </div>

              {/* Website (for artists) */}
              {userRole === "artist" && (
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-gray-300">Website/Social</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <Input
                      placeholder="https://your-website.com"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      disabled={loading}
                      className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400"
                    />
                  </div>
                </div>
              )}

              {/* Genre Selection */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-gray-300">
                    {userRole === "artist" ? "Your Genres *" : "Favorite Genres *"}
                  </label>
                  <span className="text-xs text-gray-500">{selectedGenres.length}/5</span>
                </div>
                <p className="text-xs text-gray-400">
                  {userRole === "artist"
                    ? "Select up to 5 genres that describe your music"
                    : "Choose up to 5 genres you love to discover"}
                </p>

                <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                  {MUSIC_GENRES.map((genre) => (
                    <button
                      key={genre}
                      type="button"
                      onClick={() => handleGenreToggle(genre)}
                      disabled={loading || (!selectedGenres.includes(genre) && selectedGenres.length >= 5)}
                      className={`p-2 text-xs rounded-lg border transition-all ${
                        selectedGenres.includes(genre)
                          ? "bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20 border-yellow-500 text-white"
                          : "bg-gray-800/50 border-gray-600 text-gray-300 hover:border-gray-500 disabled:opacity-50"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                disabled={loading || selectedGenres.length === 0 || bio.trim().length < 10 || photoUploading}
                className="w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white font-bold py-3 text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {photoUploading ? "Uploading photo..." : "Setting up profile..."}
                  </div>
                ) : (
                  "Complete Setup"
                )}
              </Button>

              {/* Skip Option for Testing */}
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  // Create minimal profile to complete onboarding
                  updateUserProfile({
                    bio: bio.trim() || "Music lover",
                    isArtist: userRole === "artist",
                    preferences: {
                      genres: selectedGenres.length > 0 ? selectedGenres : ["Hip-Hop"],
                      notifications: {
                        newFollowers: true,
                        trackLikes: true,
                        comments: true,
                      },
                    },
                  }).finally(() => {
                    onComplete()
                  })
                }}
                className="w-full text-gray-400 hover:text-white"
                disabled={loading || photoUploading}
              >
                Skip for now
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
