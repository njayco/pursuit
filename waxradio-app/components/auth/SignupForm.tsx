"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react"

interface SignupFormProps {
  onToggleMode: () => void
}

export function SignupForm({ onToggleMode }: SignupFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [displayName, setDisplayName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { signup } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    // Validation
    if (!email || !password || !confirmPassword) {
      setError("Please fill in all required fields")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters long")
      return
    }

    if (displayName.trim().length < 2) {
      setError("Display name must be at least 2 characters long")
      return
    }

    try {
      setError("")
      setLoading(true)
      await signup(email, password, displayName.trim())
    } catch (error: any) {
      console.error("Signup error:", error)

      // Handle specific Firebase auth errors
      switch (error.code) {
        case "auth/email-already-in-use":
          setError("An account with this email already exists")
          break
        case "auth/invalid-email":
          setError("Invalid email address")
          break
        case "auth/operation-not-allowed":
          setError("Email/password accounts are not enabled")
          break
        case "auth/weak-password":
          setError("Password is too weak. Please choose a stronger password")
          break
        case "auth/network-request-failed":
          setError("Network error. Please check your connection")
          break
        default:
          setError("Failed to create account. Please try again")
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md bg-gray-900/95 border-gray-700 text-white backdrop-blur-sm shadow-2xl">
      <CardHeader className="text-center pb-4">
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-red-500 font-bold text-2xl">W</span>
          <span className="text-yellow-500 font-bold text-2xl">a</span>
          <span className="text-green-500 font-bold text-2xl">x</span>
          <span className="text-white font-light text-xl italic">radio</span>
        </div>
        <CardTitle className="text-gray-200 text-lg font-medium">Create your account</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {error && (
          <div className="p-3 bg-red-600/20 border border-red-600/50 rounded-lg text-center text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="displayName" className="block text-sm font-medium text-gray-300">
              Display Name *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="displayName"
                type="text"
                placeholder="Enter your display name"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                required
                disabled={loading}
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={loading}
                className="pl-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password (min. 6 characters)"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={loading}
                className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white h-auto p-1"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
              Confirm Password *
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                disabled={loading}
                className="pl-10 pr-10 bg-gray-800/50 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500/20"
              />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={loading}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white h-auto p-1"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200 font-medium py-2.5 transition-colors"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Creating Account...
              </div>
            ) : (
              "Sign Up"
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-400">
          Already have an account?{" "}
          <button
            onClick={onToggleMode}
            disabled={loading}
            className="text-white hover:text-blue-400 font-medium transition-colors disabled:opacity-50"
          >
            Sign in
          </button>
        </div>

        {/* Demo Account Helper */}
        <div className="mt-4 p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg text-center">
          <p className="text-xs text-blue-300 mb-2">For testing, you can create any account with:</p>
          <div className="text-xs text-gray-400">Any email format and password (min. 6 characters)</div>
        </div>
      </CardContent>
    </Card>
  )
}
