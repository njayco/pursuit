"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Play, Music, Users, TrendingUp, Headphones } from "lucide-react"

interface WelcomeScreenProps {
  onGetStarted: () => void
}

export function WelcomeScreen({ onGetStarted }: WelcomeScreenProps) {
  const [currentFeature, setCurrentFeature] = useState(0)

  const features = [
    {
      icon: <Headphones className="w-12 h-12 text-red-500" />,
      title: "30-Second Previews",
      description: "Discover new underground artists with quick 30-second previews before deciding to hear more.",
    },
    {
      icon: <TrendingUp className="w-12 h-12 text-yellow-500" />,
      title: "Heat Scoring",
      description: "Watch tracks rise from 30° to 110° as the community votes and the heat builds.",
    },
    {
      icon: <Users className="w-12 h-12 text-green-500" />,
      title: "Community Driven",
      description: "Your votes decide what's hot. Help underground artists get the recognition they deserve.",
    },
    {
      icon: <Music className="w-12 h-12 text-purple-500" />,
      title: "Artist Platform",
      description: "Artists can upload their tracks and build their fanbase through community engagement.",
    },
  ]

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 text-white">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,0,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,255,0,0.1),transparent_50%)]"></div>
      </div>

      <div className="relative z-10 max-w-md w-full">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-red-500 font-bold text-5xl">W</span>
            <span className="text-yellow-500 font-bold text-5xl">a</span>
            <span className="text-green-500 font-bold text-5xl">x</span>
            <span className="text-white font-light text-4xl italic">radio</span>
          </div>
          <p className="text-gray-400 text-lg">Heat rises. Let the streets decide.</p>
        </div>

        {/* Feature Showcase */}
        <Card className="bg-gray-900/90 border-gray-700 mb-8 backdrop-blur-sm">
          <CardContent className="p-6 text-center">
            <div className="mb-4">{features[currentFeature].icon}</div>
            <h3 className="text-xl font-bold mb-2 text-white">{features[currentFeature].title}</h3>
            <p className="text-gray-300 leading-relaxed">{features[currentFeature].description}</p>
          </CardContent>
        </Card>

        {/* Feature Dots */}
        <div className="flex justify-center gap-2 mb-8">
          {features.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentFeature(index)}
              className={`w-3 h-3 rounded-full transition-colors ${
                index === currentFeature ? "bg-white" : "bg-gray-600"
              }`}
            />
          ))}
        </div>

        {/* CTA Button */}
        <Button
          onClick={onGetStarted}
          className="w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 text-white font-bold py-4 text-lg hover:opacity-90 transition-opacity"
        >
          <Play className="w-5 h-5 mr-2" />
          Get Started
        </Button>

        {/* Features List */}
        <div className="mt-8 space-y-3">
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span>Discover underground artists</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span>Vote on your favorite tracks</span>
          </div>
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span>Help artists build their fanbase</span>
          </div>
        </div>
      </div>
    </div>
  )
}
