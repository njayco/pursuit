"use client"

import type React from "react"

import { useAuth } from "@/contexts/AuthContext"
import { AuthScreen } from "./AuthScreen"

interface ProtectedRouteProps {
  children: React.ReactNode
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { currentUser, isFirebaseAvailable } = useAuth()

  // Allow access in demo mode or when user is authenticated
  if (!isFirebaseAvailable || currentUser) {
    return <>{children}</>
  }

  return <AuthScreen />
}
