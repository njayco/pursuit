"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/AuthContext"
import { StorageService } from "@/services/storage.service"
import {
  ArrowLeft,
  Camera,
  Edit3,
  Save,
  X,
  MapPin,
  Globe,
  Calendar,
  Music,
  Heart,
  Users,
  Crown,
  Settings,
  Bell,
  Shield,
  Palette,
  Upload,
  Loader2,
} from "lucide-react"

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

interface ProfileScreenProps {
  onBack: () => void
}

export function ProfileScreen({ onBack }: ProfileScreenProps) {
  const { currentUser, userProfile, updateUserProfile, isFirebaseAvailable } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [photoUploading, setPhotoUploading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [selectedPhoto, setSelectedPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Form state
  const [formData, setFormData] = useState({
    displayName: userProfile?.displayName || currentUser?.displayName || "",
    bio: userProfile?.bio || "",
    location: userProfile?.location || "",
    website: userProfile?.website || "",
    genres: userProfile?.preferences?.genres || [],
    notifications: {
      newFollowers: userProfile?.preferences?.notifications?.newFollowers ?? true,
      trackLikes: userProfile?.preferences?.notifications?.trackLikes ?? true,
      comments: userProfile?.preferences?.notifications?.comments ?? true,
    },
  })

  const displayName =
    userProfile?.displayName || currentUser?.displayName || currentUser?.email?.split("@")[0] || "User"
  const initials = displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  const handleGenreToggle = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : prev.genres.length < 5
          ? [...prev.genres, genre]
          : prev.genres,
    }))
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

      // Handle different error scenarios
      if (!isFirebaseAvailable) {
        setSuccess("Photo uploaded successfully! (Demo mode)")
        return photoPreview // Return preview URL for demo mode
      } else {
        setError("Photo upload failed. Please try again.")
        return null
      }
    } finally {
      setPhotoUploading(false)
    }
  }

  const handleSave = async () => {
    if (formData.displayName.trim().length < 2) {
      setError("Display name must be at least 2 characters")
      return
    }

    if (formData.bio.trim().length < 10) {
      setError("Bio must be at least 10 characters")
      return
    }

    if (formData.genres.length === 0) {
      setError("Please select at least one genre")
      return
    }

    try {
      setError("")
      setSuccess("")
      setLoading(true)

      // Upload photo first if selected
      let photoURL: string | null = null
      if (selectedPhoto) {
        photoURL = await uploadPhoto()
      }

      // Prepare update data
      const updateData = {
        displayName: formData.displayName.trim(),
        bio: formData.bio.trim(),
        location: formData.location.trim(),
        website: formData.website.trim(),
        preferences: {
          genres: formData.genres,
          notifications: formData.notifications,
        },
        // Include photo URL if uploaded successfully
        ...(photoURL && { photoURL }),
      }

      await updateUserProfile(updateData)

      setSuccess("Profile updated successfully!")
      setIsEditing(false)
      setSelectedPhoto(null)
      setPhotoPreview(null)

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000)
    } catch (error: any) {
      console.error("Profile update error:", error)
      if (error.message?.includes("insufficient permissions") || error.code === "permission-denied") {
        setSuccess("Profile updated locally! (Demo mode)")
        setIsEditing(false)
        setSelectedPhoto(null)
        setPhotoPreview(null)
        setTimeout(() => setSuccess(""), 3000)
      } else {
        setError("Failed to update profile. Please try again.")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleCancel = () => {
    setFormData({
      displayName: userProfile?.displayName || currentUser?.displayName || "",
      bio: userProfile?.bio || "",
      location: userProfile?.location || "",
      website: userProfile?.website || "",
      genres: userProfile?.preferences?.genres || [],
      notifications: {
        newFollowers: userProfile?.preferences?.notifications?.newFollowers ?? true,
        trackLikes: userProfile?.preferences?.notifications?.trackLikes ?? true,
        comments: userProfile?.preferences?.notifications?.comments ?? true,
      },
    })
    setIsEditing(false)
    setError("")
    setSuccess("")
    setSelectedPhoto(null)
    setPhotoPreview(null)
  }

  const joinDate = userProfile?.joinedAt
    ? new Date(
        userProfile.joinedAt.seconds ? userProfile.joinedAt.seconds * 1000 : userProfile.joinedAt,
      ).toLocaleDateString()
    : new Date().toLocaleDateString()

  // Get current profile picture URL
  const currentPhotoURL = photoPreview || userProfile?.photoURL || currentUser?.photoURL || ""

  return (
    <div className="max-w-sm mx-auto h-screen bg-black flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-gray-400 hover:text-white">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="text-lg font-bold">Profile</h1>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => (isEditing ? handleCancel() : setIsEditing(true))}
          className="text-gray-400 hover:text-white"
          disabled={loading || photoUploading}
        >
          {isEditing ? <X className="w-5 h-5" /> : <Edit3 className="w-5 h-5" />}
        </Button>
      </div>

      {/* Status Messages */}
      {error && (
        <div className="mx-4 mt-4 p-3 bg-red-600/20 border border-red-600/50 rounded-lg text-center text-sm text-red-200">
          {error}
        </div>
      )}

      {success && (
        <div className="mx-4 mt-4 p-3 bg-green-600/20 border border-green-600/50 rounded-lg text-center text-sm text-green-200">
          {success}
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile Header */}
        <div className="p-6 text-center border-b border-gray-800">
          <div className="relative inline-block mb-4">
            <Avatar className="w-24 h-24 border-4 border-gray-600">
              <AvatarImage src={currentPhotoURL || "/placeholder.svg"} />
              <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-xl font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>

            {/* Photo Upload/Remove Buttons */}
            {isEditing && (
              <div className="absolute -bottom-2 -right-2 flex gap-1">
                <Button
                  size="sm"
                  onClick={handleImageUpload}
                  disabled={photoUploading || loading}
                  className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 p-0"
                >
                  {photoUploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Camera className="w-4 h-4" />}
                </Button>

                {selectedPhoto && (
                  <Button
                    size="sm"
                    onClick={removePhoto}
                    disabled={photoUploading || loading}
                    className="w-8 h-8 rounded-full bg-red-600 hover:bg-red-700 p-0"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                )}
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
              disabled={photoUploading || loading}
            />
          </div>

          {/* Photo Upload Status */}
          {selectedPhoto && (
            <div className="mb-4 p-2 bg-blue-600/20 border border-blue-600/50 rounded text-xs text-blue-200">
              <Upload className="w-3 h-3 inline mr-1" />
              Photo ready to upload: {selectedPhoto.name}
            </div>
          )}

          {/* Display Name */}
          {isEditing ? (
            <Input
              value={formData.displayName}
              onChange={(e) => setFormData((prev) => ({ ...prev, displayName: e.target.value }))}
              className="text-center text-xl font-bold bg-gray-800/50 border-gray-600 text-white mb-2"
              placeholder="Display Name"
              disabled={loading || photoUploading}
            />
          ) : (
            <h2 className="text-xl font-bold mb-2">{displayName}</h2>
          )}

          {/* Role Badge */}
          <div className="flex items-center justify-center gap-2 mb-4">
            <Badge
              variant="outline"
              className={`${
                userProfile?.isArtist
                  ? "border-purple-500 text-purple-300 bg-purple-600/20"
                  : "border-blue-500 text-blue-300 bg-blue-600/20"
              }`}
            >
              {userProfile?.isArtist ? (
                <>
                  <Crown className="w-3 h-3 mr-1" />
                  Artist
                </>
              ) : (
                <>
                  <Heart className="w-3 h-3 mr-1" />
                  Fan
                </>
              )}
            </Badge>
            {userProfile?.isVerified && (
              <Badge variant="outline" className="border-yellow-500 text-yellow-300 bg-yellow-600/20">
                <Shield className="w-3 h-3 mr-1" />
                Verified
              </Badge>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-center gap-6 text-sm">
            <div className="text-center">
              <div className="font-bold text-lg">{userProfile?.followers || 0}</div>
              <div className="text-gray-400">Followers</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{userProfile?.following || 0}</div>
              <div className="text-gray-400">Following</div>
            </div>
            <div className="text-center">
              <div className="font-bold text-lg">{userProfile?.totalVotes || 0}</div>
              <div className="text-gray-400">Votes</div>
            </div>
          </div>
        </div>

        {/* Profile Details */}
        <div className="p-4 space-y-6">
          {/* Bio Section */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Music className="w-4 h-4" />
                About
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={formData.bio}
                  onChange={(e) => setFormData((prev) => ({ ...prev, bio: e.target.value }))}
                  placeholder="Tell everyone about yourself and your music taste..."
                  className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 resize-none"
                  rows={4}
                  maxLength={500}
                  disabled={loading || photoUploading}
                />
              ) : (
                <p className="text-gray-300 leading-relaxed">
                  {userProfile?.bio || "No bio added yet. Click edit to add one!"}
                </p>
              )}
              {isEditing && <p className="text-xs text-gray-500 mt-2">{formData.bio.length}/500 characters</p>}
            </CardContent>
          </Card>

          {/* Location & Website */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300">Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Location */}
              <div className="flex items-center gap-3">
                <MapPin className="w-4 h-4 text-gray-400" />
                {isEditing ? (
                  <Input
                    value={formData.location}
                    onChange={(e) => setFormData((prev) => ({ ...prev, location: e.target.value }))}
                    placeholder="City, State/Country"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    disabled={loading || photoUploading}
                  />
                ) : (
                  <span className="text-gray-300">{userProfile?.location || "Location not set"}</span>
                )}
              </div>

              {/* Website */}
              <div className="flex items-center gap-3">
                <Globe className="w-4 h-4 text-gray-400" />
                {isEditing ? (
                  <Input
                    value={formData.website}
                    onChange={(e) => setFormData((prev) => ({ ...prev, website: e.target.value }))}
                    placeholder="https://your-website.com"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
                    disabled={loading || photoUploading}
                  />
                ) : (
                  <span className="text-gray-300">{userProfile?.website || "No website"}</span>
                )}
              </div>

              {/* Join Date */}
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4 text-gray-400" />
                <span className="text-gray-300">Joined {joinDate}</span>
              </div>
            </CardContent>
          </Card>

          {/* Favorite Genres */}
          <Card className="bg-gray-800/50 border-gray-700">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-300 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Favorite Genres
                </span>
                {isEditing && <span className="text-xs text-gray-500">{formData.genres.length}/5</span>}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {MUSIC_GENRES.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      disabled={
                        (!formData.genres.includes(genre) && formData.genres.length >= 5) || loading || photoUploading
                      }
                      className={`p-2 text-xs rounded-lg border transition-all text-left ${
                        formData.genres.includes(genre)
                          ? "bg-gradient-to-r from-red-500/20 via-yellow-500/20 to-green-500/20 border-yellow-500 text-white"
                          : "bg-gray-700/50 border-gray-600 text-gray-300 hover:border-gray-500 disabled:opacity-50"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {userProfile?.preferences?.genres?.length ? (
                    userProfile.preferences.genres.map((genre) => (
                      <Badge key={genre} variant="outline" className="border-gray-600 text-gray-300 bg-gray-700/50">
                        {genre}
                      </Badge>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">No genres selected</span>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notification Preferences */}
          {isEditing && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Bell className="w-4 h-4" />
                  Notifications
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">New Followers</span>
                  <Switch
                    checked={formData.notifications.newFollowers}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, newFollowers: checked },
                      }))
                    }
                    disabled={loading || photoUploading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Track Likes</span>
                  <Switch
                    checked={formData.notifications.trackLikes}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, trackLikes: checked },
                      }))
                    }
                    disabled={loading || photoUploading}
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-300">Comments</span>
                  <Switch
                    checked={formData.notifications.comments}
                    onCheckedChange={(checked) =>
                      setFormData((prev) => ({
                        ...prev,
                        notifications: { ...prev.notifications, comments: checked },
                      }))
                    }
                    disabled={loading || photoUploading}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Account Actions */}
          {!isEditing && (
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium text-gray-300 flex items-center gap-2">
                  <Settings className="w-4 h-4 mr-2" />
                  Account
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  <Users className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full justify-start border-gray-600 text-gray-300 hover:bg-gray-700/50"
                >
                  <Shield className="w-4 h-4 mr-2" />
                  Security
                </Button>
                {!userProfile?.isArtist && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start border-purple-600 text-purple-300 hover:bg-purple-600/20"
                  >
                    <Crown className="w-4 h-4 mr-2" />
                    Become an Artist
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Save Button */}
      {isEditing && (
        <div className="p-4 border-t border-gray-800">
          <Button
            onClick={handleSave}
            disabled={loading || photoUploading}
            className="w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white font-bold py-3"
          >
            {loading || photoUploading ? (
              <div className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                {photoUploading ? "Uploading photo..." : "Saving..."}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </div>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
