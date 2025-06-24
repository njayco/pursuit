import { initializeApp } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getStorage, connectStorageEmulator } from "firebase/storage"
import { getAnalytics } from "firebase/analytics"

// Validate required environment variables
const requiredEnvVars = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
}

// Check for missing environment variables
const missingVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => `NEXT_PUBLIC_FIREBASE_${key.toUpperCase()}`)

if (missingVars.length > 0) {
  console.error("Missing Firebase environment variables:", missingVars.join(", "))
  console.error("Please check your .env.local file and ensure all Firebase environment variables are set.")
}

// Firebase configuration with fallback values for development
const firebaseConfig = {
  apiKey: requiredEnvVars.apiKey || "demo-api-key",
  authDomain: requiredEnvVars.authDomain || "demo-project.firebaseapp.com",
  projectId: requiredEnvVars.projectId || "demo-project",
  storageBucket: requiredEnvVars.storageBucket || "demo-project.appspot.com",
  messagingSenderId: requiredEnvVars.messagingSenderId || "123456789",
  appId: requiredEnvVars.appId || "1:123456789:web:abcdef",
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase only if we have valid configuration
let app: any = null
let auth: any = null
let db: any = null
let storage: any = null
let analytics: any = null

try {
  // Only initialize if we have a valid API key
  if (firebaseConfig.apiKey && firebaseConfig.apiKey !== "demo-api-key") {
    app = initializeApp(firebaseConfig)
    auth = getAuth(app)
    db = getFirestore(app)
    storage = getStorage(app)

    // Initialize Analytics only in browser environment and with valid config
    if (typeof window !== "undefined" && firebaseConfig.measurementId) {
      analytics = getAnalytics(app)
    }

    // Connect to emulators in development
    if (process.env.NODE_ENV === "development" && typeof window !== "undefined") {
      try {
        // Only connect to emulators if not already connected
        if (!auth.config?.emulator) {
          connectAuthEmulator(auth, "http://localhost:9099", { disableWarnings: true })
        }
      } catch (error) {
        // Emulator connection is optional in development
        console.log("Auth emulator not available or already connected")
      }

      try {
        if (!db._delegate?._databaseId?.projectId?.includes("demo-")) {
          connectFirestoreEmulator(db, "localhost", 8080)
        }
      } catch (error) {
        console.log("Firestore emulator not available or already connected")
      }

      try {
        if (!storage._location?.bucket?.includes("demo-")) {
          connectStorageEmulator(storage, "localhost", 9199)
        }
      } catch (error) {
        console.log("Storage emulator not available or already connected")
      }
    }
  } else {
    console.warn("Firebase not initialized: Invalid or missing API key")
    console.warn("The app will run in demo mode with limited functionality")
  }
} catch (error) {
  console.error("Firebase initialization error:", error)
  console.warn("The app will run in demo mode with limited functionality")
}

// Export with null checks
export { app, auth, db, storage, analytics }
export default app
