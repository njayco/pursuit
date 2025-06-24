"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import { LogOut, User, Settings, Mail } from "lucide-react"

interface UserMenuProps {
  onNavigateToProfile?: () => void
}

export function UserMenu({ onNavigateToProfile }: UserMenuProps) {
  const { currentUser, logout, isFirebaseAvailable } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true)
      await logout()
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoggingOut(false)
    }
  }

  // Don't show menu if Firebase is not available or user is not logged in
  if (!isFirebaseAvailable || !currentUser) return null

  const displayName = currentUser.displayName || currentUser.email?.split("@")[0] || "User"
  const initials = displayName
    .split(" ")
    .map((name) => name[0])
    .join("")
    .toUpperCase()
    .slice(0, 2)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-gray-800/50">
          <Avatar className="h-10 w-10 border-2 border-gray-600">
            <AvatarImage src={currentUser.photoURL || ""} alt={displayName} />
            <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white text-sm font-medium">
              {initials}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 bg-gray-900/95 border-gray-700 text-white backdrop-blur-sm shadow-xl"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="font-normal p-4">
          <div className="flex flex-col space-y-2">
            <div className="flex items-center space-x-3">
              <Avatar className="h-12 w-12 border-2 border-gray-600">
                <AvatarImage src={currentUser.photoURL || ""} alt={displayName} />
                <AvatarFallback className="bg-gradient-to-br from-purple-600 to-blue-600 text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium leading-none text-white">{displayName}</p>
                <p className="text-xs leading-none text-gray-400 mt-1 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {currentUser.email}
                </p>
              </div>
            </div>
            {!currentUser.emailVerified && (
              <div className="text-xs text-yellow-400 bg-yellow-400/10 px-2 py-1 rounded">Email not verified</div>
            )}
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem
          className="hover:bg-gray-800/50 focus:bg-gray-800/50 cursor-pointer p-3"
          onClick={() => onNavigateToProfile?.()}
        >
          <User className="mr-3 h-4 w-4" />
          <span>Profile</span>
        </DropdownMenuItem>

        <DropdownMenuItem className="hover:bg-gray-800/50 focus:bg-gray-800/50 cursor-pointer p-3">
          <Settings className="mr-3 h-4 w-4" />
          <span>Settings</span>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem
          className="hover:bg-red-600/20 focus:bg-red-600/20 text-red-400 cursor-pointer p-3"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="mr-3 h-4 w-4" />
          <span>{isLoggingOut ? "Signing out..." : "Sign out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
