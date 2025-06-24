"use client"

import { useState, useEffect } from "react"
import { firestoreUtils, queryConstraints } from "@/lib/firebase-utils"
import type { QueryConstraint } from "firebase/firestore"

// Generic hook for Firestore documents
export function useDocument<T>(collectionName: string, docId: string | null) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!docId) {
      setData(null)
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)

    const unsubscribe = firestoreUtils.subscribeToDocument(collectionName, docId, (docData) => {
      setData(docData as T)
      setLoading(false)
    })

    return unsubscribe
  }, [collectionName, docId])

  return { data, loading, error }
}

// Generic hook for Firestore collections
export function useCollection<T>(collectionName: string, constraints: QueryConstraint[] = []) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    setError(null)

    const unsubscribe = firestoreUtils.subscribeToCollection(
      collectionName,
      (collectionData) => {
        setData(collectionData as T[])
        setLoading(false)
      },
      constraints,
    )

    return unsubscribe
  }, [collectionName, JSON.stringify(constraints)])

  return { data, loading, error }
}

// Hook for tracks with filtering
export function useTracks(
  options: {
    genre?: string
    limit?: number
    orderBy?: "heatScore" | "uploadedAt" | "plays"
    orderDirection?: "asc" | "desc"
  } = {},
) {
  const constraints = []

  if (options.genre) {
    constraints.push(queryConstraints.whereEqual("genre", options.genre))
  }

  if (options.orderBy) {
    const direction = options.orderDirection || "desc"
    constraints.push(
      direction === "desc"
        ? queryConstraints.orderByDesc(options.orderBy)
        : queryConstraints.orderByAsc(options.orderBy),
    )
  }

  if (options.limit) {
    constraints.push(queryConstraints.limitTo(options.limit))
  }

  return useCollection("tracks", constraints)
}

// Hook for user's votes
export function useUserVotes(userId: string | null) {
  const constraints = userId ? [queryConstraints.whereEqual("userId", userId)] : []
  return useCollection("votes", constraints)
}
