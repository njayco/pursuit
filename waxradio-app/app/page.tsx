"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  ThumbsUp,
  ThumbsDown,
  Play,
  Pause,
  Search,
  Home,
  User,
  Radio,
  MessageSquare,
  Settings,
  Heart,
  SkipForward,
  Volume2,
} from "lucide-react"
import { useAudioPlayer, type Track } from "@/hooks/useAudioPlayer"
import { OnboardingTutorial } from "@/components/onboarding-tutorial"
import { useOnboarding } from "@/hooks/useOnboarding"
import { ProtectedRoute } from "@/components/auth/ProtectedRoute"
import { UserMenu } from "@/components/UserMenu"
import { useAuth } from "@/contexts/AuthContext"
import { DemoModeIndicator } from "@/components/DemoModeIndicator"
import { WelcomeScreen } from "@/components/WelcomeScreen"
import { AuthScreen } from "@/components/auth/AuthScreen"
import { RoleSelectionScreen } from "@/components/auth/RoleSelectionScreen"
import { ProfileSetupScreen } from "@/components/auth/ProfileSetupScreen"
import { ArtistDashboard } from "@/components/ArtistDashboard"
import { FanDashboard } from "@/components/FanDashboard"
import { ProfileScreen } from "@/components/ProfileScreen"

// Mock tracks with audio URLs
const mockTracks: Track[] = [
  {
    id: "1",
    title: "Girls, Girls, Girls",
    artist: "Jay-Z (Feat. Q-Tip, Slick Rick & Biz Markie)",
    album: "The Blueprint",
    heatScore: 108,
    previewUrl: "/audio/girls-girls-girls-preview.mp3",
    fullUrl: "/audio/girls-girls-girls-full.mp3",
    artwork: "/placeholder.svg?height=300&width=300&text=Jay-Z",
    duration: 268,
  },
  {
    id: "2",
    title: "ALONE",
    artist: "NO. 1 DRUG",
    album: "Underground Vibes",
    heatScore: 110,
    previewUrl: "/audio/alone-preview.mp3",
    fullUrl: "/audio/alone-full.mp3",
    artwork: "/placeholder.svg?height=300&width=300&text=NO.1+DRUG",
    duration: 180,
  },
  {
    id: "3",
    title: "Definition",
    artist: "Mos Def & Talib Kweli",
    album: "BlackStar",
    heatScore: 110,
    previewUrl: "/audio/definition-preview.mp3",
    fullUrl: "/audio/definition-full.mp3",
    artwork: "/placeholder.svg?height=300&width=300&text=BlackStar",
    duration: 206,
  },
]

const mockAlbums = [
  {
    title: "The Blueprint",
    artist: "Jay-Z",
    heatScore: 108,
    artwork: "/placeholder.svg?height=150&width=150&text=Jay-Z",
  },
  {
    title: "BlackStar",
    artist: "Mos Def & Talib Kweli",
    heatScore: 110,
    artwork: "/placeholder.svg?height=150&width=150&text=BlackStar",
  },
  {
    title: "Illmatic",
    artist: "Nas",
    heatScore: 108,
    artwork: "/placeholder.svg?height=150&width=150&text=Nas",
  },
  {
    title: "36 Chambers",
    artist: "Wu-Tang Clan",
    heatScore: 105,
    artwork: "/placeholder.svg?height=150&width=150&text=Wu-Tang",
  },
  {
    title: "Ready to Die",
    artist: "The Notorious B.I.G.",
    heatScore: 103,
    artwork: "/placeholder.svg?height=150&width=150&text=Biggie",
  },
  {
    title: "The Chronic",
    artist: "Dr. Dre",
    heatScore: 101,
    artwork: "/placeholder.svg?height=150&width=150&text=Dr.+Dre",
  },
]

const mockAlbumTracks = [
  { id: 1, title: "Intro", heatScore: 91, duration: "1:11" },
  { id: 2, title: "Astronomy (8th Light)", heatScore: 94, duration: "3:23" },
  { id: 3, title: "Definition", heatScore: 110, duration: "3:26" },
  { id: 4, title: "RE: DEFinition", heatScore: 94, duration: "3:02" },
  { id: 5, title: "Children's Story", heatScore: 91, duration: "3:32" },
  { id: 6, title: "Thieves in the Night", heatScore: 89, duration: "5:46" },
]

function WaxRadioAppContent({ onNavigateToDashboard }: { onNavigateToDashboard?: () => void }) {
  const [currentView, setCurrentView] = useState<"radio" | "discover" | "album" | "profile" | "userProfile">("radio")
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const audioPlayer = useAudioPlayer()
  const { showOnboarding, isLoading, completeOnboarding, resetOnboarding } = useOnboarding()
  const { currentUser } = useAuth()

  // Auto-load first track on mount
  useEffect(() => {
    if (mockTracks.length > 0) {
      audioPlayer.loadTrack(mockTracks[0], true)
    }
  }, [])

  const getHeatColor = (score: number) => {
    if (score >= 100) return "text-red-500"
    if (score >= 90) return "text-orange-500"
    if (score >= 80) return "text-yellow-500"
    return "text-green-500"
  }

  const getHeatLevel = (score: number) => {
    return Math.min(100, Math.max(0, ((score - 30) / 80) * 100))
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const handleVote = (type: "up" | "down") => {
    if (type === "up") {
      audioPlayer.voteUp()
    } else {
      audioPlayer.voteDown()
      // Load next track after a short delay
      setTimeout(() => {
        const nextIndex = (currentTrackIndex + 1) % mockTracks.length
        setCurrentTrackIndex(nextIndex)
        audioPlayer.loadTrack(mockTracks[nextIndex], true)
      }, 1000)
    }
  }

  const handleSkipToNext = () => {
    const nextIndex = (currentTrackIndex + 1) % mockTracks.length
    setCurrentTrackIndex(nextIndex)
    audioPlayer.loadTrack(mockTracks[nextIndex], true)
  }

  const RadioPlayer = () => {
    const currentTrack = audioPlayer.currentTrack || mockTracks[currentTrackIndex]
    const timeRemaining = audioPlayer.getTimeRemaining()
    const needsUserInteraction = !audioPlayer.state.isPlaying && audioPlayer.state.currentTime === 0

    return (
      <div className="flex flex-col h-full bg-black text-white relative overflow-hidden">
        {/* Header with User Menu */}
        <div className="flex items-center justify-between p-4 z-10">
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold text-xl">W</span>
            <span className="text-yellow-500 font-bold text-xl">a</span>
            <span className="text-green-500 font-bold text-xl">x</span>
            <span className="text-white font-light text-lg italic">radio</span>
          </div>
          <div className="flex items-center gap-4">
            {onNavigateToDashboard && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onNavigateToDashboard}
                className="text-gray-400 hover:text-white"
              >
                <User className="w-5 h-5" />
              </Button>
            )}
            <div className="text-white">
              <svg width="60" height="20" viewBox="0 0 60 20" className="fill-white">
                <path d="M5 15 L15 5 L25 10 L35 2 L45 8 L55 3" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <UserMenu onNavigateToProfile={() => setCurrentView("userProfile")} />
          </div>
        </div>

        {/* Audio Status Display */}
        {audioPlayer.state.error && (
          <div className="mx-4 mb-4 p-3 bg-yellow-600/20 border border-yellow-600 rounded text-center">
            <p className="text-sm">{audioPlayer.state.error}</p>
          </div>
        )}

        {/* Vinyl Record */}
        <div className="flex-1 flex items-center justify-center relative">
          <div className="relative">
            {/* Smoke/dust effect */}
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-gray-800/20 to-transparent rounded-full scale-150 animate-pulse"></div>

            {/* Vinyl Record */}
            <div
              className={`w-64 h-64 rounded-full bg-gradient-radial from-gray-900 via-black to-gray-900 relative ${
                audioPlayer.state.isPlaying ? "animate-spin" : ""
              } transition-all duration-500`}
            >
              {/* Record grooves */}
              <div className="absolute inset-4 rounded-full border border-gray-700"></div>
              <div className="absolute inset-8 rounded-full border border-gray-700"></div>
              <div className="absolute inset-12 rounded-full border border-gray-700"></div>

              {/* Center label */}
              <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-black"></div>
              </div>

              {/* Album art in center */}
              <div className="absolute inset-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full overflow-hidden">
                <img
                  src={currentTrack.artwork || "/placeholder.svg"}
                  alt="Album art"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Large Play Button Overlay when not playing */}
              {needsUserInteraction && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button
                    size="lg"
                    className="w-16 h-16 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-sm"
                    onClick={audioPlayer.play}
                    disabled={audioPlayer.state.isLoading}
                  >
                    <Play className="w-8 h-8 text-white" />
                  </Button>
                </div>
              )}
            </div>

            {/* Loading indicator */}
            {audioPlayer.state.isLoading && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              </div>
            )}
          </div>

          {/* Heat Thermometer */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
            <div className="w-6 h-32 bg-gray-800 rounded-full relative overflow-hidden">
              <div
                className="absolute bottom-0 w-full bg-gradient-to-t from-red-500 via-orange-500 to-yellow-500 rounded-full transition-all duration-1000"
                style={{ height: `${getHeatLevel(currentTrack.heatScore)}%` }}
              ></div>
            </div>
            <div className={`text-center mt-2 font-bold ${getHeatColor(currentTrack.heatScore)}`}>
              {currentTrack.heatScore}°
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-4 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
            <span>{formatTime(audioPlayer.state.currentTime)}</span>
            <div className="flex-1 h-1 bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-100"
                style={{
                  width: `${audioPlayer.state.duration > 0 ? (audioPlayer.state.currentTime / audioPlayer.state.duration) * 100 : 0}%`,
                }}
              ></div>
            </div>
            <span>{formatTime(audioPlayer.state.duration)}</span>
          </div>
          {audioPlayer.state.isPreview && !audioPlayer.state.hasVoted && audioPlayer.state.isPlaying && (
            <div className="text-center text-yellow-500 text-sm">Preview Mode • {timeRemaining}s remaining</div>
          )}
          {needsUserInteraction && (
            <div className="text-center text-blue-400 text-sm">Click the play button to start listening</div>
          )}
        </div>

        {/* Song Info */}
        <div className="text-center px-4 mb-6">
          <h2 className="text-2xl font-bold mb-1">{currentTrack.title}</h2>
          <p className="text-gray-400 text-lg">{currentTrack.artist}</p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <MessageSquare className="w-5 h-5" />
            <Heart className="w-5 h-5" />
          </div>
        </div>

        {/* Audio Controls */}
        <div className="flex items-center justify-center gap-4 mb-4">
          <Button
            size="lg"
            variant="ghost"
            className="w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white"
            onClick={audioPlayer.togglePlayPause}
            disabled={audioPlayer.state.isLoading}
          >
            {audioPlayer.state.isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
          </Button>
          <Button size="sm" variant="ghost" className="text-white" onClick={handleSkipToNext}>
            <SkipForward className="w-5 h-5" />
          </Button>
          <div className="flex items-center gap-2">
            <Volume2 className="w-4 h-4" />
            <Slider
              value={[audioPlayer.state.volume * 100]}
              onValueChange={(value) => audioPlayer.setVolume(value[0] / 100)}
              max={100}
              step={1}
              className="w-20"
            />
          </div>
        </div>

        {/* Voting Section */}
        <div className="flex items-center justify-center gap-8 mb-8">
          <Button
            size="lg"
            variant="ghost"
            className="w-16 h-16 rounded-full bg-green-600/20 hover:bg-green-600/40 text-white"
            onClick={() => handleVote("up")}
            disabled={audioPlayer.state.hasVoted || audioPlayer.state.isLoading || needsUserInteraction}
          >
            <ThumbsUp className="w-8 h-8" />
          </Button>

          <div className="text-center">
            <div className="w-20 h-20 rounded-full bg-purple-600 flex items-center justify-center mb-2">
              <span className="text-3xl font-bold">{audioPlayer.state.isPlaying ? timeRemaining : "▶"}</span>
            </div>
            <span className="text-sm text-gray-400">
              {needsUserInteraction
                ? "press play"
                : audioPlayer.state.isPreview && !audioPlayer.state.hasVoted
                  ? "seconds"
                  : "remaining"}
            </span>
          </div>

          <Button
            size="lg"
            variant="ghost"
            className="w-16 h-16 rounded-full bg-red-600/20 hover:bg-red-600/40 text-white"
            onClick={() => handleVote("down")}
            disabled={audioPlayer.state.hasVoted || audioPlayer.state.isLoading || needsUserInteraction}
          >
            <ThumbsDown className="w-8 h-8" />
          </Button>
        </div>

        {/* Voting Status */}
        {audioPlayer.state.hasVoted && (
          <div className="text-center mb-4">
            {audioPlayer.state.isPreview ? (
              <p className="text-red-500">Skipped to next track</p>
            ) : (
              <p className="text-green-500">Playing full track!</p>
            )}
          </div>
        )}
      </div>
    )
  }

  // Keep the other view components the same...
  const DiscoverView = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-900 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="text-red-500 font-bold text-xl">W</span>
          <span className="text-yellow-500 font-bold text-xl">a</span>
          <span className="text-green-500 font-bold text-xl">x</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-white">
            <svg width="60" height="20" viewBox="0 0 60 20" className="fill-white">
              <path d="M5 15 L15 5 L25 10 L35 2 L45 8 L55 3" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <UserMenu onNavigateToProfile={() => setCurrentView("userProfile")} />
        </div>
      </div>

      {/* Search */}
      <div className="px-4 mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input placeholder="Search" className="pl-10 bg-gray-800 border-gray-700 text-white" />
        </div>
      </div>

      {/* Vinyl Records Header */}
      <div className="px-4 mb-4">
        <img
          src="/placeholder.svg?height=60&width=400"
          alt="Vinyl records"
          className="w-full h-16 object-cover rounded"
        />
      </div>

      {/* Tabs */}
      <div className="flex px-4 mb-4">
        <Button className="bg-blue-600 text-white px-6 py-2 rounded-l">NEW RELEASES</Button>
        <Button variant="outline" className="bg-orange-600 text-white px-6 py-2 rounded-r">
          SAVED
        </Button>
      </div>

      {/* Albums Grid */}
      <div className="flex-1 px-4 overflow-y-auto">
        <div className="grid grid-cols-3 gap-3">
          {mockAlbums.map((album, index) => (
            <div key={index} className="relative">
              <img
                src={album.artwork || "/placeholder.svg"}
                alt={album.title}
                className="w-full aspect-square object-cover rounded"
              />
              <div
                className={`absolute bottom-1 right-1 px-2 py-1 rounded text-xs font-bold ${getHeatColor(album.heatScore)}`}
              >
                {album.heatScore}°
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )

  const AlbumView = () => (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-900 to-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <span className="text-red-500 font-bold text-xl">W</span>
          <span className="text-yellow-500 font-bold text-xl">a</span>
          <span className="text-green-500 font-bold text-xl">x</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-white">
            <svg width="60" height="20" viewBox="0 0 60 20" className="fill-white">
              <path d="M5 15 L15 5 L25 10 L35 2 L45 8 L55 3" stroke="white" strokeWidth="2" fill="none" />
            </svg>
          </div>
          <UserMenu onNavigateToProfile={() => setCurrentView("userProfile")} />
        </div>
      </div>

      {/* Album Info */}
      <div className="flex items-center gap-4 p-4">
        <img src="/placeholder.svg?height=120&width=120" alt="BlackStar" className="w-24 h-24 rounded" />
        <div className="flex-1">
          <h2 className="text-xl font-bold">BlackStar</h2>
          <p className="text-gray-400">Mos Def & Talib Kweli</p>
          <p className="text-sm text-gray-500">13 songs</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-red-500 font-bold">110°</span>
            <Button size="sm" className="bg-purple-600">
              PROFILE
            </Button>
          </div>
        </div>
      </div>

      {/* Track List */}
      <div className="flex-1 px-4 overflow-y-auto">
        {mockAlbumTracks.map((track) => (
          <div key={track.id} className="flex items-center justify-between py-3 border-b border-gray-800">
            <div className="flex items-center gap-3">
              <span className="text-gray-400 w-6">{track.id}</span>
              <div>
                <p className="font-medium">{track.title}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`font-bold ${getHeatColor(track.heatScore)}`}>{track.heatScore}°</span>
              <span className="text-gray-400 text-sm">{track.duration}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  const ProfileView = () => {
    const displayName = currentUser?.displayName || currentUser?.email?.split("@")[0] || "User"

    return (
      <div className="flex flex-col h-full bg-gradient-to-b from-purple-900 to-black text-white">
        {/* Header */}
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <span className="text-red-500 font-bold text-xl">W</span>
            <span className="text-yellow-500 font-bold text-xl">a</span>
            <span className="text-green-500 font-bold text-xl">x</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-white">
              <svg width="60" height="20" viewBox="0 0 60 20" className="fill-white">
                <path d="M5 15 L15 5 L25 10 L35 2 L45 8 L55 3" stroke="white" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <UserMenu onNavigateToProfile={() => setCurrentView("userProfile")} />
          </div>
        </div>

        {/* Profile Header */}
        <div className="text-center p-6">
          <Avatar className="w-24 h-24 mx-auto mb-4">
            <AvatarImage src={currentUser?.photoURL || ""} />
            <AvatarFallback className="bg-purple-600 text-white text-xl">
              {displayName
                .split(" ")
                .map((name) => name[0])
                .join("")
                .toUpperCase()
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold mb-4">{displayName}</h2>

          {/* Stats */}
          <div className="flex justify-center gap-8 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold">17</div>
              <div className="text-xs text-gray-400">PLAYLISTS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">11</div>
              <div className="text-xs text-gray-400">FOLLOWERS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold">27</div>
              <div className="text-xs text-gray-400">FOLLOWING</div>
            </div>
          </div>
        </div>

        {/* Recently Played */}
        <div className="flex-1 px-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-300">RECENTLY PLAYED ARTISTS</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-800/50 rounded">
              <div className="flex items-center gap-3">
                <img src="/placeholder.svg?height=40&width=40" alt="Moving Mountains" className="w-10 h-10 rounded" />
                <div>
                  <p className="font-medium">Moving Mountains</p>
                  <p className="text-sm text-gray-400">8,394 FOLLOWERS</p>
                </div>
              </div>
              <Button size="sm" variant="ghost" className="rounded-full">
                <Play className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-800">
            <Button
              variant="outline"
              size="sm"
              onClick={resetOnboarding}
              className="w-full text-gray-400 border-gray-700 hover:text-white hover:border-gray-600"
            >
              Show Tutorial Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case "radio":
        return <RadioPlayer />
      case "discover":
        return <DiscoverView />
      case "album":
        return <AlbumView />
      case "profile":
        return <ProfileView />
      case "userProfile":
        return <ProfileScreen onBack={() => setCurrentView("profile")} />
      default:
        return <RadioPlayer />
    }
  }

  if (isLoading) {
    return (
      <div className="max-w-sm mx-auto h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white">Loading WaxRadio...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-sm mx-auto h-screen bg-black flex flex-col">
      {/* Demo Mode Indicator */}
      <DemoModeIndicator />

      {/* Main Content */}
      <div className="flex-1">{renderCurrentView()}</div>

      {/* Bottom Navigation */}
      <div className="flex justify-around items-center p-4 bg-black border-t border-gray-800">
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center gap-1 ${currentView === "discover" ? "text-blue-500" : "text-gray-400"}`}
          onClick={() => setCurrentView("discover")}
        >
          <Home className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center gap-1 ${currentView === "profile" ? "text-blue-500" : "text-gray-400"}`}
          onClick={() => setCurrentView("profile")}
        >
          <User className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={`flex flex-col items-center gap-1 ${currentView === "radio" ? "text-blue-500" : "text-gray-400"}`}
          onClick={() => setCurrentView("radio")}
        >
          <Radio className="w-5 h-5" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="flex flex-col items-center gap-1 text-gray-400"
          onClick={() => setCurrentView("album")}
        >
          <MessageSquare className="w-5 h-5" />
        </Button>
        <Button variant="ghost" size="sm" className="flex flex-col items-center gap-1 text-gray-400">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
      {/* Onboarding Tutorial */}
      <OnboardingTutorial isOpen={showOnboarding} onComplete={completeOnboarding} />
    </div>
  )
}

// Update the main app component to use conditional rendering based on auth state
function WaxRadioApp() {
  const { isAuthenticated, isArtist, loading, needsOnboarding } = useAuth()
  const [showWelcome, setShowWelcome] = useState(false)
  const [onboardingStep, setOnboardingStep] = useState<"role" | "profile" | "complete">("role")
  const [selectedRole, setSelectedRole] = useState<"fan" | "artist" | null>(null)
  const [currentAppView, setCurrentAppView] = useState<"radio" | "dashboard">("radio")

  const handleNavigateToRadio = () => {
    setCurrentAppView("radio")
  }

  const handleNavigateToDashboard = () => {
    setCurrentAppView("dashboard")
  }

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="max-w-sm mx-auto h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <div className="text-white">Loading WaxRadio...</div>
        </div>
      </div>
    )
  }

  // Show welcome screen for unauthenticated users
  if (!isAuthenticated) {
    if (showWelcome) {
      return <AuthScreen />
    }
    return <WelcomeScreen onGetStarted={() => setShowWelcome(true)} />
  }

  // Show onboarding flow for new users
  if (needsOnboarding) {
    if (onboardingStep === "role") {
      return (
        <RoleSelectionScreen
          onRoleSelect={(role) => {
            setSelectedRole(role)
            setOnboardingStep("profile")
          }}
        />
      )
    }

    if (onboardingStep === "profile" && selectedRole) {
      return <ProfileSetupScreen userRole={selectedRole} onComplete={() => setOnboardingStep("complete")} />
    }
  }

  // Show appropriate dashboard based on user role
  if (isArtist) {
    if (currentAppView === "dashboard") {
      return <ArtistDashboard onNavigateToRadio={handleNavigateToRadio} />
    } else {
      return <WaxRadioAppContent onNavigateToDashboard={handleNavigateToDashboard} />
    }
  } else {
    if (currentAppView === "dashboard") {
      return <FanDashboard onNavigateToRadio={handleNavigateToRadio} />
    } else {
      return <WaxRadioAppContent onNavigateToDashboard={handleNavigateToDashboard} />
    }
  }
}

// Wrap the main component with ProtectedRoute for additional security
function AppWrapper() {
  return (
    <ProtectedRoute>
      <WaxRadioApp />
    </ProtectedRoute>
  )
}

export default AppWrapper
