"use client"

import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  sendPasswordResetEmail,
  sendEmailVerification,
  type User,
} from "firebase/auth"
import { auth } from "@/lib/firebase"
import { firestoreUtils } from "@/lib/firebase-utils"
import { COLLECTIONS, type UserDocument } from "@/lib/firebase-collections"

class AuthServiceClass {
  // Sign up with email and password
  async signUp(email: string, password: string, displayName: string) {
    if (!auth) {
      throw new Error("Firebase Auth not available")
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    const user = userCredential.user

    // Update profile
    await updateProfile(user, { displayName })

    // Create user document in Firestore (completely non-blocking)
    this.createUserDocument(user, { displayName }).catch(() => {
      // Silently ignore - not critical for auth flow
    })

    // Send email verification (completely non-blocking)
    sendEmailVerification(user).catch(() => {
      // Silently ignore - not critical for auth flow
    })

    return user
  }

  // Sign in with email and password
  async signIn(email: string, password: string) {
    if (!auth) {
      throw new Error("Firebase Auth not available")
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  }

  // Sign out
  async signOut() {
    if (!auth) {
      throw new Error("Firebase Auth not available")
    }

    await signOut(auth)
  }

  // Send password reset email
  async resetPassword(email: string) {
    if (!auth) {
      throw new Error("Firebase Auth not available")
    }

    await sendPasswordResetEmail(auth, email)
  }

  // Create user document in Firestore
  async createUserDocument(user: User, additionalData: Partial<UserDocument> = {}) {
    const userData: Partial<UserDocument> = {
      email: user.email!,
      displayName: user.displayName || additionalData.displayName || "",
      photoURL: user.photoURL || "",
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
      ...additionalData,
    }

    try {
      await firestoreUtils.setDocument(COLLECTIONS.USERS, user.uid, userData)
      return userData
    } catch (error: any) {
      // Don't throw error, just return the data for local use
      console.debug("Could not create user document in Firestore:", error.message)
      return userData
    }
  }

  // Update user profile - improved to handle partial updates safely
  async updateUserProfile(userId: string, data: Partial<UserDocument>) {
    try {
      // Filter out undefined values and auth-related fields that shouldn't be updated
      const filteredData = Object.entries(data).reduce(
        (acc, [key, value]) => {
          if (value !== undefined && value !== null) {
            // Skip updating displayName if it's already set in Firebase Auth
            if (key === "displayName" && auth?.currentUser?.displayName) {
              console.debug("Skipping displayName update - already set in Firebase Auth")
              return acc
            }
            acc[key] = value
          }
          return acc
        },
        {} as Record<string, any>,
      )

      console.debug("Updating user profile with filtered data:", filteredData)
      await firestoreUtils.updateDocument(COLLECTIONS.USERS, userId, filteredData)
    } catch (error: any) {
      console.debug("Could not update user profile in Firestore:", error.message)
      // Re-throw the error so calling code can handle it appropriately
      throw error
    }
  }

  // Get user document
  async getUserDocument(userId: string): Promise<UserDocument | null> {
    try {
      return (await firestoreUtils.getDocument(COLLECTIONS.USERS, userId)) as UserDocument | null
    } catch (error: any) {
      console.debug("Could not fetch user document from Firestore:", error.message)
      return null
    }
  }

  // Update last active timestamp - completely non-blocking and error-tolerant
  updateLastActive(userId: string): void {
    // Fire-and-forget - don't return a promise or await anything
    if (!firestoreUtils || !userId) {
      return
    }

    // Use setTimeout to make this completely asynchronous and non-blocking
    setTimeout(() => {
      firestoreUtils
        .updateDocument(COLLECTIONS.USERS, userId, {
          lastActive: new Date(),
        })
        .catch(() => {
          // Completely silent - this is not critical functionality
        })
    }, 0)
  }
}

// Create and export a singleton instance
export const AuthService = new AuthServiceClass()

// Also export as default
export default AuthService
