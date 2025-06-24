"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { ThumbsUp, ThumbsDown, Play, Pause, MessageSquare, Heart, SkipForward, Volume2 } from "lucide-react"
import { useAudioPlayer, type Track } from "@/hooks/useAudioPlayer"
import { useAuth } from "@/contexts/AuthContext"

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

interface RadioPlayerProps {
  onNavigate: (view: string) => void
}

export function RadioPlayer({ onNavigate }: RadioPlayerProps) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0)
  const audioPlayer = useAudioPlayer()
  const { isAuthenticated } = useAuth()

  // Auto-load first track on mount
  useEffect(() => {
    if (mockTracks.length > 0 && isAuthenticated) {
      audioPlayer.loadTrack(mockTracks[0], true)
    }
  }, [isAuthenticated])

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
    if (!isAuthenticated) return

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
    if (!isAuthenticated) return

    const nextIndex = (currentTrackIndex + 1) % mockTracks.length
    setCurrentTrackIndex(nextIndex)
    audioPlayer.loadTrack(mockTracks[nextIndex], true)
  }

  // Show login prompt if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col h-full bg-black text-white items-center justify-center p-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-red-500 font-bold text-3xl">W</span>
            <span className="text-yellow-500 font-bold text-3xl">a</span>
            <span className="text-green-500 font-bold text-3xl">x</span>
            <span className="text-white font-light text-2xl italic">radio</span>
          </div>
          <h2 className="text-xl font-bold mb-2">Ready to discover?</h2>
          <p className="text-gray-400">Sign in to start listening to underground music</p>
        </div>
        <Button
          onClick={() => onNavigate("auth")}
          className="bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white font-bold px-8 py-3"
        >
          Get Started
        </Button>
      </div>
    )
  }

  const currentTrack = audioPlayer.currentTrack || mockTracks[currentTrackIndex]
  const timeRemaining = audioPlayer.getTimeRemaining()
  const needsUserInteraction = !audioPlayer.state.isPlaying && audioPlayer.state.currentTime === 0

  return (
    <div className="flex flex-col h-full bg-black text-white relative overflow-hidden">
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
