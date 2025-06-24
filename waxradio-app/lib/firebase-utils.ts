import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  serverTimestamp,
  increment,
  arrayUnion,
  arrayRemove,
  type DocumentData,
  type QueryConstraint,
} from "firebase/firestore"
import { ref, uploadBytes, getDownloadURL, deleteObject, uploadBytesResumable, type UploadTask } from "firebase/storage"
import { db, storage } from "./firebase"

// Firestore utility functions
export const firestoreUtils = {
  // Create or update a document
  async setDocument(collectionName: string, docId: string, data: DocumentData) {
    if (!db) {
      console.debug("Firestore not available - running in demo mode")
      return null
    }
    try {
      const docRef = doc(db, collectionName, docId)
      await setDoc(docRef, { ...data, updatedAt: serverTimestamp() }, { merge: true })
      return docRef
    } catch (error: any) {
      console.debug("Firestore setDocument error:", error.message)
      throw error
    }
  },

  // Get a single document
  async getDocument(collectionName: string, docId: string) {
    if (!db) {
      console.debug("Firestore not available - running in demo mode")
      return null
    }
    try {
      const docRef = doc(db, collectionName, docId)
      const docSnap = await getDoc(docRef)
      return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null
    } catch (error: any) {
      console.debug("Firestore getDocument error:", error.message)
      throw error
    }
  },

  // Get multiple documents with optional constraints
  async getDocuments(collectionName: string, constraints: QueryConstraint[] = []) {
    if (!db) {
      console.debug("Firestore not available - running in demo mode")
      return []
    }
    try {
      const collectionRef = collection(db, collectionName)
      const q = query(collectionRef, ...constraints)
      const querySnapshot = await getDocs(q)
      return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
    } catch (error: any) {
      console.debug("Firestore getDocuments error:", error.message)
      throw error
    }
  },

  // Update a document
  async updateDocument(collectionName: string, docId: string, data: DocumentData) {
    if (!db) {
      console.debug("Firestore not available - running in demo mode")
      return null
    }
    try {
      const docRef = doc(db, collectionName, docId)
      await updateDoc(docRef, { ...data, updatedAt: serverTimestamp() })
      return docRef
    } catch (error: any) {
      console.debug("Firestore updateDocument error:", error.message)
      throw error
    }
  },

  // Delete a document
  async deleteDocument(collectionName: string, docId: string) {
    if (!db) {
      console.debug("Firestore not available - running in demo mode")
      return
    }
    try {
      const docRef = doc(db, collectionName, docId)
      await deleteDoc(docRef)
    } catch (error: any) {
      console.debug("Firestore deleteDocument error:", error.message)
      throw error
    }
  },

  // Listen to real-time updates
  subscribeToDocument(collectionName: string, docId: string, callback: (data: any) => void) {
    if (!db) {
      console.debug("Firestore not available - running in demo mode")
      return () => {}
    }
    try {
      const docRef = doc(db, collectionName, docId)
      return onSnapshot(
        docRef,
        (doc) => {
          if (doc.exists()) {
            callback({ id: doc.id, ...doc.data() })
          } else {
            callback(null)
          }
        },
        (error) => {
          console.debug("Firestore subscription error:", error.message)
          callback(null)
        },
      )
    } catch (error: any) {
      console.debug("Firestore subscribeToDocument error:", error.message)
      return () => {}
    }
  },

  // Listen to collection changes
  subscribeToCollection(collectionName: string, callback: (data: any[]) => void, constraints: QueryConstraint[] = []) {
    if (!db) {
      console.debug("Firestore not available - running in demo mode")
      return () => {}
    }
    try {
      const collectionRef = collection(db, collectionName)
      const q = query(collectionRef, ...constraints)
      return onSnapshot(
        q,
        (querySnapshot) => {
          const docs = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
          callback(docs)
        },
        (error) => {
          console.debug("Firestore collection subscription error:", error.message)
          callback([])
        },
      )
    } catch (error: any) {
      console.debug("Firestore subscribeToCollection error:", error.message)
      return () => {}
    }
  },

  // Increment a numeric field
  async incrementField(collectionName: string, docId: string, fieldName: string, incrementBy = 1) {
    if (!db) {
      console.debug("Firestore not available - running in demo mode")
      return
    }
    try {
      const docRef = doc(db, collectionName, docId)
      await updateDoc(docRef, {
        [fieldName]: increment(incrementBy),
        updatedAt: serverTimestamp(),
      })
    } catch (error: any) {
      console.debug("Firestore incrementField error:", error.message)
      throw error
    }
  },

  // Add to array field
  async addToArray(collectionName: string, docId: string, fieldName: string, value: any) {
    if (!db) {
      console.debug("Firestore not available - running in demo mode")
      return
    }
    try {
      const docRef = doc(db, collectionName, docId)
      await updateDoc(docRef, {
        [fieldName]: arrayUnion(value),
        updatedAt: serverTimestamp(),
      })
    } catch (error: any) {
      console.debug("Firestore addToArray error:", error.message)
      throw error
    }
  },

  // Remove from array field
  async removeFromArray(collectionName: string, docId: string, fieldName: string, value: any) {
    if (!db) {
      console.debug("Firestore not available - running in demo mode")
      return
    }
    try {
      const docRef = doc(db, collectionName, docId)
      await updateDoc(docRef, {
        [fieldName]: arrayRemove(value),
        updatedAt: serverTimestamp(),
      })
    } catch (error: any) {
      console.debug("Firestore removeFromArray error:", error.message)
      throw error
    }
  },
}

// Storage utility functions
export const storageUtils = {
  // Upload a file
  async uploadFile(path: string, file: File | Blob): Promise<string> {
    if (!storage) {
      console.debug("Storage not available - running in demo mode")
      return ""
    }
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    return await getDownloadURL(snapshot.ref)
  },

  // Upload with progress tracking
  uploadFileWithProgress(path: string, file: File | Blob): UploadTask {
    if (!storage) {
      throw new Error("Storage not available")
    }
    const storageRef = ref(storage, path)
    return uploadBytesResumable(storageRef, file)
  },

  // Get download URL
  async getDownloadURL(path: string): Promise<string> {
    if (!storage) {
      console.debug("Storage not available - running in demo mode")
      return ""
    }
    const storageRef = ref(storage, path)
    return await getDownloadURL(storageRef)
  },

  // Delete a file
  async deleteFile(path: string): Promise<void> {
    if (!storage) {
      console.debug("Storage not available - running in demo mode")
      return
    }
    const storageRef = ref(storage, path)
    await deleteObject(storageRef)
  },
}

// Common query constraints
export const queryConstraints = {
  whereEqual: (field: string, value: any) => where(field, "==", value),
  whereIn: (field: string, values: any[]) => where(field, "in", values),
  whereGreaterThan: (field: string, value: any) => where(field, ">", value),
  whereLessThan: (field: string, value: any) => where(field, "<", value),
  orderByAsc: (field: string) => orderBy(field, "asc"),
  orderByDesc: (field: string) => orderBy(field, "desc"),
  limitTo: (count: number) => limit(count),
}

// Server timestamp helper
export { serverTimestamp }
