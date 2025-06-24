"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { UserMenu } from "./UserMenu"
import { Heart, Music, TrendingUp, Users, Radio, User, Crown, Play } from "lucide-react"

interface FanDashboardProps {
  onNavigateToRadio: () => void
}

export function FanDashboard({ onNavigateToRadio }: FanDashboardProps) {
  const { currentUser, userProfile } = useAuth()
  const [activeTab, setActiveTab] = useState<"overview" | "liked" | "following" | "playlists">("overview")

  const mockStats = {
    tracksLiked: 47,
    artistsFollowing: 23,
    playlistsCreated: 8,
    totalVotes: 156,
  }

  const mockLikedTracks = [
    { id: 1, title: "Underground Anthem", artist: "MC Flow", heatScore: 94 },
    { id: 2, title: "Street Dreams", artist: "Urban Poet", heatScore: 87 },
    { id: 3, title: "City Lights", artist: "Night Rider", heatScore: 91 },
  ]

  const mockFollowingArtists = [
    { id: 1, name: "MC Flow", followers: 1234, isVerified: true },
    { id: 2, name: "Urban Poet", followers: 987, isVerified: false },
    { id: 3, name: "Night Rider", followers: 1456, isVerified: true },
  ]

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <Heart className="w-8 h-8 text-red-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{mockStats.tracksLiked}</div>
            <div className="text-sm text-gray-400">Liked Tracks</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{mockStats.artistsFollowing}</div>
            <div className="text-sm text-gray-400">Following</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <Music className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{mockStats.playlistsCreated}</div>
            <div className="text-sm text-gray-400">Playlists</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{mockStats.totalVotes}</div>
            <div className="text-sm text-gray-400">Total Votes</div>
          </CardContent>
        </Card>
      </div>

      {/* Upgrade to Artist */}
      <Card className="bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-purple-500/30">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <Crown className="w-6 h-6 text-yellow-500" />
            <h3 className="font-bold text-white">Become an Artist</h3>
          </div>
          <p className="text-sm text-gray-300 mb-4">
            Ready to share your music with the world? Upgrade to an artist account and start uploading your tracks!
          </p>
          <Button className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium">
            Upgrade Account
          </Button>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-300">You liked "Underground Anthem" by MC Flow</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300">You started following Urban Poet</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">You voted up "Street Dreams"</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const LikedTab = () => (
    <div className="space-y-4">
      {mockLikedTracks.map((track) => (
        <Card key={track.id} className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                  <Music className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{track.title}</h3>
                  <p className="text-sm text-gray-400">{track.artist}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-orange-500 font-medium">{track.heatScore}°</span>
                <Button variant="ghost" size="sm" className="text-red-500">
                  <Heart className="w-4 h-4 fill-current" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const FollowingTab = () => (
    <div className="space-y-4">
      {mockFollowingArtists.map((artist) => (
        <Card key={artist.id} className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-medium text-white">{artist.name}</h3>
                    {artist.isVerified && <Crown className="w-4 h-4 text-yellow-500" />}
                  </div>
                  <p className="text-sm text-gray-400">{artist.followers.toLocaleString()} followers</p>
                </div>
              </div>
              <Button variant="outline" size="sm" className="border-gray-600 text-gray-300">
                Following
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const PlaylistsTab = () => (
    <div className="text-center py-8">
      <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
      <p className="text-gray-400">No playlists yet</p>
      <p className="text-sm text-gray-500 mt-2">Create your first playlist to organize your favorite tracks</p>
      <Button className="mt-4 bg-blue-600 text-white">Create Playlist</Button>
    </div>
  )

  return (
    <div className="max-w-sm mx-auto h-screen bg-black flex flex-col text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-800">
        <div className="flex items-center gap-2">
          <span className="text-red-500 font-bold text-xl">W</span>
          <span className="text-yellow-500 font-bold text-xl">a</span>
          <span className="text-green-500 font-bold text-xl">x</span>
          <span className="text-white font-light text-lg italic">radio</span>
        </div>
        <UserMenu />
      </div>

      {/* Welcome Message */}
      <div className="p-4 bg-gradient-to-r from-blue-600/20 to-purple-600/20 border-b border-gray-800">
        <h1 className="text-lg font-bold">Hey {userProfile?.displayName || currentUser?.displayName}!</h1>
        <p className="text-sm text-gray-400">Discover new music and support your favorite artists</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800">
        {[
          { id: "overview", label: "Overview", icon: Radio },
          { id: "liked", label: "Liked", icon: Heart },
          { id: "following", label: "Artists", icon: Users },
          { id: "radio", label: "Radio", icon: Play },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => (tab.id === "radio" ? onNavigateToRadio() : setActiveTab(tab.id as any))}
            className={`flex-1 flex flex-col items-center gap-1 py-3 text-xs transition-colors ${
              activeTab === tab.id ? "text-white border-b-2 border-white" : "text-gray-400"
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {activeTab === "overview" && <OverviewTab />}
        {activeTab === "liked" && <LikedTab />}
        {activeTab === "following" && <FollowingTab />}
        {activeTab === "playlists" && <PlaylistsTab />}
      </div>
    </div>
  )
}
