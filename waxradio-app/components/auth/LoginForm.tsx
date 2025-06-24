"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/contexts/AuthContext"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"

interface LoginFormProps {
  onToggleMode: () => void
}

export function LoginForm({ onToggleMode }: LoginFormProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const { login } = useAuth()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!email || !password) {
      setError("Please fill in all fields")
      return
    }

    try {
      setError("")
      setLoading(true)
      await login(email, password)
    } catch (error: any) {
      console.error("Login error:", error)

      // Handle specific Firebase auth errors
      switch (error.code) {
        case "auth/user-not-found":
          setError("No account found with this email address")
          break
        case "auth/wrong-password":
          setError("Incorrect password")
          break
        case "auth/invalid-email":
          setError("Invalid email address")
          break
        case "auth/user-disabled":
          setError("This account has been disabled")
          break
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later")
          break
        case "auth/network-request-failed":
          setError("Network error. Please check your connection")
          break
        case "auth/invalid-credential":
          setError("Invalid email or password")
          break
        default:
          setError("Failed to sign in. Please check your credentials")
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
        <CardTitle className="text-gray-200 text-lg font-medium">Sign in to your account to continue</CardTitle>
      </CardHeader>

      <CardContent className="space-y-5">
        {error && (
          <div className="p-3 bg-red-600/20 border border-red-600/50 rounded-lg text-center text-sm text-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
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
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
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

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black hover:bg-gray-200 font-medium py-2.5 transition-colors"
          >
            {loading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <div className="text-center text-sm text-gray-400">
          {"Don't have an account? "}
          <button
            onClick={onToggleMode}
            disabled={loading}
            className="text-white hover:text-blue-400 font-medium transition-colors disabled:opacity-50"
          >
            Sign up
          </button>
        </div>

        {/* Demo Account Helper */}
        <div className="mt-4 p-3 bg-blue-600/10 border border-blue-600/30 rounded-lg text-center">
          <p className="text-xs text-blue-300 mb-2">Demo Account (for testing):</p>
          <div className="text-xs text-gray-400 space-y-1">
            <div>Email: demo@waxradio.com</div>
            <div>Password: demo123</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
