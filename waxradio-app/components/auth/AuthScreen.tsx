"use client"

import { useState } from "react"
import { LoginForm } from "./LoginForm"
import { SignupForm } from "./SignupForm"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"

export function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true)
  const { isFirebaseAvailable } = useAuth()

  // Demo mode when Firebase is not available
  if (!isFirebaseAvailable) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        {/* Animated background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,0,0.1),transparent_50%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,255,0,0.1),transparent_50%)]"></div>
        </div>

        {/* Header */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-red-500 font-bold text-4xl">W</span>
            <span className="text-yellow-500 font-bold text-4xl">a</span>
            <span className="text-green-500 font-bold text-4xl">x</span>
            <span className="text-white font-light text-3xl italic">radio</span>
          </div>
          <p className="text-gray-400 text-lg">Discover and share music with the community</p>
        </div>

        {/* Demo Mode Notice */}
        <div className="relative z-10 max-w-md">
          <div className="bg-gray-900/95 border border-gray-700 text-white backdrop-blur-sm rounded-lg p-8 text-center shadow-2xl">
            <div className="w-16 h-16 bg-yellow-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2 className="text-xl font-bold mb-4">Demo Mode</h2>
            <p className="text-gray-300 mb-6 leading-relaxed">
              Firebase configuration is not available. The app is running in demo mode with limited functionality.
            </p>
            <p className="text-sm text-gray-400 mb-6">
              To enable full functionality, please configure your Firebase environment variables.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full bg-white text-black hover:bg-gray-200 font-medium py-2.5"
            >
              Continue in Demo Mode
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      {/* Animated background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,0,0,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,0,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(0,255,0,0.1),transparent_50%)]"></div>
      </div>

      {/* Header */}
      <div className="absolute top-8 left-1/2 transform -translate-x-1/2 text-center z-10">
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-red-500 font-bold text-4xl">W</span>
          <span className="text-yellow-500 font-bold text-4xl">a</span>
          <span className="text-green-500 font-bold text-4xl">x</span>
          <span className="text-white font-light text-3xl italic">radio</span>
        </div>
        <p className="text-gray-400 text-lg">Discover and share music with the community</p>
      </div>

      {/* Auth Form */}
      <div className="relative z-10 w-full max-w-md">
        {isLogin ? (
          <LoginForm onToggleMode={() => setIsLogin(false)} />
        ) : (
          <SignupForm onToggleMode={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}
