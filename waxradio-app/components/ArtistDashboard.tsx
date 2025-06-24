"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { UserMenu } from "./UserMenu"
import {
  Upload,
  Music,
  TrendingUp,
  Users,
  Play,
  BarChart3,
  Settings,
  Plus,
  FileAudio,
  ImageIcon,
  Radio,
} from "lucide-react"

interface ArtistDashboardProps {
  onNavigateToRadio: () => void
}

export function ArtistDashboard({ onNavigateToRadio }: ArtistDashboardProps) {
  const { currentUser, userProfile } = useAuth()
  const [activeTab, setActiveTab] = useState<"overview" | "upload" | "tracks" | "analytics">("overview")
  const [isUploading, setIsUploading] = useState(false)

  const mockStats = {
    totalTracks: 12,
    totalPlays: 8394,
    totalVotes: 1247,
    averageHeat: 87,
    followers: 156,
  }

  const mockTracks = [
    { id: 1, title: "Underground Anthem", heatScore: 94, plays: 1234, votes: 89 },
    { id: 2, title: "Street Dreams", heatScore: 87, plays: 987, votes: 67 },
    { id: 3, title: "City Lights", heatScore: 91, plays: 1456, votes: 102 },
  ]

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsUploading(true)
    // Simulate upload process
    setTimeout(() => {
      setIsUploading(false)
      alert("Track uploaded successfully!")
    }, 2000)
  }

  const OverviewTab = () => (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <Music className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{mockStats.totalTracks}</div>
            <div className="text-sm text-gray-400">Tracks</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <Play className="w-8 h-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{mockStats.totalPlays.toLocaleString()}</div>
            <div className="text-sm text-gray-400">Total Plays</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-8 h-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{mockStats.averageHeat}°</div>
            <div className="text-sm text-gray-400">Avg Heat</div>
          </CardContent>
        </Card>

        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-white">{mockStats.followers}</div>
            <div className="text-sm text-gray-400">Followers</div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-gray-800/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-300">Your track "Underground Anthem" reached 95° heat!</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-300">New follower: @musiclover23</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-700/30 rounded">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-300">"Street Dreams" got 50 new votes today</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const UploadTab = () => (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <Upload className="w-5 h-5" />
          Upload New Track
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Track Title *</label>
            <Input
              placeholder="Enter track title"
              required
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
            <Textarea
              placeholder="Tell fans about your track..."
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 resize-none"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Genre</label>
            <Input
              placeholder="e.g., Hip-Hop, R&B, Pop"
              className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Audio File *</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-500 transition-colors">
                <FileAudio className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Drop audio file or click to browse</p>
                <input type="file" accept="audio/*" className="hidden" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Artwork</label>
              <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center hover:border-gray-500 transition-colors">
                <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-400">Drop image or click to browse</p>
                <input type="file" accept="image/*" className="hidden" />
              </div>
            </div>
          </div>

          <Button
            type="submit"
            disabled={isUploading}
            className="w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white font-medium"
          >
            {isUploading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Uploading...
              </div>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Track
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )

  const TracksTab = () => (
    <div className="space-y-4">
      {mockTracks.map((track) => (
        <Card key={track.id} className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gray-700 rounded flex items-center justify-center">
                  <Music className="w-6 h-6 text-gray-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">{track.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-gray-400">
                    <span>{track.plays} plays</span>
                    <span>{track.votes} votes</span>
                    <span className="text-orange-500 font-medium">{track.heatScore}°</span>
                  </div>
                </div>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const AnalyticsTab = () => (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Analytics
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-center py-8">
          <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <p className="text-gray-400">Analytics dashboard coming soon!</p>
          <p className="text-sm text-gray-500 mt-2">Track your performance and audience insights</p>
        </div>
      </CardContent>
    </Card>
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
      <div className="p-4 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-gray-800">
        <h1 className="text-lg font-bold">Welcome back, {userProfile?.displayName || currentUser?.displayName}!</h1>
        <p className="text-sm text-gray-400">Manage your tracks and grow your fanbase</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-gray-800">
        {[
          { id: "overview", label: "Overview", icon: BarChart3 },
          { id: "upload", label: "Upload", icon: Plus },
          { id: "tracks", label: "Tracks", icon: Music },
          { id: "radio", label: "Radio", icon: Radio },
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
        {activeTab === "upload" && <UploadTab />}
        {activeTab === "tracks" && <TracksTab />}
        {activeTab === "analytics" && <AnalyticsTab />}
      </div>
    </div>
  )
}
