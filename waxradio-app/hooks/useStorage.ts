"use client"

import { useState } from "react"
import { StorageService } from "@/services/storage.service"

interface UploadState {
  progress: number
  isUploading: boolean
  error: string | null
  downloadURL: string | null
}

export function useFileUpload() {
  const [uploadState, setUploadState] = useState<UploadState>({
    progress: 0,
    isUploading: false,
    error: null,
    downloadURL: null,
  })

  const uploadFile = async (file: File, path: string): Promise<string> => {
    setUploadState({
      progress: 0,
      isUploading: true,
      error: null,
      downloadURL: null,
    })

    try {
      const uploadTask = StorageService.uploadWithProgress(file, path)

      return new Promise((resolve, reject) => {
        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            setUploadState((prev) => ({ ...prev, progress }))
          },
          (error) => {
            setUploadState((prev) => ({
              ...prev,
              isUploading: false,
              error: error.message,
            }))
            reject(error)
          },
          async () => {
            try {
              const downloadURL = await uploadTask.snapshot.ref.getDownloadURL()
              setUploadState({
                progress: 100,
                isUploading: false,
                error: null,
                downloadURL,
              })
              resolve(downloadURL)
            } catch (error: any) {
              setUploadState((prev) => ({
                ...prev,
                isUploading: false,
                error: error.message,
              }))
              reject(error)
            }
          },
        )
      })
    } catch (error: any) {
      setUploadState({
        progress: 0,
        isUploading: false,
        error: error.message,
        downloadURL: null,
      })
      throw error
    }
  }

  const reset = () => {
    setUploadState({
      progress: 0,
      isUploading: false,
      error: null,
      downloadURL: null,
    })
  }

  return {
    ...uploadState,
    uploadFile,
    reset,
  }
}
