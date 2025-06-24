"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { type User, onAuthStateChanged } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { AuthService } from "@/services/auth.service"
import type { UserDocument } from "@/lib/firebase-collections"

// Update the AuthContextType interface to include user role information
interface AuthContextType {
  currentUser: User | null
  userProfile: UserDocument | null
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, displayName?: string) => Promise<void>
  logout: () => Promise<void>
  resetPassword: (email: string) => Promise<void>
  updateUserProfile: (data: Partial<UserDocument>) => Promise<void>
  loading: boolean
  isFirebaseAvailable: boolean
  isArtist: boolean
  isAuthenticated: boolean
  needsOnboarding: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  // Add state for user profile and role management
  const [userProfile, setUserProfile] = useState<UserDocument | null>(null)
  const [loading, setLoading] = useState(true)
  const [isFirebaseAvailable, setIsFirebaseAvailable] = useState(false)

  // Check if Google Auth is available based on domain
  // Update the useEffect to fetch user profile data
  useEffect(() => {
    // Check if Firebase is properly initialized
    if (!auth) {
      console.warn("Firebase Auth not available - running in demo mode")
      setIsFirebaseAvailable(false)
      setLoading(false)
      return
    }

    setIsFirebaseAvailable(true)

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user)

      if (user) {
        try {
          // Update user's last active timestamp (completely non-blocking)
          AuthService.updateLastActive(user.uid)

          // Fetch user profile from Firestore (with error handling)
          const profile = await AuthService.getUserDocument(user.uid)
          setUserProfile(profile)
        } catch (error) {
          console.debug("Error fetching user profile:", error)
          setUserProfile(null)
        }
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return unsubscribe
  }, [])

  // Check if user needs onboarding
  const needsOnboarding = currentUser && (!userProfile || !userProfile.bio || !userProfile.preferences?.genres?.length)

  async function signup(email: string, password: string, displayName?: string) {
    if (!auth) {
      throw new Error("Firebase Auth not available")
    }

    try {
      const user = await AuthService.signUp(email, password, displayName || "")
      return user
    } catch (error) {
      console.error("Signup error:", error)
      throw error
    }
  }

  async function login(email: string, password: string) {
    if (!auth) {
      throw new Error("Firebase Auth not available")
    }

    try {
      const user = await AuthService.signIn(email, password)
      return user
    } catch (error) {
      console.error("Login error:", error)
      throw error
    }
  }

  async function logout() {
    if (!auth) {
      throw new Error("Firebase Auth not available")
    }

    try {
      await AuthService.signOut()
    } catch (error) {
      console.error("Logout error:", error)
      throw error
    }
  }

  async function resetPassword(email: string) {
    if (!auth) {
      throw new Error("Firebase Auth not available")
    }

    try {
      await AuthService.resetPassword(email)
    } catch (error) {
      console.error("Password reset error:", error)
      throw error
    }
  }

  // Add updateUserProfile function with improved error handling
  async function updateUserProfile(data: Partial<UserDocument>) {
    if (!auth || !currentUser) {
      throw new Error("User not authenticated")
    }

    // If Firebase is not available, simulate success in demo mode
    if (!isFirebaseAvailable) {
      console.log("Demo mode: Profile update simulated", data)
      // Create a mock profile for demo mode
      const mockProfile: UserDocument = {
        id: currentUser.uid,
        email: currentUser.email || "",
        displayName: currentUser.displayName || "",
        photoURL: currentUser.photoURL || "",
        isArtist: false,
        isVerified: false,
        followers: 0,
        following: 0,
        totalVotes: 0,
        joinedAt: new Date(),
        lastActive: new Date(),
        preferences: {
          genres: [],
          notifications: {
            newFollowers: true,
            trackLikes: true,
            comments: true,
          },
        },
        stats: {
          tracksLiked: 0,
          tracksSkipped: 0,
          playlistsCreated: 0,
        },
        ...data,
      }
      setUserProfile(mockProfile)
      return
    }

    try {
      await AuthService.updateUserProfile(currentUser.uid, data)
      // Refresh user profile
      const updatedProfile = await AuthService.getUserDocument(currentUser.uid)
      setUserProfile(updatedProfile)
    } catch (error: any) {
      console.debug("Update profile error:", error)

      // Handle specific Firestore permission errors gracefully
      if (
        error.code === "permission-denied" ||
        error.message?.includes("insufficient permissions") ||
        error.message?.includes("Missing or insufficient permissions")
      ) {
        // In case of permission errors, create a local profile for demo purposes
        console.warn("Firestore permissions not configured, running in demo mode")
        const mockProfile: UserDocument = {
          id: currentUser.uid,
          email: currentUser.email || "",
          displayName: currentUser.displayName || "",
          photoURL: currentUser.photoURL || "",
          isArtist: false,
          isVerified: false,
          followers: 0,
          following: 0,
          totalVotes: 0,
          joinedAt: new Date(),
          lastActive: new Date(),
          preferences: {
            genres: [],
            notifications: {
              newFollowers: true,
              trackLikes: true,
              comments: true,
            },
          },
          stats: {
            tracksLiked: 0,
            tracksSkipped: 0,
            playlistsCreated: 0,
          },
          ...data,
        }
        setUserProfile(mockProfile)
        return
      }

      throw error
    }
  }

  // Update the value object to include new properties
  const value: AuthContextType = {
    currentUser,
    userProfile,
    login,
    signup,
    logout,
    resetPassword,
    updateUserProfile,
    loading,
    isFirebaseAvailable,
    isArtist: userProfile?.isArtist || false,
    isAuthenticated: !!currentUser,
    needsOnboarding: !!needsOnboarding,
  }

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>
}
