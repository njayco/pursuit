"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, Headphones } from "lucide-react"

interface RoleSelectionScreenProps {
  onRoleSelect: (role: "fan" | "artist") => void
}

export function RoleSelectionScreen({ onRoleSelect }: RoleSelectionScreenProps) {
  const [selectedRole, setSelectedRole] = useState<"fan" | "artist" | null>(null)

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole)
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

      <div className="relative z-10 w-full max-w-md">
        <Card className="bg-gray-900/95 border-gray-700 text-white backdrop-blur-sm shadow-2xl">
          <CardHeader className="text-center pb-6">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-red-500 font-bold text-3xl">W</span>
              <span className="text-yellow-500 font-bold text-3xl">a</span>
              <span className="text-green-500 font-bold text-3xl">x</span>
              <span className="text-white font-light text-2xl italic">radio</span>
            </div>
            <CardTitle className="text-xl font-bold mb-2">Choose Your Role</CardTitle>
            <p className="text-gray-400 text-sm">How do you want to experience WaxRadio?</p>
          </CardHeader>

          <CardContent className="space-y-4">
            {/* Fan Option */}
            <div
              onClick={() => setSelectedRole("fan")}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRole === "fan"
                  ? "border-blue-500 bg-blue-600/20"
                  : "border-gray-600 bg-gray-800/30 hover:border-gray-500"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-blue-600/20 flex items-center justify-center">
                  <Headphones className="w-6 h-6 text-blue-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Music Fan</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Discover new artists, vote on tracks, and build your music collection
                  </p>
                </div>
                {selectedRole === "fan" && (
                  <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded">Vote on tracks</span>
                <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded">Follow artists</span>
                <span className="px-2 py-1 bg-blue-600/20 text-blue-300 text-xs rounded">Create playlists</span>
              </div>
            </div>

            {/* Artist Option */}
            <div
              onClick={() => setSelectedRole("artist")}
              className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRole === "artist"
                  ? "border-purple-500 bg-purple-600/20"
                  : "border-gray-600 bg-gray-800/30 hover:border-gray-500"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-purple-600/20 flex items-center justify-center">
                  <Crown className="w-6 h-6 text-purple-500" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-lg">Artist</h3>
                  <p className="text-sm text-gray-400 mt-1">
                    Upload your music, build your fanbase, and track your heat scores
                  </p>
                </div>
                {selectedRole === "artist" && (
                  <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded">Upload tracks</span>
                <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded">Build fanbase</span>
                <span className="px-2 py-1 bg-purple-600/20 text-purple-300 text-xs rounded">Track analytics</span>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!selectedRole}
              className="w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white font-bold py-3 text-lg hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              Continue
            </Button>

            <p className="text-xs text-gray-500 text-center mt-4">You can change your role later in settings</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
