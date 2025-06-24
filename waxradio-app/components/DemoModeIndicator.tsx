"use client"

import { useAuth } from "@/contexts/AuthContext"
import { AlertTriangle, Info } from "lucide-react"

export function DemoModeIndicator() {
  const { isFirebaseAvailable, isGoogleAuthAvailable } = useAuth()

  if (!isFirebaseAvailable) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-yellow-600/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm backdrop-blur-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>Demo Mode - Firebase not configured</span>
        </div>
      </div>
    )
  }

  if (isFirebaseAvailable && !isGoogleAuthAvailable) {
    return (
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
        <div className="bg-blue-600/90 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm backdrop-blur-sm">
          <Info className="w-4 h-4" />
          <span>Preview Mode - Google sign-in disabled</span>
        </div>
      </div>
    )
  }

  return null
}
